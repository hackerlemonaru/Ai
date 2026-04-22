"use client";

import { useState, useMemo } from "react";
import { BentoGrid, BentoGridItem } from "@/components/BentoGrid";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import CustomCursor from "@/components/CustomCursor";
import { AnimatePresence, motion } from "framer-motion";

export interface Offer {
  id: number;
  offer_type: string;
  discount_code: string;
  description: string;
  valid_until: string;
}

export interface Tool {
  id: number;
  name: string;
  url: string;
  pricing_tier: string;
  best_for: string;
  pros: string;
  cons: string;
  cost_per_1m: string;
  free_tier_limit: string;
  status: "up" | "down" | "unknown";
  offers?: Offer[];
}

import { useEffect } from "react";

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tools) {
          setTools(data.tools);
        }
      })
      .catch(err => console.error("Error fetching tools:", err));
  }, []);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Pricing tier filter
      const matchesFilter = activeFilter === "All" || tool.pricing_tier === activeFilter;

      // Fuzzy search across metadata
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(searchLower) ||
        tool.best_for.toLowerCase().includes(searchLower) ||
        tool.pros.toLowerCase().includes(searchLower) ||
        tool.cons.toLowerCase().includes(searchLower);

      return matchesFilter && matchesSearch;
    });
  }, [tools, activeFilter, searchQuery]);

  const [selectedOffers, setSelectedOffers] = useState<Offer[] | null>(null);

  const handleAdminRefresh = async () => {
    try {
      const res = await fetch("/api/refresh", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen relative p-8 md:p-24 overflow-hidden">
      <CustomCursor />

      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary-accent)] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={handleAdminRefresh}
          className="absolute top-0 right-0 p-2 text-xs text-white/20 hover:text-white transition-colors"
        >
          Manual Sync
        </button>

        <header className="text-center mb-16 space-y-6 pt-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Deep Intel <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-accent)] to-blue-500">Matrix</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto text-lg"
          >
            High-performance hyper-dynamic AI Intelligence Platform
          </motion.p>
        </header>

        <SearchBar onSearch={setSearchQuery} />
        <FilterBar currentFilter={activeFilter} onFilterChange={setActiveFilter} />

        <BentoGrid>
          <AnimatePresence>
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={tool.id === 1 ? "md:col-span-2" : "md:col-span-1"}
              >
                <TiltCard status={tool.status}>
                  <BentoGridItem className="h-full border-0 shadow-none bg-transparent m-0 p-0 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold m-0">{tool.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${tool.status === 'up' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : tool.status === 'down' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-gray-500'} animate-pulse`} title={`Status: ${tool.status}`} />
                        </div>
                        <span className="text-xs px-3 py-1 bg-white/10 rounded-full font-normal border border-white/5 shrink-0">
                          {tool.pricing_tier}
                        </span>
                      </div>

                      <div className="mb-4 text-xs inline-block bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] px-3 py-1.5 rounded-md border border-[var(--primary-accent)]/20 shadow-[0_0_10px_rgba(0,255,204,0.1)]">
                        <strong>True Value:</strong> {tool.cost_per_1m} / 1M | {tool.free_tier_limit} limit
                      </div>

                      <a href={tool.url} target="_blank" rel="noreferrer" className="text-white/50 text-sm hover:text-[var(--primary-accent)] hover:underline mb-4 block truncate transition-colors">
                        {tool.url}
                      </a>

                      <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
                        <div>
                          <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">Best For</span>
                          <p className="text-sm text-white/90">{tool.best_for}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-green-400 uppercase tracking-wider block mb-1">Pros</span>
                            <p className="text-xs text-white/70">{tool.pros}</p>
                          </div>
                          <div>
                            <span className="text-xs text-red-400 uppercase tracking-wider block mb-1">Cons</span>
                            <p className="text-xs text-white/70">{tool.cons}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                      <MagneticButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOffers(tool.offers && tool.offers.length > 0 ? tool.offers : []);
                        }}
                        className="w-full text-sm py-2"
                      >
                        Unlock Pro Subscription Offers
                      </MagneticButton>
                    </div>
                  </BentoGridItem>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </BentoGrid>

        {filteredTools.length === 0 && (
          <div className="text-center text-white/40 mt-12">
            No intel matches your query.
          </div>
        )}

        <AnimatePresence>
          {selectedOffers !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedOffers(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl max-w-lg w-full glass-panel shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary-accent)] to-transparent" />

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-[var(--primary-accent)]">⚡</span> Pro Deals & Discounts
                </h2>

                {selectedOffers.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOffers.map((offer, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-[var(--primary-accent)] font-semibold bg-[var(--primary-accent)]/10 px-2 py-1 rounded">
                            {offer.offer_type}
                          </span>
                          <span className="text-xs text-white/40">Valid until: {new Date(offer.valid_until).toLocaleDateString()}</span>
                        </div>
                        <p className="text-white/80 text-sm mb-3">{offer.description}</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-black/50 p-2 rounded text-center font-mono text-lg border border-white/10">
                            {offer.discount_code}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(offer.discount_code)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors border border-white/5"
                            title="Copy Code"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/50 py-8">
                    No active offers found for this tool right now. Check back later!
                  </div>
                )}

                <button
                  onClick={() => setSelectedOffers(null)}
                  className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
