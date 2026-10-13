"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encode, decode } from "next-auth/jwt";

// Cookie de session JWT NextAuth, httpOnly, posé par le navigateur via cookies().set() ici
// même en dehors du flux de connexion normal. NextAuth bascule sur le préfixe "__Secure-" dès
// que les cookies sécurisés sont actifs (Vercel en production, ou NEXTAUTH_URL en https) —
// sans ça, poser/lire le mauvais nom de cookie casserait silencieusement la bascule d'identité.
const IMPERSONATOR_COOKIE = "admin-impersonator-token";

function sessionCookieName() {
  const secure = !!process.env.VERCEL || process.env.NEXTAUTH_URL?.startsWith("https://");
  return secure ? "__Secure-next-auth.session-token" : "next-auth.session-token";
}

function cookieOptions(secure: boolean) {
  return { httpOnly: true, secure, sameSite: "lax" as const, path: "/" };
}

/**
 * "Visualiser l'interface" : bascule la session de l'admin courant sur celle de `userId`, sans
 * mot de passe, pour voir exactement ce que voit un utilisateur (support, debug). Le cookie de
 * session admin d'origine est conservé (chiffré, httpOnly, lui-même inaccessible en JS) dans un
 * second cookie pour permettre un retour propre via stopImpersonating. Toute bascule est journalisée
 * dans AdminImpersonationLog — un pouvoir aussi sensible doit rester traçable.
 */
export async function impersonateUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!admin?.isAdmin) return { success: false, error: "Accès refusé" };
  if (admin.id === userId) return { success: false, error: "Vous êtes déjà connecté sur ce compte." };

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { success: false, error: "Utilisateur introuvable." };
  if (target.isAdmin) return { success: false, error: "Impossible de visualiser le compte d'un autre administrateur." };
  // Le dashboard déconnecte automatiquement tout compte banni (voir dashboard/layout.tsx) :
  // sans ce garde-fou, tenter de visualiser un compte banni jetterait l'admin hors de sa propre
  // bascule d'identité au premier chargement de page.
  if (target.isBanned) return { success: false, error: "Compte banni — réactivez-le d'abord pour visualiser son interface." };

  const cookieName = sessionCookieName();
  const jar = await cookies();
  const currentToken = jar.get(cookieName)?.value;
  if (!currentToken) return { success: false, error: "Session invalide, reconnectez-vous." };

  const impersonationToken = await encode({
    token: { id: target.id, role: target.role, sub: target.id, name: target.name, email: target.email, impersonatedBy: admin.id },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  await prisma.adminImpersonationLog.create({ data: { adminId: admin.id, targetUserId: target.id } });

  const secure = cookieName.startsWith("__Secure-");
  jar.set(IMPERSONATOR_COOKIE, currentToken, { ...cookieOptions(secure), maxAge: 60 * 60 * 4 });
  jar.set(cookieName, impersonationToken, cookieOptions(secure));

  redirect("/dashboard");
}

/** Termine une session "Visualiser l'interface" et restaure le cookie de session admin d'origine. */
export async function stopImpersonating() {
  const cookieName = sessionCookieName();
  const jar = await cookies();
  const originalToken = jar.get(IMPERSONATOR_COOKIE)?.value;
  if (!originalToken) redirect("/dashboard");

  const impersonatedSession = await getServerSession(authOptions);
  const decodedAdmin = await decode({ token: originalToken, secret: process.env.NEXTAUTH_SECRET! });

  if (impersonatedSession?.user?.id && decodedAdmin?.id) {
    await prisma.adminImpersonationLog.updateMany({
      where: { adminId: decodedAdmin.id, targetUserId: impersonatedSession.user.id, endedAt: null },
      data: { endedAt: new Date() },
    });
  }

  const secure = cookieName.startsWith("__Secure-");
  jar.set(cookieName, originalToken, cookieOptions(secure));
  jar.delete(IMPERSONATOR_COOKIE);

  redirect("/admin/users");
}

export async function toggleUserBan(userId: string, currentlyBanned: boolean, reason?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
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
  if (!session?.user?.id) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
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
