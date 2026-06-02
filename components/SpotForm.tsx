"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Spot } from "../types/spot";

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
}

export default function SpotForm({ open, onClose, onSubmit, defaultPosition }: SpotFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [hours, setHours] = useState("24 hours");
  const [payment, setPayment] = useState("Free");
  const [insideStation, setInsideStation] = useState(true);
  const [lat, setLat] = useState(defaultPosition?.lat ?? 34.702485);
  const [lng, setLng] = useState(defaultPosition?.lng ?? 135.495951);

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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 px-4 py-6 sm:px-6">
      <div className="w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Add spot</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Submit a new location</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
          >
            Close
          </button>
        </div>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="spot-name" className="mb-1 block text-sm font-medium text-slate-700">
              Name
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
              Category
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
              Inside station
              <select
                value={insideStation ? "inside" : "outside"}
                onChange={(e) => setInsideStation(e.target.value === "inside")}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              >
                <option value="inside">Inside station</option>
                <option value="outside">Outside station</option>
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="spot-description" className="mb-1 block text-sm font-medium text-slate-700">
              Description
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
              Tourist note
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
              Tags
            </label>
            <input
              id="spot-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="e.g. indoor, accessible"
            />
            <label htmlFor="spot-hours" className="block text-sm font-medium text-slate-700">
              Hours
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
              Payment note
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
                Latitude
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
                Longitude
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
            <p className="text-sm text-slate-500">Current location auto-fills coordinates if available.</p>
            <button
              type="submit"
              data-testid="submit-spot-button"
              className="rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Save spot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
