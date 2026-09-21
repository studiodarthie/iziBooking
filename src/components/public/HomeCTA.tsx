import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HomeCTA() {
  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-16 md:pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-accent-600 text-white grid md:grid-cols-[1.7fr_1fr] items-center">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-accent-2-500/30" />
        <div className="relative p-8 md:p-14">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl leading-tight md:whitespace-nowrap">
            Vous êtes artiste ou prestataire ?
          </h2>
          <p className="mt-4 text-white/90 max-w-md leading-relaxed">
            Créez votre profil gratuitement, recevez des demandes qualifiées et encaissez vos acomptes en toute sécurité.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/onboarding" className="inline-flex items-center gap-2 bg-white text-primary font-bold rounded-full px-6 py-3 hover:bg-accent-2-100 transition-colors">
              Inscription gratuite <ArrowRight size={18} />
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 border border-white/60 text-white font-semibold rounded-full px-6 py-3 hover:bg-white/10 transition-colors">
              Explorer le catalogue
            </Link>
          </div>
        </div>
        <div className="relative hidden md:block h-full min-h-[300px]">
          <Image src="/images/home/costume-dancers.jpg" alt="Danseurs en costumes traditionnels" fill className="object-cover [mask-image:linear-gradient(to_right,transparent,black_35%)]" />
        </div>
      </div>
    </section>
  );
}
