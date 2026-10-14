import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import type { ContentBlock } from "@/lib/blog";

/** Rend la liste de blocs typés d'un article de blog en JSX stylé, cohérent avec le reste du site. */
export function ArticleBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="font-heading font-bold text-2xl text-ink mt-10 first:mt-0">
                {block.text}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="text-neutral-700 text-[17px] leading-relaxed">
                {block.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-neutral-700 text-[17px] leading-relaxed">
                    <span className="text-primary font-bold shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-4">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-neutral-700 text-[17px] leading-relaxed">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            );
          case "tip":
            return (
              <div key={i} className="flex gap-3 bg-accent-2-100 border-l-4 border-accent-2 rounded-r-xl p-4">
                <Lightbulb size={20} className="text-accent-2-700 shrink-0 mt-0.5" />
                <p className="text-ink text-sm leading-relaxed">{block.text}</p>
              </div>
            );
          case "cta":
            return (
              <div key={i} className="bg-sand rounded-2xl border border-ink/10 p-6 text-center">
                <h3 className="font-heading font-bold text-lg text-ink">{block.heading}</h3>
                <p className="text-sm text-neutral-600 mt-1.5 max-w-md mx-auto">{block.text}</p>
                <Link
                  href={block.href}
                  className="inline-flex items-center gap-2 mt-4 bg-primary hover:bg-accent-600 text-white font-bold rounded-full px-6 py-2.5 text-sm transition-colors"
                >
                  {block.label} <ArrowRight size={16} />
                </Link>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
