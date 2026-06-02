"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Spot } from "../types/spot";
import type { Translator } from "../utils/i18n";

const categories = [
  "Toilet",
  "Coin locker",
  "Trash bin",
  "ATM",
  "Smoking area",
  "Station exit",
];

interface SpotFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (spot: Omit<Spot, "id">) => void;
  defaultPosition: { lat: number; lng: number } | null;
  editingSpot?: Spot | null;
  t: Translator;
}

export default function SpotForm({ open, onClose, onSubmit, defaultPosition, editingSpot, t }: SpotFormProps) {
  const [name, setName] = useState(editingSpot?.name ?? "");
  const [category, setCategory] = useState(editingSpot?.category ?? categories[0]);
  const [description, setDescription] = useState(editingSpot?.description ?? "");
  const [note, setNote] = useState(editingSpot?.note ?? "");
  const [tags, setTags] = useState(editingSpot?.tags.join(", ") ?? "");
  const [hours, setHours] = useState(editingSpot?.hours ?? "24 hours");
  const [payment, setPayment] = useState(editingSpot?.payment ?? "Free");
  const [insideStation, setInsideStation] = useState(editingSpot?.insideStation ?? true);
  const [lat, setLat] = useState(editingSpot?.lat ?? defaultPosition?.lat ?? 34.702485);
  const [lng, setLng] = useState(editingSpot?.lng ?? defaultPosition?.lng ?? 135.495951);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(editingSpot?.name ?? "");
    setCategory(editingSpot?.category ?? categories[0]);
    setDescription(editingSpot?.description ?? "");
    setNote(editingSpot?.note ?? "");
    setTags(editingSpot?.tags.join(", ") ?? "");
    setHours(editingSpot?.hours ?? "24 hours");
    setPayment(editingSpot?.payment ?? "Free");
    setInsideStation(editingSpot?.insideStation ?? true);
    setLat(editingSpot?.lat ?? defaultPosition?.lat ?? 34.702485);
    setLng(editingSpot?.lng ?? defaultPosition?.lng ?? 135.495951);
  }, [defaultPosition, editingSpot, open]);

  const tagList = useMemo(
    () => tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    [tags]
  );

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      category,
      description: description.trim(),
      note: note.trim(),
      tags: tagList,
      hours: hours.trim() || "24 hours",
      payment: payment.trim() || "Free",
      insideStation,
      verified: editingSpot?.verified ?? false,
      lastChecked: editingSpot?.lastChecked,
      lat: Number(lat),
      lng: Number(lng),
    });

    setName("");
    setCategory(categories[0]);
    setDescription("");
    setNote("");
    setTags("");
    setHours("24 hours");
    setPayment("Free");
    setInsideStation(true);
    setLat(defaultPosition?.lat ?? 34.702485);
    setLng(defaultPosition?.lng ?? 135.495951);
  };

  const title = editingSpot ? `${t("edit")}: ${editingSpot.name}` : t("submitNewLocation");
  const buttonLabel = editingSpot ? t("updateSpot") : t("saveSpot");

  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-slate-900/30 px-4 py-6 sm:px-6">
      <div className="w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              {editingSpot ? t("editSpot") : t("addSpot")}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
          >
            {t("close")}
          </button>
        </div>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="spot-name" className="mb-1 block text-sm font-medium text-slate-700">
              {t("name")}
            </label>
            <input
              id="spot-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="Example: Umeda Station ATM"
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              {t("category")}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t("insideStation")}
              <select
                value={insideStation ? "inside" : "outside"}
                onChange={(e) => setInsideStation(e.target.value === "inside")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              >
                <option value="inside">{t("insideStation")}</option>
                <option value="outside">{t("outsideStation")}</option>
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="spot-description" className="mb-1 block text-sm font-medium text-slate-700">
              {t("description")}
            </label>
            <textarea
              id="spot-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="Short English description"
            />
          </div>
          <div>
            <label htmlFor="spot-note" className="mb-1 block text-sm font-medium text-slate-700">
              {t("touristNote")}
            </label>
            <textarea
              id="spot-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="Advice for visitors"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label htmlFor="spot-tags" className="block text-sm font-medium text-slate-700">
              {t("tags")}
            </label>
            <input
              id="spot-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="e.g. indoor, accessible"
            />
            <label htmlFor="spot-hours" className="block text-sm font-medium text-slate-700">
              {t("openingHours")}
            </label>
            <input
              id="spot-hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="Open daily 10:00-21:00"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label htmlFor="spot-payment" className="block text-sm font-medium text-slate-700">
              {t("paymentNote")}
            </label>
            <input
              id="spot-payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="Free, 200 JPY fee, etc."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <label htmlFor="spot-lat" className="block text-sm font-medium text-slate-700">
                {t("latitude")}
              </label>
              <input
                id="spot-lat"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                type="number"
                step="0.000001"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              />
              <label htmlFor="spot-lng" className="block text-sm font-medium text-slate-700">
                {t("longitude")}
              </label>
              <input
                id="spot-lng"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                type="number"
                step="0.000001"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">{t("currentLocationAutofill")}</p>
            <button
              type="submit"
              data-testid="submit-spot-button"
              className="rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              {buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
