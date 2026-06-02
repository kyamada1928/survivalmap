import type { Spot } from "../types/spot";
import type { Translator } from "../utils/i18n";

interface BottomSheetProps {
  spot: Spot | null;
  onClose: () => void;
  position: { lat: number; lng: number } | null;
  onEdit?: (spot: Spot) => void;
  onDelete?: (spotId: string) => void;
  onReport?: (spot: Spot) => void;
  isUserSpot?: boolean;
  t: Translator;
}

export default function BottomSheet({ spot, onClose, position, onEdit, onDelete, onReport, isUserSpot, t }: BottomSheetProps) {
  if (!spot) {
    return null;
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`;
  const appleMapsUrl = `https://maps.apple.com/?ll=${spot.lat},${spot.lng}&q=${encodeURIComponent(spot.name)}`;
  const isVerified = spot.verified === true;

  const handleDelete = () => {
    if (window.confirm(`Delete "${spot.name}"?`)) {
      onDelete?.(spot.id);
      onClose();
    }
  };

  const distance = position
    ? (() => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const dLat = toRad(spot.lat - position.lat);
        const dLon = toRad(spot.lng - position.lng);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(position.lat)) * Math.cos(toRad(spot.lat)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c;
      })()
    : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1200] overflow-hidden">
      <div className="mx-auto max-h-[82vh] max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{t("spotDetails")}</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{spot.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                {isUserSpot ? t("userSpot") : t("sampleSpot")}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-medium ${
                  isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {isVerified ? t("verified") : t("needsReview")}
              </span>
              {spot.lastChecked ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                  {t("lastChecked")}: {spot.lastChecked}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            {onReport && (
              <button
                type="button"
                data-testid={`report-spot-button-${spot.id}`}
                onClick={() => onReport(spot)}
                className="rounded-full bg-amber-100 px-3 py-2 text-sm text-amber-800 hover:bg-amber-200"
              >
                {t("reportProblem")}
              </button>
            )}
            {isUserSpot && onEdit && (
              <button
                type="button"
                data-testid={`edit-spot-button-${spot.id}`}
                onClick={() => onEdit(spot)}
                className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200"
              >
                {t("edit")}
              </button>
            )}
            {isUserSpot && onDelete && (
              <button
                type="button"
                data-testid={`delete-spot-button-${spot.id}`}
                onClick={handleDelete}
                className="rounded-full bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
              >
                {t("delete")}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
            >
              {t("close")}
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">{t("category")}</p>
            <p>{spot.category}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">{t("description")}</p>
            <p>{spot.description}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">{t("touristNote")}</p>
            <p>{spot.note}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-3">
              <p className="font-semibold">{t("openingHours")}</p>
              <p>{spot.hours}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-3">
              <p className="font-semibold">{t("payment")}</p>
              <p>{spot.payment}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">{t("insideOutside")}</p>
            <p>{spot.insideStation ? t("insideStation") : t("outsideStation")}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">{t("tags")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {spot.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">{t("distance")}</p>
            <p>
              {distance != null
                ? distance < 1
                  ? `${Math.round(distance * 1000)} m`
                  : `${distance.toFixed(1)} km`
                : t("unknown")
              }
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t("openInGoogleMaps")}
            </a>
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-800"
            >
              {t("openInAppleMaps")}
            </a>
          </div>
          <p className="rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
            {t("availabilityDisclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}

