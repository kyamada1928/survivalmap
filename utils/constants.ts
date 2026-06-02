export const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Toilet: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" },
  "Coin locker": { bg: "#dbeafe", text: "#1e3a8a", border: "#3b82f6" },
  "Trash bin": { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
  ATM: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
  "Smoking area": { bg: "#e0e7ff", text: "#3730a3", border: "#6366f1" },
  "Station exit": { bg: "#ede9fe", text: "#5b21b6", border: "#8b5cf6" },
};

export function getCategoryColor(category?: string): string {
  if (!category || !(category in categoryColors)) {
    return "#64748b";
  }
  return categoryColors[category].border;
}
