"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-white/40" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search metadata, best for, pros/cons..."
        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-[var(--primary-accent)] focus:ring-1 focus:ring-[var(--primary-accent)] transition-all glass-panel"
      />
    </div>
  );
}
