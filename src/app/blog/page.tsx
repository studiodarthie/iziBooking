import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PenLine, Sparkles, Lightbulb, Music2, Megaphone, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { HomeFooter } from "@/components/public/HomeFooter";
import { BLOG_CATEGORIES, UPCOMING_TOPICS, posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog - iziBooking",
  description:
    "Conseils pour organiser vos événements, guides pour les prestataires et actualités de la scène africaine.",
};

const CATEGORY_ICONS = [Lightbulb, PenLine, Music2, Megaphone];

export default function BlogPage() {
  const published = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Inspirations & conseils <span className="text-primary">pour vos événements.</span>
          </>
        }
        description="Guides pratiques, retours d'expérience et coulisses de la scène événementielle africaine. Nos premiers articles arrivent bientôt."
      />

      {/* Catégories */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-14 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BLOG_CATEGORIES.map((c, i) => {
            const Icon = CATEGORY_ICONS[i] ?? Sparkles;
            return (
              <div key={c.name} className="bg-white rounded-3xl border border-neutral-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Icon size={24} strokeWidth={1.8} /></span>
                <h2 className="font-heading font-bold text-lg text-ink mt-4">{c.name}</h2>
                <p className="text-sm text-neutral-600 leading-relaxed mt-2">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {published.length > 0 ? (
        <section className="bg-[#FCEFDD] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mb-10">Derniers articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-primary/10">
                    {p.image && <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold tracking-[0.08em] uppercase text-primary">{p.category}</span>
                    <h3 className="font-heading font-bold text-xl text-ink mt-2">{p.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mt-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#FCEFDD] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-2 bg-white text-primary text-xs font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full">
                <Sparkles size={14} /> Bientôt
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-4">Au programme</h2>
              <p className="text-neutral-700 mt-3">Les premiers sujets sur lesquels nous travaillons.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {UPCOMING_TOPICS.map((t) => (
                <div key={t.title} className="bg-white rounded-3xl p-6 border border-white shadow-sm">
                  <span className="text-xs font-bold tracking-[0.08em] uppercase text-primary">{t.category}</span>
                  <h3 className="font-heading font-bold text-xl text-ink mt-2 leading-snug">{t.title}</h3>
                  <span className="inline-block mt-4 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-full px-3 py-1">À paraître</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proposer un sujet */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-accent-600 text-white rounded-[2rem] p-8 md:p-12 text-center">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl">Un sujet à nous suggérer ?</h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto leading-relaxed">
            Prestataire ou organisateur, dites-nous ce que vous aimeriez lire. Nous construisons ce blog avec la communauté.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 mt-7 bg-white text-primary font-bold rounded-full px-6 py-3 hover:bg-accent-2-100 transition-colors">
            Proposer un sujet <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
