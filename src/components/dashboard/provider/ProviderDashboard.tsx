"use client";

import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Calendar as CalendarIcon,
  CreditCard,
  CheckCircle,
  Eye,
  Copy,
  Layers,
  Settings
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ProviderDashboard({ user }: { user: any }) {
  const profile = user.providerProfile;
  const bookings = profile?.bookings || [];
  const services = profile?.services || [];
  
  const [publicUrl, setPublicUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicUrl(`${window.location.origin}/p/${profile?.id}`);
    }
  }, [profile?.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculs réels basés sur les réservations
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter((b: any) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((acc: number, curr: any) => acc + (curr.totalPrice || 0), 0);
  
  // Calcul réel de la complétion du profil
  let completeness = 20; // Profil basique créé
  if (user.image) completeness += 20;
  if (profile?.description) completeness += 20;
  if (services.length > 0) completeness += 20;
  if (profile?.location) completeness += 20;

  // Graphique (vide si pas de data)
  const chartData = [
    { name: 'Lun', appointments: 0, revenue: 0 },
    { name: 'Mar', appointments: 0, revenue: 0 },
    { name: 'Mer', appointments: 0, revenue: 0 },
    { name: 'Jeu', appointments: 0, revenue: 0 },
    { name: 'Ven', appointments: 0, revenue: 0 },
    { name: 'Sam', appointments: 0, revenue: 0 },
    { name: 'Dim', appointments: 0, revenue: 0 },
  ];

  return (
    <div className="flex flex-col h-full pb-16 font-sans">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-ink tracking-tight">
            Bonjour, {profile?.name || "Prestataire"} 👋
          </h1>
          <p className="text-ink/60 mt-1">Voici l'état de votre activité aujourd'hui sur iziBooking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/p/${profile?.id}`}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-ink/10 shadow-sm hover:shadow-md hover:border-primary/30 text-ink text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all"
            >
              <Eye size={16} /> Aperçu public
            </motion.button>
          </Link>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white shadow-[0_4px_15px_rgba(181,69,27,0.3)] hover:bg-primary/90 text-sm font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all"
          >
            <CalendarCheck size={16} /> Nouveau RDV manuel
          </motion.button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MAIN CONTENT (col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* KPI 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-ink/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-ink/60">Total Réservations</p>
                  <p className="text-3xl font-black text-ink mt-1">{totalBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-ink/40">
                Généré à partir de vraies données
              </div>
            </motion.div>

            {/* KPI 2 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-ink/5 shadow-sm hover:shadow-xl hover:shadow-accent/10 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-ink/60">Revenus Estimés</p>
                  <p className="text-3xl font-black text-ink mt-1">
                    {totalRevenue.toLocaleString('fr-FR')} <span className="text-lg font-bold text-ink/40">FCFA</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-700 shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-ink/40">
                Généré à partir de vraies données
              </div>
            </motion.div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-bold text-ink">Activité de la semaine</h2>
                <p className="text-sm text-ink/50 mt-1">Données à zéro en attendant les premières réservations</p>
              </div>
              <div className="flex bg-sand/50 rounded-lg p-1">
                <button className="px-4 py-1.5 text-sm font-bold bg-white text-ink shadow-sm rounded-md">Revenus</button>
              </div>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9982B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C9982B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#C9982B', strokeWidth: 1, strokeDasharray: '3 3' }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#C9982B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Appointments List */}
          <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-ink">Réservations Récentes</h2>
              <Link href="/dashboard/bookings" className="text-primary text-sm font-bold hover:underline">Voir tout</Link>
            </div>
            
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-sand/10 rounded-xl border border-dashed border-ink/20">
                  <CalendarIcon className="w-10 h-10 text-ink/30 mb-3" />
                  <p className="text-ink/60 font-medium">Aucune réservation pour le moment.</p>
                  <p className="text-ink/40 text-sm mt-1">Partagez votre lien public pour recevoir vos premières demandes.</p>
                </div>
              ) : (
                bookings.slice(0, 3).map((booking: any) => (
                  <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`} className="group flex items-center justify-between p-4 rounded-xl border border-ink/5 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-ink/5 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-ink/50 uppercase">
                          {new Date(booking.eventDate).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black text-ink">
                          {new Date(booking.eventDate).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-ink group-hover:text-primary transition-colors">{booking.eventType || "Événement"}</h3>
                        <p className="text-sm text-ink/60 mt-0.5 flex items-center gap-1">
                          <MapPin size={14} /> {booking.location || "Lieu non précisé"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-trust/10 text-trust">
                        {booking.status}
                      </span>
                      <p className="font-bold text-ink mt-1">{(booking.totalPrice || 0).toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-accent" />
            
            <div className="relative mt-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-sand overflow-hidden shadow-lg mb-4">
                {user.image ? (
                  <img src={user.image} alt={profile?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent-700 font-bold text-2xl">
                    {profile?.name?.charAt(0) || "P"}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-heading font-black text-ink">{profile?.name || "Prestataire"}</h2>
              <p className="text-sm font-medium text-ink/50 mt-1">{profile?.category || "Catégorie non définie"}</p>
              
              <div className="mt-6 w-full space-y-2">
                <div className="flex justify-between text-xs font-bold text-ink/70">
                  <span>Profil complété</span>
                  <span>{completeness}%</span>
                </div>
                <div className="w-full bg-ink/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${completeness}%` }} />
                </div>
                {completeness < 100 && (
                  <p className="text-xs text-ink/50 text-left pt-1">
                    {services.length === 0 ? "Ajoutez un premier service pour progresser." : "Ajoutez plus de détails à votre profil pour atteindre 100%."}
                  </p>
                )}
              </div>

              <div className="mt-6 w-full pt-6 border-t border-ink/5">
                <p className="text-xs font-bold text-ink/50 text-left mb-2 uppercase tracking-wider">Votre lien public</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-sand/50 rounded-lg border border-ink/10 px-3 py-2 text-xs font-medium text-ink/70 truncate">
                    {publicUrl || "Chargement..."}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors shrink-0"
                    title="Copier le lien"
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Activity Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
            <h2 className="text-lg font-bold text-ink mb-6">Fil d'actualité</h2>
            
            <div className="relative border-l-2 border-ink/10 ml-3 space-y-8 pb-4">
              
              {/* Activity 1 */}
              <div className="relative pl-6">
                <div className="absolute w-6 h-6 bg-primary text-white rounded-full -left-[13px] flex items-center justify-center ring-4 ring-white">
                  <CheckCircle size={12} />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-ink">Compte créé</h3>
                    <span className="text-[10px] font-bold text-ink/40">À L'INSTANT</span>
                  </div>
                  <p className="text-sm text-ink/70">Bienvenue sur iziBooking ! Votre compte prestataire est actif.</p>
                </div>
              </div>

              {services.length > 0 && (
                <div className="relative pl-6">
                  <div className="absolute w-6 h-6 bg-accent-600 text-white rounded-full -left-[13px] flex items-center justify-center ring-4 ring-white">
                    <Layers size={12} />
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-ink">Service Ajouté</h3>
                      <span className="text-[10px] font-bold text-ink/40">AUJOURD'HUI</span>
                    </div>
                    <p className="text-sm text-ink/70">Vous avez ajouté un nouveau service à votre catalogue.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
