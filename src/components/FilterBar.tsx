"use client";

import { clsx } from "clsx";

interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const TIER_FILTERS = ["All", "Free", "Freemium", "Paid"];

export default function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {TIER_FILTERS.map((tier) => (
        <button
          key={tier}
          onClick={() => onFilterChange(tier)}
          className={clsx(
            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
            currentFilter === tier
              ? "bg-[var(--primary-accent)] text-black border-[var(--primary-accent)] shadow-[0_0_15px_rgba(0,255,204,0.3)]"
              : "bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
          )}
        >
          {tier}
        </button>
      ))}
    </div>
  );
}
