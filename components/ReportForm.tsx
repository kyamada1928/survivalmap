"use client";

import { useState, type FormEvent } from "react";
import type { Spot } from "../types/spot";
import type { SpotReport } from "../types/report";
import type { Translator } from "../utils/i18n";

const reportTypes = ["Closed or missing", "Wrong location", "Wrong hours", "Unsafe or dirty", "Other"];

interface ReportFormProps {
  spot: Spot | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (report: SpotReport) => void;
  t: Translator;
}

export default function ReportForm({ spot, open, onClose, onSubmit, t }: ReportFormProps) {
  const [type, setType] = useState(reportTypes[0]);
  const [details, setDetails] = useState("");

  if (!open || !spot) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      id: `report-${Date.now()}`,
      spotId: spot.id,
      spotName: spot.name,
      type,
      details: details.trim(),
      createdAt: new Date().toISOString(),
      synced: false,
    });

    setType(reportTypes[0]);
    setDetails("");
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-slate-900/40 px-4 py-6 sm:px-6">
      <div className="w-full max-w-2xl rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("reportProblem")}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{t("reportTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">{spot.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {t("close")}
          </button>
        </div>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            {t("reportType")}
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            >
              {reportTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="report-details" className="block text-sm font-medium text-slate-700">
            {t("reportDetails")}
            <textarea
              id="report-details"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              className="mt-2 min-h-[112px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder="Example: The locker area was closed at 22:00."
            />
          </label>
          <button
            type="submit"
            data-testid="submit-report-button"
            className="w-full rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            {t("submitReport")}
          </button>
        </form>
      </div>
    </div>
  );
}
