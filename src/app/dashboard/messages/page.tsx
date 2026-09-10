import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, MailOpen } from "lucide-react";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    redirect("/dashboard");
  }

  const messages = await prisma.contactMessage.findMany({
    where: { providerProfileId: user.providerProfile.id },
    include: { sender: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" }
  });

  // On marque tout comme lu à l'ouverture de la boîte de réception (comme un centre de
  // notifications) ; l'affichage ci-dessous utilise encore les valeurs isRead d'origine.
  const unreadIds = messages.filter((m) => !m.isRead).map((m) => m.id);
  if (unreadIds.length > 0) {
    await prisma.contactMessage.updateMany({
      where: { id: { in: unreadIds } },
      data: { isRead: true }
    });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink">Messages</h1>
          <p className="mt-1 text-ink/60">Premiers contacts d’organisateurs, avant toute demande de réservation.</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border border-ink/10 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <MailOpen className="w-12 h-12 text-ink/20 mb-4" />
          <h3 className="text-lg font-bold text-ink mb-1">Aucun message pour le moment</h3>
          <p className="text-ink/50 text-sm max-w-sm">
            Les messages envoyés depuis votre fiche publique apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm ${!message.isRead ? "border-primary/30 bg-primary/[0.03]" : "border-ink/10"}`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-bold text-ink">{message.sender.name || "Utilisateur iziBooking"}</p>
                  <p className="text-xs text-ink/50">{message.sender.email}</p>
                </div>
                <span className="text-xs text-ink/40 shrink-0">
                  {format(message.createdAt, "d MMM yyyy 'à' HH:mm", { locale: fr })}
                </span>
              </div>
              <p className="text-sm text-ink/80 whitespace-pre-wrap mb-3">{message.content}</p>
              {message.sender.email && (
                <a
                  href={`mailto:${message.sender.email}?subject=${encodeURIComponent("Re: votre message via iziBooking")}`}
                  className="inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Répondre par email
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
