import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/search", priority: 0.9 },
  { path: "/tarifs", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
  { path: "/contact", priority: 0.5 },
  { path: "/cgv", priority: 0.3 },
  { path: "/reglement", priority: 0.3 },
  { path: "/confidentialite", priority: 0.3 },
  { path: "/dpa", priority: 0.2 },
  { path: "/mentions-legales", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const providers = await safeDb(
    () =>
      prisma.providerProfile.findMany({
        where: { isVerified: true, user: { isBanned: false } },
        select: { id: true, updatedAt: true },
      }),
    []
  );

  return [
    ...STATIC_PAGES.map((p) => ({ url: `${SITE_URL}${p.path}`, priority: p.priority })),
    ...providers.map((p) => ({ url: `${SITE_URL}/p/${p.id}`, lastModified: p.updatedAt, priority: 0.8 })),
  ];
}
