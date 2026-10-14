import { PublicNavbar } from "@/components/public/PublicNavbar";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  overlap = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  /** Laisse de la place pour qu'un bloc suivant chevauche le bas du hero. */
  overlap?: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1130] via-[#141D45] to-[#1E2A5E]">
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-culture/25 blur-3xl pointer-events-none" />
      <div className="absolute top-32 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/40 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      <PublicNavbar />
      <div className={`relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 ${overlap ? "pb-24 md:pb-28" : "pb-14 md:pb-20"}`}>
        <div className="max-w-3xl">
          <span className="inline-block bg-white/10 text-accent-2-300 text-[12px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
            {eyebrow}
          </span>
          <h1 className="font-heading font-extrabold text-[clamp(34px,4.4vw,58px)] leading-[1.05] text-white">{title}</h1>
          {description && <p className="mt-5 text-white/75 text-base md:text-lg leading-relaxed">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
