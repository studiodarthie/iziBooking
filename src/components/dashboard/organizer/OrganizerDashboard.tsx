"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Search,
  CalendarCheck,
  CreditCard,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DashboardUser } from "@/types/dashboard";

export function OrganizerDashboard({ user }: { user: DashboardUser }) {
  const bookings = user.bookings || [];

  // Calculate stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED").length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING" || b.status === "DEPOSIT_PAID").length;
  const totalBudget = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((acc: number, curr) => acc + (curr.totalAmount || curr.budget || 0), 0);

  // Status mapping for visual display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return { label: "Confirmé", bg: "bg-success/10", text: "text-success", dot: "bg-success" };
      case "PENDING":
        return { label: "Demande", bg: "bg-ink/5", text: "text-ink/70", dot: "bg-ink/30" };
      case "DEPOSIT_PAID":
        return { label: "Acompte payé", bg: "bg-accent/20", text: "text-accent-700", dot: "bg-accent-500" };
      case "CANCELLED":
        return { label: "Annulé", bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" };
      default:
        return { label: status, bg: "bg-ink/5", text: "text-ink/70", dot: "bg-ink/30" };
    }
  };

  return (
    <div className="flex flex-col h-full font-sans pb-16">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wider text-primary uppercase flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
          <h1 className="text-3xl font-heading font-black text-ink tracking-tight">
            Bonjour, {user.name?.split(' ')[0] || "Organisateur"} 👋
          </h1>
          <p className="text-ink/60 mt-1">
            Vous avez <strong className="text-ink">{confirmedBookings} prestataires confirmés</strong> et <strong className="text-accent-600">{pendingBookings} demandes</strong> en attente.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/search">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-ink/10 shadow-sm hover:shadow-md hover:border-primary/30 text-ink text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all"
            >
              <Search size={16} /> Trouver un prestataire
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: MAIN CONTENT (col-span-8)                    */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 4 KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-ink/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110" />
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">Total RDV</p>
              <p className="text-2xl font-black text-ink">{totalBookings}</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-ink/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-success/10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110" />
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">Confirmés</p>
              <p className="text-2xl font-black text-ink">{confirmedBookings}</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-ink/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110" />
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent-700 mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">Budget engagé</p>
              <p className="text-xl font-black text-ink truncate">{totalBudget.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span></p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-ink/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-ink/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110" />
              <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink/70 mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">Messages</p>
              <p className="text-2xl font-black text-ink">0</p>
            </motion.div>

          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-ink/5">
              <h2 className="text-lg font-bold text-ink">Vos événements récents</h2>
              <Link href="/dashboard/bookings" className="text-primary text-sm font-bold hover:underline">
                Voir tout
              </Link>
            </div>
            
            <div className="p-6">
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-sand/20 rounded-xl border border-dashed border-ink/20">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Search className="w-8 h-8 text-ink/30" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-1">Aucune réservation</h3>
                  <p className="text-ink/60 text-sm text-center max-w-sm mb-6">
                    Vous n’avez pas encore contacté de prestataires. Explorez le catalogue pour trouver la perle rare pour votre événement !
                  </p>
                  <Link href="/search">
                    <button className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg">
                      Parcourir le catalogue
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => {
                    const statusUI = getStatusDisplay(booking.status);
                    const provider = booking.providerProfile;
                    return (
                      <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-ink/5 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border border-ink/10 overflow-hidden bg-sand shrink-0">
                            {provider?.user?.image ? (
                              <img src={provider.user.image} alt={provider.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-ink/50 font-bold bg-accent/20">
                                {provider?.name?.charAt(0) || "P"}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-ink group-hover:text-primary transition-colors">{provider?.name || "Prestataire Inconnu"}</h4>
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-ink/60 mt-1">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {booking.eventLocation || "Lieu non précisé"}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {new Date(booking.eventDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusUI.bg} ${statusUI.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusUI.dot}`}></span>
                            {statusUI.label}
                          </div>
                          <p className="font-black text-ink">{(booking.totalAmount || booking.budget || 0).toLocaleString('fr-FR')} <span className="text-[10px] font-bold">FCFA</span></p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CONTEXT PANEL (col-span-4)                  */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm">
            <h2 className="text-lg font-bold text-ink mb-6 flex items-center gap-2">
              📊 Aperçu global
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 rounded-full border-8 border-sand/50 border-t-success border-r-ink/10 border-b-primary border-l-accent-500 flex items-center justify-center shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-black text-ink">{totalBookings}</div>
                  <div className="text-[9px] text-ink/50 font-bold uppercase tracking-wider">Demandes</div>
                </div>
              </div>
              
              <div className="flex-1 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-ink/70 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success"></span> Confirmé
                  </span>
                  <span className="text-ink font-black">{confirmedBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink/70 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> Demande
                  </span>
                  <span className="text-ink font-black">{pendingBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink/70 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ink/20"></span> Annulé
                  </span>
                  <span className="text-ink font-black">
                    {bookings.filter((b) => b.status === "CANCELLED").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-ink mb-4">Actions Rapides</h2>
            <div className="space-y-3">
              <Link href="/search" className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Search size={16} />
                  </div>
                  <span className="font-bold text-sm text-ink group-hover:text-primary transition-colors">Chercher un prestataire</span>
                </div>
                <ChevronRight size={16} className="text-ink/30 group-hover:text-primary transition-colors" />
              </Link>
              
              <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent-700">
                    <CalendarCheck size={16} />
                  </div>
                  <span className="font-bold text-sm text-ink group-hover:text-accent-700 transition-colors">Voir mon calendrier</span>
                </div>
                <ChevronRight size={16} className="text-ink/30 group-hover:text-accent-700 transition-colors" />
              </button>
            </div>
          </div>

          {/* Support / Help */}
          <div className="bg-ink text-sand rounded-2xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute -right-6 -top-6 opacity-10">
              <MessageSquare size={100} />
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Besoin d’aide ?</h3>
            <p className="text-sm text-sand/70 mb-4 relative z-10">Notre équipe de conciergerie est là pour vous aider à trouver les meilleurs prestataires.</p>
            <button className="bg-white text-ink text-sm font-bold py-2 px-4 rounded-lg hover:bg-sand transition-colors relative z-10">
              Contacter le support
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
