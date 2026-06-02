import type { Spot } from "../types/spot";

interface BottomSheetProps {
  spot: Spot | null;
  onClose: () => void;
  position: { lat: number; lng: number } | null;
}

export default function BottomSheet({ spot, onClose, position }: BottomSheetProps) {
  if (!spot) {
    return null;
  }

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
    <div className="fixed inset-x-0 bottom-0 z-50 overflow-hidden">
      <div className="mx-auto max-w-2xl rounded-t-3xl border border-slate-200 bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Spot details</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{spot.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
          >
            Close
          </button>
        </div>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">Category</p>
            <p>{spot.category}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">Description</p>
            <p>{spot.description}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">Tourist note</p>
            <p>{spot.note}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-3">
              <p className="font-semibold">Opening hours</p>
              <p>{spot.hours}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-3">
              <p className="font-semibold">Payment</p>
              <p>{spot.payment}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">Inside / outside station</p>
            <p>{spot.insideStation ? "Inside station" : "Outside station"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {spot.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3">
            <p className="font-semibold">Distance</p>
            <p>
              {distance != null
                ? distance < 1
                  ? `${Math.round(distance * 1000)} m`
                  : `${distance.toFixed(1)} km`
                : "Unknown"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
