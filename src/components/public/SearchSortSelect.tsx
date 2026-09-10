"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function SearchSortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-sand/30 border border-ink/10 text-ink text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary/50 font-medium"
    >
      <option value="recent">Plus récents</option>
      <option value="price_asc">Prix croissant</option>
      <option value="price_desc">Prix décroissant</option>
    </select>
  );
}
