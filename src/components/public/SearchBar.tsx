"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (query.trim()) params.append("q", query.trim());
    if (location.trim()) params.append("loc", location.trim());
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white rounded-2xl md:rounded-full shadow-lg border border-ink/10 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-ink/10"
    >
      <div className="flex-1 flex items-center px-6 py-4 md:py-2">
        <Search className="w-5 h-5 text-ink/40 shrink-0" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: DJ, Traiteur, Photographe..."
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-ink font-medium placeholder:font-normal placeholder:text-ink/40"
        />
      </div>
      
      <div className="flex-1 flex items-center px-6 py-4 md:py-2">
        <MapPin className="w-5 h-5 text-ink/40 shrink-0" />
        <input 
          type="text" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Où ? (ex: Douala, Paris)"
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-ink font-medium placeholder:font-normal placeholder:text-ink/40"
        />
      </div>

      <div className="p-2 md:w-auto w-full">
        <button 
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
