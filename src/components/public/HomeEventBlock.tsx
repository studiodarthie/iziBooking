import Image from "next/image";
import Link from "next/link";

// Confettis décoratifs : position (%), taille (px), rotation (deg), couleur, forme.
const CONFETTI = [
  { top: "6%", left: "12%", w: 22, h: 10, r: 25, c: "bg-primary", round: false },
  { top: "12%", left: "52%", w: 12, h: 12, r: 0, c: "bg-accent-2-500", round: true },
  { top: "4%", left: "80%", w: 24, h: 9, r: -30, c: "bg-trust", round: false },
  { top: "34%", left: "2%", w: 14, h: 14, r: 0, c: "bg-accent-2-300", round: true },
  { top: "44%", left: "94%", w: 26, h: 10, r: 40, c: "bg-primary", round: false },
  { top: "72%", left: "6%", w: 22, h: 9, r: -20, c: "bg-accent-2-500", round: false },
  { top: "86%", left: "58%", w: 12, h: 12, r: 0, c: "bg-primary", round: true },
  { top: "90%", left: "88%", w: 20, h: 9, r: 30, c: "bg-trust", round: false },
];

export function HomeEventBlock() {
  return (
    <section className="bg-[#F6EBDD] py-8 md:py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-center">
        {/* Visuel : deux photos + confettis */}
        <div className="relative mx-auto w-full max-w-[380px] h-[240px] md:h-[280px]">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              aria-hidden
              className={`absolute ${c.c} ${c.round ? "rounded-full" : "rounded-sm"} opacity-90`}
              style={{ top: c.top, left: c.left, width: c.w, height: c.h, transform: `rotate(${c.r}deg)` }}
            />
          ))}
          <div className="absolute top-4 left-4 w-[68%] h-[74%] rounded-[2rem] overflow-hidden shadow-2xl -rotate-2 border-4 border-white">
            <Image src="/images/home/event-artist.jpg" alt="Artiste chantant sur scène" fill sizes="320px" className="object-cover object-[center_30%]" />
          </div>
          <div className="absolute bottom-2 right-2 w-[52%] h-[46%] rounded-[2rem] overflow-hidden shadow-2xl rotate-3 border-4 border-white">
            <Image src="/images/home/wedding-dance.jpg" alt="Première danse des mariés" fill sizes="240px" className="object-cover object-left" />
          </div>
        </div>

        {/* Texte */}
        <div>
          <h2 className="font-heading font-extrabold text-2xl md:text-[34px] leading-[1.1] text-ink">
            Voulez-vous que votre événement soit une réussite ?
          </h2>
          <p className="mt-3 text-neutral-700 text-base leading-relaxed max-w-lg">
            Quel que soit votre événement ou votre célébration, nous sommes là pour faire de votre journée spéciale un moment inoubliable.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 mt-5 bg-primary hover:bg-accent-600 text-white font-bold rounded-xl px-6 py-3 transition-colors shadow-lg shadow-primary/25"
          >
            Voir les disponibilités <span aria-hidden>🎉</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
