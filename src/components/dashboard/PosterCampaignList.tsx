"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check, Trash2, ExternalLink, Images, Users, BarChart3 } from "lucide-react";
import { deletePosterCampaign } from "@/app/dashboard/posters/actions";
import { buildCampaignThumbnailUrl } from "@/lib/poster";
import type { PosterTheme } from "@prisma/client";

type Campaign = {
  id: string;
  title: string;
  slug: string;
  eventDate: Date | null;
  theme: PosterTheme;
  templatePublicId: string | null;
  templateWidth: number | null;
  templateHeight: number | null;
  generatedCount: number;
  viewCount: number;
  _count: { leads: number };
  createdAt: Date;
};

export function PosterCampaignList({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const copyLink = async (slug: string, id: string) => {
    const url = `${window.location.origin}/jyserai/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      prompt("Copiez ce lien :", url);
    }
  };

  const handleDelete = async (campaign: Campaign) => {
    if (!confirm(`Supprimer l'affiche « ${campaign.title} » ? Le lien cessera de fonctionner.`)) return;
    setBusyId(campaign.id);
    const res = await deletePosterCampaign(campaign.id);
    setBusyId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="bg-white border border-dashed border-ink/15 rounded-2xl p-10 text-center">
        <Images className="mx-auto text-ink/20" size={36} />
        <p className="mt-3 font-semibold text-ink">Aucune affiche pour le moment</p>
        <p className="text-sm text-ink/50 mt-1">Créez votre première affiche « J'y serai » ci-dessus.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {campaigns.map((c) => (
        <div key={c.id} className="bg-white border border-ink/10 rounded-2xl p-5 flex gap-4">
          <Link
            href={`/dashboard/posters/${c.id}`}
            className="shrink-0 w-20 rounded-xl overflow-hidden border border-ink/10 self-start"
            style={{ aspectRatio: c.templateWidth && c.templateHeight ? `${c.templateWidth} / ${c.templateHeight}` : "1080 / 1350" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={buildCampaignThumbnailUrl(c)} alt={c.title} className="w-full h-full object-cover" />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/dashboard/posters/${c.id}`} className="min-w-0">
                <h4 className="font-heading font-bold text-ink truncate hover:text-primary transition-colors">{c.title}</h4>
                {c.eventDate && (
                  <p className="text-xs text-ink/50 mt-0.5">
                    {new Date(c.eventDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </Link>
              <button
                onClick={() => handleDelete(c)}
                disabled={busyId === c.id}
                className="text-ink/30 hover:text-red-600 transition-colors shrink-0"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-ink/70">
              <span className="flex items-center gap-1">
                <BarChart3 size={13} className="text-ink/40" /> {c.viewCount} vues
              </span>
              <span className="flex items-center gap-1">
                <Images size={13} className="text-primary" /> {c.generatedCount} générées
              </span>
              <span className="flex items-center gap-1">
                <Users size={13} className="text-accent-2-600" /> {c._count.leads} contacts
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/dashboard/posters/${c.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold border border-ink/15 rounded-lg px-3 py-2 hover:bg-sand/40 transition-colors"
              >
                Voir les contacts
              </Link>
              <button
                onClick={() => copyLink(c.slug, c.id)}
                className="flex items-center justify-center gap-1.5 text-sm font-semibold border border-ink/15 rounded-lg px-3 py-2 hover:bg-sand/40 transition-colors"
                aria-label="Copier le lien"
              >
                {copiedId === c.id ? <Check size={15} className="text-success" /> : <Copy size={15} />}
              </button>
              <Link
                href={`/jyserai/${c.slug}`}
                target="_blank"
                className="flex items-center justify-center gap-1.5 text-sm font-semibold border border-ink/15 rounded-lg px-3 py-2 hover:bg-sand/40 transition-colors"
                aria-label="Voir la page publique"
              >
                <ExternalLink size={15} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
