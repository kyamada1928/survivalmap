import type { Spot } from "../types/spot";
import { categoryColors } from "../utils/constants";
import type { Translator } from "../utils/i18n";

type SpotWithDistance = Spot & {
  distance?: number | null;
};

interface SpotListProps {
  spots: SpotWithDistance[];
  position: { lat: number; lng: number } | null;
  onSelect: (spot: SpotWithDistance) => void;
  t: Translator;
}

export default function SpotList({ spots, position, onSelect, t }: SpotListProps) {
  return (
    <div className="mt-4 rounded-3xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900">{t("nearbySpots")}</p>
          <p className="text-xs text-slate-500">{t("tapSpot")}</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
          {position ? t("sortedByDistance") : t("categoryList")}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {spots.slice(0, 10).map((spot) => {
          const color = categoryColors[spot.category];
          return (
            <button
              key={spot.id}
              type="button"
              data-testid={`spot-card-${spot.id}`}
              onClick={() => onSelect(spot)}
              className="w-full rounded-3xl border bg-white p-4 text-left shadow-sm transition"
              style={{ borderColor: color.border }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">{spot.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {spot.category}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        spot.verified === true ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {spot.verified === true ? t("verified") : t("needsReview")}
                    </span>
                  </div>
                </div>
                {spot.distance != null ? (
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {spot.distance < 1
                      ? `${Math.round(spot.distance * 1000)} m`
                      : `${spot.distance.toFixed(1)} km`}
                  </div>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-slate-600">{spot.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
