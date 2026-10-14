import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowLeft, Eye, Images, Users, Download, Phone, Mail } from "lucide-react";
import { isPremium } from "@/lib/plan";
import { PosterZonePanel } from "@/components/dashboard/PosterZonePanel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PosterCampaignDetailPage(props: Props) {
  const { id } = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [campaign, viewer] = await Promise.all([
    prisma.posterCampaign.findUnique({
      where: { id },
      include: {
        leads: { orderBy: { createdAt: "desc" } },
        user: { select: { providerProfile: { select: { plan: true, planExpiresAt: true } } } },
      },
    }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } }),
  ]);

  // Un admin peut consulter n'importe quelle campagne pour le support (lecture seule — le
  // recalibrage du cadrage photo, lui, reste réservé au propriétaire : voir updatePosterPhotoZone).
  if (!campaign || (campaign.userId !== session.user.id && !viewer?.isAdmin)) notFound();

  const hasTemplate = campaign.templatePublicId && campaign.templateWidth && campaign.templateHeight;
  const showWatermark = !(campaign.user.providerProfile && isPremium(campaign.user.providerProfile));

  return (
    <div className="space-y-6">
      <Link href="/dashboard/posters" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
        <ArrowLeft size={16} /> Toutes les affiches
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">{campaign.title}</h1>
          <Link
            href={`/jyserai/${campaign.slug}`}
            target="_blank"
            className="text-sm text-primary font-semibold hover:underline"
          >
            izibooking.app/jyserai/{campaign.slug} ↗
          </Link>
        </div>
        {campaign.leads.length > 0 && (
          <a
            href={`/api/posters/${campaign.id}/leads.csv`}
            className="inline-flex items-center gap-2 border border-ink/15 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-sand/40 transition-colors"
          >
            <Download size={16} /> Exporter les contacts (CSV)
          </a>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-ink/10 rounded-2xl p-4 text-center">
          <Eye className="mx-auto text-ink/30 mb-1.5" size={20} />
          <div className="text-2xl font-heading font-bold text-ink">{campaign.viewCount}</div>
          <div className="text-xs text-ink/50">Vues</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-2xl p-4 text-center">
          <Images className="mx-auto text-ink/30 mb-1.5" size={20} />
          <div className="text-2xl font-heading font-bold text-ink">{campaign.generatedCount}</div>
          <div className="text-xs text-ink/50">Affiches générées</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-2xl p-4 text-center">
          <Users className="mx-auto text-ink/30 mb-1.5" size={20} />
          <div className="text-2xl font-heading font-bold text-ink">{campaign.leads.length}</div>
          <div className="text-xs text-ink/50">Contacts captés</div>
        </div>
      </div>

      {hasTemplate && (
        <PosterZonePanel
          campaignId={campaign.id}
          template={{
            publicId: campaign.templatePublicId!,
            width: campaign.templateWidth!,
            height: campaign.templateHeight!,
          }}
          title={campaign.title}
          theme={campaign.theme}
          showWatermark={showWatermark}
          initialZone={
            campaign.photoZoneX != null && campaign.photoZoneY != null && campaign.photoZoneWidth != null && campaign.photoZoneHeight != null
              ? {
                  x: campaign.photoZoneX,
                  y: campaign.photoZoneY,
                  width: campaign.photoZoneWidth,
                  height: campaign.photoZoneHeight,
                }
              : null
          }
        />
      )}

      <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-ink/10">
          <h2 className="font-heading font-bold text-ink">Contacts captés</h2>
        </div>
        {campaign.leads.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink/50">
            Personne n&apos;a encore généré son affiche. Partagez le lien ci-dessus pour commencer.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50">
              <tr>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Téléphone</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {campaign.leads.map((lead) => (
                <tr key={lead.id} className="border-t border-ink/5">
                  <td className="px-5 py-3 font-semibold text-ink">{lead.firstName} {lead.lastName}</td>
                  <td className="px-5 py-3 text-ink/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={13} /> {lead.phone} {lead.isWhatsapp && <span className="text-success text-xs font-bold">WhatsApp</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/70">
                    {lead.email ? (
                      <span className="inline-flex items-center gap-1.5"><Mail size={13} /> {lead.email}</span>
                    ) : (
                      <span className="text-ink/30">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink/50">
                    {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
