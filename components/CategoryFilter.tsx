import { categoryColors } from "../utils/constants";
import type { Translator } from "../utils/i18n";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
  t: Translator;
}

export default function CategoryFilter({ categories, selectedCategory, onChange, t }: CategoryFilterProps) {
  return (
    <div className="mt-4 overflow-x-auto pb-2">
      <div className="flex min-w-max gap-2">
        <button
          type="button"
          data-testid="category-filter-all"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === null
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-slate-100 text-slate-700"
          }`}
          onClick={() => onChange(null)}
        >
          {t("all")}
        </button>
        {categories.map((category) => {
          const color = categoryColors[category];
          return (
            <button
              key={category}
              type="button"
              data-testid={`category-filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? `border-[${color.border}] bg-[${color.bg}] text-[${color.text}]`
                  : "border-slate-200 bg-slate-100 text-slate-700"
              }`}
              style={
                selectedCategory === category
                  ? {
                      borderColor: color.border,
                      backgroundColor: color.bg,
                      color: color.text,
                    }
                  : {}
              }
              onClick={() => onChange(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
