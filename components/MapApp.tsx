"use client";

import { useEffect, useMemo, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import MapView from "./MapView";
import ReportForm from "./ReportForm";
import SpotForm from "./SpotForm";
import SpotList from "./SpotList";
import BottomSheet from "./BottomSheet";
import spotsData from "../data/spots.json";
import { getTranslator, type Locale } from "../utils/i18n";
import { fetchApprovedRemoteSpots, isSupabaseConfigured, syncLocalChanges } from "../utils/supabaseSync";
import type { SpotReport } from "../types/report";
import type { Spot } from "../types/spot";

const categories = [
  "Toilet",
  "Coin locker",
  "Trash bin",
  "ATM",
  "Smoking area",
  "Station exit",
];

function getDistance(origin: { lat: number; lng: number }, target: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(target.lat - origin.lat);
  const dLon = toRad(target.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(target.lat)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

export default function MapApp() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "pending" | "granted" | "denied">("idle");
  const [isOnline, setIsOnline] = useState(true);
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    return window.localStorage.getItem("umeda-locale") === "ja" ? "ja" : "en";
  });
  const [userSpots, setUserSpots] = useState<Spot[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem("umeda-user-spots");
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [reports, setReports] = useState<SpotReport[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem("umeda-spot-reports");
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [remoteSpots, setRemoteSpots] = useState<Spot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [reportingSpot, setReportingSpot] = useState<Spot | null>(null);
  const [reportSaved, setReportSaved] = useState(false);
  const [syncState, setSyncState] = useState<"local" | "ready" | "syncing" | "error">(
    isSupabaseConfigured() ? "ready" : "local"
  );

  const t = useMemo(() => getTranslator(locale), [locale]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoState("denied");
      return;
    }

    setGeoState("pending");
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition({ lat: location.coords.latitude, lng: location.coords.longitude });
        setGeoState("granted");
      },
      () => {
        setGeoState("denied");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem("umeda-user-spots", JSON.stringify(userSpots));
  }, [userSpots]);

  useEffect(() => {
    window.localStorage.setItem("umeda-spot-reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    window.localStorage.setItem("umeda-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline || !isSupabaseConfigured()) {
      setSyncState(isSupabaseConfigured() ? "ready" : "local");
      return;
    }

    let cancelled = false;
    setSyncState("syncing");

    syncLocalChanges({ userSpots, reports }).then((result) => {
      if (cancelled) {
        return;
      }

      if (result.error) {
        setSyncState("error");
        return;
      }

      if (result.syncedReports.length > 0) {
        setReports((current) =>
          current.map((report) =>
            result.syncedReports.includes(report.id) ? { ...report, synced: true } : report
          )
        );
      }

      setSyncState(result.enabled ? "ready" : "local");
    });

    return () => {
      cancelled = true;
    };
  }, [isOnline, reports, userSpots]);

  useEffect(() => {
    if (!isOnline || !isSupabaseConfigured()) {
      return;
    }

    let cancelled = false;

    const loadRemoteSpots = () => {
      fetchApprovedRemoteSpots()
        .then((spots) => {
          if (!cancelled) {
            setRemoteSpots(spots);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setSyncState("error");
          }
        });
    };

    loadRemoteSpots();
    const intervalId = window.setInterval(loadRemoteSpots, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isOnline]);

  const allSpots = useMemo(() => {
    const localIds = new Set(userSpots.map((spot) => spot.id));
    const visibleRemoteSpots = remoteSpots.filter((spot) => !localIds.has(spot.id));
    return [...userSpots, ...visibleRemoteSpots, ...spotsData];
  }, [remoteSpots, userSpots]);

  const filteredSpots = useMemo(() => {
    return allSpots.filter((spot) => !selectedCategory || spot.category === selectedCategory);
  }, [selectedCategory, allSpots]);

  const spotsWithDistance = useMemo(() => {
    return filteredSpots.map((spot) => {
      const distance = position ? getDistance(position, { lat: spot.lat, lng: spot.lng }) : null;
      return { ...spot, distance };
    });
  }, [filteredSpots, position]);

  const sortedSpots = useMemo(() => {
    if (position) {
      return [...spotsWithDistance].sort((a, b) => {
        const aDist = a.distance ?? Infinity;
        const bDist = b.distance ?? Infinity;
        return aDist - bDist;
      });
    }
    return spotsWithDistance;
  }, [spotsWithDistance, position]);

  const headerText =
    geoState === "pending"
      ? t("findingLocation")
      : geoState === "granted"
      ? t("locationEnabled")
      : t("locationDenied");

  const syncText =
    syncState === "syncing"
      ? t("syncing")
      : syncState === "ready"
      ? t("supabaseReady")
      : isOnline
      ? t("localOnly")
      : t("queuedOffline");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 sm:px-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{t("appEyebrow")}</p>
              <h1 className="mt-1 text-2xl font-semibold">{t("appTitle")}</h1>
              <p className="mt-2 text-sm text-slate-500">{headerText}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <label className="text-xs text-slate-500">
                {t("language")}
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as Locale)}
                  className="ml-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                  aria-label={t("language")}
                >
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </label>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{t("offlineReady")}</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">{isOnline ? t("online") : t("queuedOffline")}</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">{syncText}</span>
            </div>
            <button
              type="button"
              data-testid="open-spot-form-button"
              onClick={() => {
                setEditingSpot(null);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              {t("addNewSpot")}
            </button>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
            t={t}
          />
          <SpotForm
            open={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingSpot(null);
            }}
            onSubmit={(spot) => {
              if (editingSpot && editingSpot.id.startsWith("user-")) {
                setUserSpots((current) => {
                  const updated = current.map((s) =>
                    s.id === editingSpot.id ? { ...spot, id: editingSpot.id } : s
                  );
                  window.localStorage.setItem("umeda-user-spots", JSON.stringify(updated));
                  return updated;
                });
                setSelectedSpot((prev) => (prev?.id === editingSpot.id ? { ...spot, id: editingSpot.id } : prev));
              } else {
                const id = `user-${Date.now()}`;
                const newSpot = { ...spot, id };
                setUserSpots((current) => {
                  const updated = [...current, newSpot];
                  window.localStorage.setItem("umeda-user-spots", JSON.stringify(updated));
                  return updated;
                });
                setSelectedSpot(newSpot);
              }
              setShowForm(false);
              setEditingSpot(null);
              setSelectedCategory(spot.category);
            }}
            defaultPosition={position}
            editingSpot={editingSpot}
            t={t}
          />
          <ReportForm
            open={reportingSpot != null}
            spot={reportingSpot}
            t={t}
            onClose={() => setReportingSpot(null)}
            onSubmit={(report) => {
              setReports((current) => [...current, report]);
              setReportSaved(true);
              setReportingSpot(null);
              window.setTimeout(() => setReportSaved(false), 3000);
            }}
          />
          {reportSaved && (
            <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
              {t("reportSubmitted")}
            </p>
          )}
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <MapView spots={filteredSpots} position={position} onViewMore={setSelectedSpot} t={t} />
          </div>
          <SpotList spots={sortedSpots} position={position} onSelect={setSelectedSpot} t={t} />
        </div>
      </div>
      <BottomSheet
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        position={position}
        isUserSpot={selectedSpot?.id.startsWith("user-")}
        onEdit={(spot) => {
          setEditingSpot(spot);
          setShowForm(true);
          setSelectedSpot(null);
        }}
        onDelete={(spotId) => {
          setUserSpots((current) => {
            const updated = current.filter((s) => s.id !== spotId);
            window.localStorage.setItem("umeda-user-spots", JSON.stringify(updated));
            return updated;
          });
        }}
        onReport={(spot) => setReportingSpot(spot)}
        t={t}
      />
    </main>
  );
}
