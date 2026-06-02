"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CategoryFilter from "./CategoryFilter";
import SpotForm from "./SpotForm";
import SpotList from "./SpotList";
import BottomSheet from "./BottomSheet";
import spotsData from "../data/spots.json";
import type { Spot } from "../types/spot";

const center: [number, number] = [34.702485, 135.495951];

const categories = [
  "Toilet",
  "Coin locker",
  "Trash bin",
  "ATM",
  "Smoking area",
  "Station exit",
];

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Toilet");
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "pending" | "granted" | "denied">("idle");
  const [userSpots, setUserSpots] = useState<Spot[]>([]);
  const [showForm, setShowForm] = useState(false);

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
    const saved = window.localStorage.getItem("umeda-user-spots");
    if (saved) {
      try {
        setUserSpots(JSON.parse(saved));
      } catch {
        setUserSpots([]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("umeda-user-spots", JSON.stringify(userSpots));
  }, [userSpots]);

  const allSpots = useMemo(() => {
    return [...spotsData, ...userSpots];
  }, [userSpots]);

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
      ? "Finding your location..."
      : geoState === "granted"
      ? "Location enabled. Showing nearby spots."
      : "Location denied or unavailable. Showing Umeda center.";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Japan Survival Map</p>
              <h1 className="mt-2 text-2xl font-semibold">Umeda Essentials</h1>
            </div>
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">Mobile web PWA</div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">{headerText}</p>
            <button
              type="button"
              data-testid="open-spot-form-button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Add new spot
            </button>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
          <SpotForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={(spot) => {
              const id = `user-${Date.now()}`;
              setUserSpots((current) => [...current, { ...spot, id }]);
              setShowForm(false);
              setSelectedCategory(spot.category);
              setSelectedSpot({ ...spot, id });
            }}
            defaultPosition={position}
          />
          <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200 shadow-sm">
            <MapContainer
              center={position ? [position.lat, position.lng] : center}
              zoom={16}
              scrollWheelZoom={false}
              className="h-[44vh] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {position && (
                <Marker position={[position.lat, position.lng]} icon={defaultIcon}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
              {filteredSpots.map((spot) => (
                <Marker
                  key={spot.id}
                  position={[spot.lat, spot.lng]}
                  icon={defaultIcon}
                  eventHandlers={{ click: () => setSelectedSpot(spot) }}
                >
                  <Popup>
                    <div>
                      <strong>{spot.name}</strong>
                      <p className="text-sm">{spot.category}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <SpotList spots={sortedSpots} position={position} onSelect={setSelectedSpot} />
        </div>
      </div>
      <BottomSheet spot={selectedSpot} onClose={() => setSelectedSpot(null)} position={position} />
    </main>
  );
}
