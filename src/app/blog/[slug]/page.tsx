import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { HomeFooter } from "@/components/public/HomeFooter";
import { ArticleBlocks } from "@/components/public/ArticleBlocks";
import { posts } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} - iziBooking`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      <PageHero eyebrow={post.category} title={post.title} description={post.excerpt} />

      <article className="px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink mb-8">
            <ArrowLeft size={16} /> Tous les articles
          </Link>

          {post.image && (
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-10 shadow-sm">
              <Image src={post.image} alt={post.title} fill priority className="object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-8 pb-8 border-b border-ink/10">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> {format(parseISO(post.date), "d MMMM yyyy", { locale: fr })}
            </span>
            {post.readingMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {post.readingMinutes} min de lecture
              </span>
            )}
          </div>

          <ArticleBlocks blocks={post.content} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-[#EEF1F8] py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <h2 className="font-heading font-bold text-xl text-ink mb-6">À lire aussi</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow"
                >
                  <span className="text-xs font-bold tracking-[0.08em] uppercase text-primary">{p.category}</span>
                  <h3 className="font-heading font-bold text-lg text-ink mt-2 leading-snug">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <HomeFooter />
    </div>
  );
}
