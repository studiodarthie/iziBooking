import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { PosterGenerator } from "@/components/public/PosterGenerator";
import { isPremium } from "@/lib/plan";
import { registerPosterView } from "./actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PosterCampaignPage(props: Props) {
  const { slug } = await props.params;

  const campaign = await prisma.posterCampaign.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          name: true,
          providerProfile: { select: { plan: true, planExpiresAt: true } },
        },
      },
    },
  });

  if (!campaign) notFound();

  // Best-effort, ne doit jamais bloquer l'affichage de la page.
  registerPosterView(slug).catch(() => {});

  const showWatermark = !(campaign.user.providerProfile && isPremium(campaign.user.providerProfile));
  const template =
    campaign.templatePublicId && campaign.templateWidth && campaign.templateHeight
      ? {
          publicId: campaign.templatePublicId,
          width: campaign.templateWidth,
          height: campaign.templateHeight,
          photoZone:
            campaign.photoZoneX != null && campaign.photoZoneY != null && campaign.photoZoneWidth != null && campaign.photoZoneHeight != null
              ? {
                  x: campaign.photoZoneX,
                  y: campaign.photoZoneY,
                  width: campaign.photoZoneWidth,
                  height: campaign.photoZoneHeight,
                }
              : null,
        }
      : null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FBDDBF] via-[#FCE6CE] to-[#FCEFDD] flex-1 flex flex-col">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/40 blur-3xl pointer-events-none" />
        <PublicNavbar />
        <div className="relative z-10 flex-1 px-4 py-8 md:py-12">
          <PosterGenerator
            slug={campaign.slug}
            title={campaign.title}
            eventDate={campaign.eventDate?.toISOString() ?? null}
            theme={campaign.theme}
            showWatermark={showWatermark}
            template={template}
            viewCount={campaign.viewCount}
            generatedCount={campaign.generatedCount}
            maxPerPerson={campaign.maxPerPerson}
          />
        </div>
      </div>
      <HomeFooter />
    </div>
  );
}
