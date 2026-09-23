import Image from "next/image";
import { Music, Utensils, Camera, Users, Search, MapPin, Star, Sparkles } from "lucide-react";

function StoreBadge({ store, icon }: { store: string; icon: React.ReactNode }) {
  return (
    <div
      aria-disabled
      className="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-2.5 border border-white/20 select-none cursor-default"
    >
      {icon}
      <div className="leading-tight">
        <div className="text-[10px] uppercase tracking-wide text-white/70">Bientôt sur</div>
        <div className="font-heading font-bold text-xl">{store}</div>
      </div>
    </div>
  );
}

const AppleIcon = (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const PlayIcon = (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
    <path fill="#00A0FF" d="M3.6 1.5 13.5 12 3.6 22.5c-.3-.2-.5-.6-.5-1V2.5c0-.4.2-.8.5-1z" />
    <path fill="#00E676" d="M13.5 12 17 8.5 5.2 1.8c-.5-.3-1-.3-1.6-.3z" />
    <path fill="#FF3D57" d="M13.5 12 17 15.5 5.2 22.2c-.5.3-1 .3-1.6.3z" />
    <path fill="#FFC400" d="M17 8.5l4 2.3c.9.5.9 1.9 0 2.4L17 15.5 13.5 12z" />
  </svg>
);

const CATEGORIES = [
  { icon: Music, label: "Artistes" },
  { icon: Utensils, label: "Traiteurs" },
  { icon: Camera, label: "Photo" },
  { icon: Users, label: "Services" },
];

function PhoneMockup() {
  return (
    <div className="relative w-[250px] h-[470px] rounded-[2.6rem] border-[9px] border-neutral-900 bg-white shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-neutral-900 rounded-b-2xl z-10" />
      <div className="pt-7 px-3.5">
        <Image src="/logo.png" alt="iziBooking" width={1571} height={314} className="h-4 w-auto mx-auto" />
        <div className="mt-3 flex items-center gap-2 bg-neutral-100 rounded-lg px-2.5 py-2 text-[9px] text-neutral-600">
          <Search size={11} /> Rechercher un DJ, un traiteur…
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[8px] text-neutral-600"><MapPin size={9} /> Douala, Cameroun</div>

        <p className="mt-3 text-[10px] font-bold text-ink">Catégories</p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {CATEGORIES.map((c, i) => (
            <div key={c.label} className="flex flex-col items-center gap-1">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center ${i === 0 ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                <c.icon size={15} />
              </span>
              <span className="text-[7.5px] text-neutral-700">{c.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-3.5 text-[10px] font-bold text-ink">À la une</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { src: "/images/home/traditional-dance.jpg", name: "Ballet Ndolo" },
            { src: "/images/home/wedding-dance.jpg", name: "Studio Ébène" },
          ].map((c) => (
            <div key={c.name} className="rounded-lg overflow-hidden border border-neutral-200">
              <div className="relative h-20">
                <Image src={c.src} alt="" fill sizes="120px" className="object-cover" />
              </div>
              <div className="p-1.5">
                <p className="text-[8px] font-bold text-ink truncate">{c.name}</p>
                <p className="flex items-center gap-0.5 text-[7px] text-neutral-600"><Star size={7} className="fill-accent text-accent" /> Nouveau</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeAppBanner() {
  return (
    <section className="relative overflow-hidden bg-trust text-white">
      {/* Lignes décoratives */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" viewBox="0 0 1200 400" preserveAspectRatio="none" fill="none" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M-50 ${60 + i * 55} C 250 ${i * 40} 450 ${180 + i * 30} 750 ${90 + i * 45} S 1150 ${20 + i * 50} 1250 ${120 + i * 40}`} stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="absolute -top-20 right-[18%] w-72 h-72 rounded-full bg-accent-2-500/20 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-0 grid md:grid-cols-[1.5fr_1fr] gap-10 items-center">
        <div className="md:py-20">
          <span className="inline-flex items-center gap-2 bg-white/10 text-accent-2-300 text-xs font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full">
            <Sparkles size={14} /> Application mobile
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-[clamp(28px,2.6vw,34px)] md:whitespace-nowrap leading-[1.1] mt-4">
            iziBooking arrive bientôt <span className="text-accent-2-300">dans les stores.</span>
          </h2>
          <p className="mt-4 text-white/85 max-w-xl leading-relaxed">
            Trouvez, comparez et réservez vos prestataires depuis votre téléphone, où que vous soyez. L’application sera disponible très prochainement sur Android et iPhone.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <StoreBadge store="Google Play" icon={PlayIcon} />
            <StoreBadge store="l’App Store" icon={AppleIcon} />
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end h-[300px] md:h-[400px] overflow-hidden md:self-end">
          <div className="absolute bottom-[-60px] left-1/2 md:left-auto md:right-6 -translate-x-1/2 md:translate-x-0 w-[340px] h-[340px] rounded-full bg-white/10" />
          <Sparkles size={26} className="absolute top-6 left-[12%] text-accent-2-300" />
          <Sparkles size={18} className="absolute top-24 right-[6%] text-accent-2-300" />
          <div className="absolute top-8 md:right-14">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
