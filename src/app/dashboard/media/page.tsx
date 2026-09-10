import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getMediaLinks } from "./actions";
import MediaClient from "./MediaClient";
import { isPremium, FREE_PHOTO_LIMIT } from "@/lib/plan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Médiathèque | iziBooking",
};

export default async function MediaPage() {
  const [mediaLinks, session] = await Promise.all([getMediaLinks(), getServerSession(authOptions)]);

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { providerProfile: true }
      })
    : null;

  const premium = user?.providerProfile ? isPremium(user.providerProfile) : false;

  return (
    <MediaClient initialMedia={mediaLinks} isPremium={premium} photoLimit={FREE_PHOTO_LIMIT} />
  );
}
