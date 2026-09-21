"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { BUDGETS, GENRES, OCCASIONS } from "@/lib/filters";

type Menu = { param: string; label: string; options: { value: string; label: string }[] };

const MENUS: Menu[] = [
  { param: "occasion", label: "Occasion", options: OCCASIONS.map((o) => ({ value: o, label: o })) },
  { param: "genre", label: "Genre", options: GENRES.map((g) => ({ value: g, label: g })) },
  { param: "budget", label: "Budget", options: BUDGETS },
];

/** Barre de menus déroulants du catalogue : chaque choix met à jour l'URL (les autres filtres sont conservés). */
export function CatalogFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const select = (param: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(param, value);
    else next.delete(param);
    setOpen(null);
    router.push(`${pathname}?${next.toString()}`);
  };

  const hasFilter = MENUS.some((m) => params.get(m.param));

  return (
    <div ref={rootRef} className="bg-white rounded-2xl border border-ink/10 shadow-lg shadow-black/5 px-3 md:px-6 flex items-center gap-1 md:gap-4 overflow-x-auto md:overflow-visible">
      {MENUS.map((menu) => {
        const current = params.get(menu.param);
        const selected = menu.options.find((o) => o.value === current);
        const isOpen = open === menu.param;
        return (
          <div key={menu.param} className="relative shrink-0">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : menu.param)}
              className={`flex items-center gap-2 h-16 px-3 md:px-4 text-[17px] font-medium transition-colors ${
                selected ? "text-primary" : "text-neutral-800 hover:text-ink"
              }`}
            >
              {selected ? selected.label : menu.label}
              <ChevronDown size={18} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <ul role="listbox" className="absolute left-0 top-full z-50 mt-1 min-w-[260px] max-h-[420px] overflow-y-auto rounded-2xl bg-neutral-100 border border-ink/10 shadow-2xl py-2">
                {selected && (
                  <li>
                    <button type="button" onClick={() => select(menu.param, null)} className="w-full text-left px-6 py-3 text-[16px] font-semibold text-primary hover:bg-white transition-colors">
                      Tous
                    </button>
                  </li>
                )}
                {menu.options.map((o) => (
                  <li key={o.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={o.value === current}
                      onClick={() => select(menu.param, o.value)}
                      className={`w-full text-left px-6 py-3 text-[16px] font-medium transition-colors hover:bg-white hover:text-ink ${
                        o.value === current ? "text-primary" : "text-neutral-800"
                      }`}
                    >
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {hasFilter && (
        <button
          type="button"
          onClick={() => {
            const next = new URLSearchParams(params.toString());
            MENUS.forEach((m) => next.delete(m.param));
            router.push(`${pathname}?${next.toString()}`);
          }}
          className="ml-auto shrink-0 flex items-center gap-1.5 text-sm font-semibold text-neutral-700 hover:text-primary px-3"
        >
          <X size={16} /> Effacer
        </button>
      )}
    </div>
  );
}
