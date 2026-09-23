"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleUserBan(userId: string, currentlyBanned: boolean, reason?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin?.isAdmin) return { success: false, error: "Accès refusé" };
  if (admin.id === userId) return { success: false, error: "Vous ne pouvez pas vous bannir vous-même." };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: currentlyBanned
        ? { isBanned: false, bannedAt: null, banReason: null }
        : { isBanned: true, bannedAt: new Date(), banReason: reason?.trim() || undefined },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Erreur bannissement utilisateur:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}

/**
 * Supprime définitivement un compte et toutes ses données liées (réservations, avis, messages,
 * profil prestataire et tout ce qui en dépend). Irréversible — réservé aux admins, jamais sur
 * soi-même. Les relations de la base ne sont pas toutes en cascade automatique (Booking en
 * particulier), donc on nettoie manuellement dans le bon ordre avant de supprimer le User :
 * la suppression du User cascade ensuite Account/Session/ProviderProfile et tout ce qui dépend
 * du profil prestataire (médias, services, horaires, coupons, paiements d'abonnement...).
 */
export async function deleteUserPermanently(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin?.isAdmin) return { success: false, error: "Accès refusé" };
  if (admin.id === userId) return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte." };

  try {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true, providerProfile: { select: { id: true } } },
    });
    if (!target) return { success: false, error: "Utilisateur introuvable." };
    if (target.isAdmin) return { success: false, error: "Impossible de supprimer un compte administrateur." };

    const providerProfileId = target.providerProfile?.id;

    await prisma.$transaction(async (tx) => {
      const bookings = await tx.booking.findMany({
        where: {
          OR: [
            { organizerId: userId },
            ...(providerProfileId ? [{ providerProfileId }] : []),
          ],
        },
        select: { id: true },
      });
      const bookingIds = bookings.map((b) => b.id);

      if (bookingIds.length > 0) {
        await tx.message.deleteMany({ where: { bookingId: { in: bookingIds } } });
        await tx.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
        await tx.dispute.deleteMany({ where: { bookingId: { in: bookingIds } } });
        await tx.review.deleteMany({ where: { bookingId: { in: bookingIds } } });
        await tx.booking.deleteMany({ where: { id: { in: bookingIds } } });
      }

      // Filet de sécurité : toute trace directe du compte qui n'aurait pas été couverte
      // ci-dessus (n'a normalement rien à supprimer si les données sont cohérentes).
      await tx.message.deleteMany({ where: { senderId: userId } });
      await tx.review.deleteMany({ where: { organizerId: userId } });
      await tx.dispute.deleteMany({ where: { openedById: userId } });
      await tx.contactMessage.deleteMany({ where: { senderId: userId } });

      // Cascade : Account, Session, ProviderProfile (+ MediaLink, Service, ScheduleSetting,
      // WorkingHour, TimeOff, BlockedDate, SubscriptionPayment, Coupon, Review/ContactMessage
      // restants du profil).
      await tx.user.delete({ where: { id: userId } });
    }, { timeout: 20000, maxWait: 10000 }); // Neon peut être lent à froid ; la transaction fait ~5-8 requêtes.

    revalidatePath("/admin/users");
    revalidatePath("/admin/providers");
    revalidatePath("/search");
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression définitive utilisateur:", error);
    return { success: false, error: "Erreur lors de la suppression." };
  }
}
