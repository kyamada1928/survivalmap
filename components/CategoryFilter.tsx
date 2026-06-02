interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="mt-4 overflow-x-auto pb-2">
      <div className="flex min-w-max gap-2">
        <button
          type="button"
          data-testid="category-filter-all"
          className={`rounded-full border px-4 py-2 text-sm transition ${
            selectedCategory === null
              ? "border-primary bg-primary text-white"
              : "border-slate-200 bg-slate-100 text-slate-700"
          }`}
          onClick={() => onChange(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            data-testid={`category-filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selectedCategory === category
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-slate-100 text-slate-700"
            }`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
