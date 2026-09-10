import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, AlignLeft, ArrowLeft, Phone, Star } from "lucide-react";
import Link from "next/link";
import { ChatBox } from "./ChatBox";

import { BookingTimeline } from "./BookingTimeline";
import { ReviewForm } from "./ReviewForm";
import { DisputeSection } from "./DisputeSection";
import { isTranzakConfigured } from "@/lib/tranzak";

export default async function BookingDetailsPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const params = await props.params;
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user) redirect("/login");

  // Fetch booking with messages
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, name: true, image: true } },
      providerProfile: { select: { id: true, name: true, userId: true, currency: true } },
      messages: { orderBy: { createdAt: "asc" } },
      review: true,
      coupon: { select: { code: true } },
      dispute: { select: { status: true, reason: true, resolutionNote: true, createdAt: true } }
    }
  });

  if (!booking) notFound();

  const isProvider = user.providerProfile?.id === booking.providerProfileId;
  const isOrganizer = user.id === booking.organizerId;

  if (!isProvider && !isOrganizer) {
    redirect("/dashboard/bookings"); // Not authorized
  }

  const otherPartyName = isProvider ? booking.organizer.name : booking.providerProfile.name;

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <Link href="/dashboard/bookings" className="inline-flex items-center gap-2 text-ink/60 hover:text-ink font-medium transition-colors">
          <ArrowLeft size={18} />
          Retour aux réservations
        </Link>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Booking Details (25%) */}
        <div className="w-full lg:w-[25%] shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
          
          <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6">
            <h2 className="text-xl font-heading font-bold text-ink mb-1">Détails de l’événement</h2>
            <p className="text-sm font-medium text-primary mb-6">Avec {otherPartyName}</p>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink/40">Type d’événement</span>
                <p className="text-ink font-medium mt-1">{booking.eventType}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink/40">Date</span>
                  <p className="text-ink font-medium mt-0.5">{format(new Date(booking.eventDate), "EEEE d MMMM yyyy", { locale: fr })}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink/40">Lieu</span>
                  <p className="text-ink font-medium mt-0.5">{booking.eventLocation}</p>
                </div>
              </div>

              {booking.clientWhatsApp && isProvider && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink/40">WhatsApp Client</span>
                    <p className="text-ink font-medium mt-0.5">
                      <a 
                        href={`https://wa.me/${booking.clientWhatsApp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-ink"
                      >
                        {booking.clientWhatsApp}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink/50 mb-3">
              <AlignLeft className="w-4 h-4" /> Message de la demande
            </h3>
            <p className="text-sm text-ink/80 whitespace-pre-wrap">
              {booking.details || <span className="italic text-ink/40">Aucun détail fourni.</span>}
            </p>
          </div>
          
          {/* Summary / Price */}
          <div className="bg-sand/30 rounded-2xl border border-ink/10 shadow-sm p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/50 mb-1">Montant total convenu</h3>
            <div className="text-3xl font-bold text-ink">
              {booking.totalAmount ? `${booking.totalAmount.toLocaleString('fr-FR')} ${booking.providerProfile.currency}` : "À définir"}
            </div>
            {booking.coupon && booking.discountAmount ? (
              <p className="text-xs text-success font-medium mt-2">
                Code {booking.coupon.code} appliqué : -{booking.discountAmount.toLocaleString('fr-FR')} {booking.providerProfile.currency}
              </p>
            ) : booking.coupon ? (
              <p className="text-xs text-ink/50 font-medium mt-2">
                Code {booking.coupon.code} sera appliqué dès que le montant sera fixé.
              </p>
            ) : null}
          </div>

          {/* Review: organizer can leave one once the booking is completed */}
          {booking.status === "COMPLETED" && isOrganizer && (
            booking.review ? (
              <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/50 mb-3">Votre avis</h3>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={18} className={booking.review!.rating >= n ? "fill-accent text-accent" : "text-ink/20"} />
                  ))}
                </div>
                {booking.review.comment && (
                  <p className="text-sm text-ink/70 whitespace-pre-wrap">{booking.review.comment}</p>
                )}
              </div>
            ) : (
              <ReviewForm bookingId={booking.id} />
            )
          )}

          <DisputeSection bookingId={booking.id} dispute={booking.dispute} />

        </div>

        {/* Middle Panel: Chat Area (50%) */}
        <div className="flex-1 min-w-0 min-h-[400px]">
          <ChatBox 
            bookingId={booking.id}
            messages={booking.messages.map(m => ({
              id: m.id,
              content: m.content,
              senderId: m.senderId,
              createdAt: m.createdAt
            }))}
            currentUserId={user.id}
            bookingStatus={booking.status}
            totalAmount={booking.totalAmount}
            isProvider={isProvider}
          />
        </div>

        {/* Right Panel: Timeline (25%) */}
        <div className="w-full lg:w-[25%] shrink-0 min-h-[400px]">
          <BookingTimeline
            bookingId={booking.id}
            status={booking.status}
            isProvider={isProvider}
            totalAmount={booking.totalAmount}
            couponCode={booking.coupon?.code}
            tranzakConfigured={isTranzakConfigured()}
          />
        </div>

      </div>
    </div>
  );
}
