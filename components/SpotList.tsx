import type { Spot } from "../types/spot";

type SpotWithDistance = Spot & {
  distance?: number | null;
};

interface SpotListProps {
  spots: SpotWithDistance[];
  position: { lat: number; lng: number } | null;
  onSelect: (spot: SpotWithDistance) => void;
}

export default function SpotList({ spots, position, onSelect }: SpotListProps) {
  return (
    <div className="mt-4 rounded-3xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900">Nearby spots</p>
          <p className="text-xs text-slate-500">Tap a spot to see details.</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
          {position ? "Sorted by distance" : "Showing category list"}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {spots.slice(0, 10).map((spot) => (
          <button
            key={spot.id}
            type="button"
            data-testid={`spot-card-${spot.id}`}
            onClick={() => onSelect(spot)}
            className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-primary"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{spot.name}</p>
                <p className="mt-1 text-sm text-slate-600">{spot.category}</p>
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
        ))}
      </div>
    </div>
  );
}
