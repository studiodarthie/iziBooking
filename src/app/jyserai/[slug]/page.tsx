import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { PosterGenerator } from "@/components/public/PosterGenerator";
import { isPremium } from "@/lib/plan";
import { POSTER_THEMES } from "@/lib/poster";

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

  const showWatermark = !(campaign.user.providerProfile && isPremium(campaign.user.providerProfile));
  const theme = POSTER_THEMES[campaign.theme];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: `#${theme.bg}` }}>
      <PublicNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <PosterGenerator
          slug={campaign.slug}
          title={campaign.title}
          eventDate={campaign.eventDate?.toISOString() ?? null}
          theme={campaign.theme}
          showWatermark={showWatermark}
        />
      </div>
      <HomeFooter />
    </div>
  );
}
