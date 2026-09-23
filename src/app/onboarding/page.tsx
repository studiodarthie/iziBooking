"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Sparkles, MapPin, DollarSign, UploadCloud, CheckCircle, ChevronRight,
  ArrowLeft, ArrowUpRight, Gift, ShieldCheck, Wallet, Search, MessageCircle,
  Music, Utensils, Camera, Clapperboard, Users, Tag, Layers, Palette, Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { submitProviderProfile, submitOrganizerProfile } from "./actions";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { TRIAL_DAYS } from "@/lib/plan";

type Role = "ORGANIZER" | "PROVIDER" | null;

/** Habillage commun à tout le tunnel d'onboarding : dégradé de marque + halos, logo en tête. */
function OnboardingBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FBDDBF] via-[#FCE6CE] to-[#FCEFDD] font-sans">
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/25 blur-3xl pointer-events-none" />
      <div className="absolute top-32 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/35 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex justify-center pt-8 pb-2">
        <Link href="/" aria-label="iziBooking - Accueil">
          <Image src="/logo.png" alt="iziBooking" width={1576} height={317} className="h-7 w-auto" />
        </Link>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Options du pôle d'activité, affichées en cartes plutôt qu'en menu déroulant. */
const POLE_OPTIONS: { value: string; label: string; sub: string; icon: typeof Music }[] = [
  { value: "DIVERTISSEMENT", label: "Divertissement", sub: "Musique, Danse, Animation", icon: Music },
  { value: "RECEPTION", label: "Réception", sub: "Traiteur, Décoration, Salles", icon: Utensils },
  { value: "IMAGE_SOUVENIR", label: "Image & Souvenir", sub: "Photo, Vidéo, Drone, Maquillage", icon: Camera },
  { value: "SERVICES", label: "Services", sub: "Sécurité, Transport, Wedding Planner", icon: Users },
  { value: "CULTURE_CINEMA", label: "Culture & Cinéma", sub: "Réalisation, Médiation, Projection", icon: Clapperboard },
];

/** Style commun à tous les champs texte des étapes prestataire : icône, bordure visible, focus marqué. */
const fieldInputClass =
  "block w-full rounded-xl border border-ink/15 bg-white pl-11 pr-4 py-3.5 text-sm text-ink placeholder:text-ink/35 shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none";
const fieldIconWrapClass = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink/35";

/** Icône + titre affichés au-dessus de chaque étape du tunnel prestataire. */
function StepHeader({ icon: Icon, title, subtitle }: { icon: typeof Tag; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={22} />
      </div>
      <h2 className="text-2xl font-heading font-bold text-ink">{title}</h2>
      <p className="text-sm text-ink/60 mt-1">{subtitle}</p>
    </div>
  );
}

const stepTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function OnboardingPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);

  // Provider Form State
  const [formData, setFormData] = useState({
    pole: "DIVERTISSEMENT",
    name: "",
    category: "",
    specialty: "",
    location: "",
    price: "",
    image: "",
    serviceName: "",
    servicePrice: "",
    workingDays: [1, 2, 3, 4, 5] as number[] // Lundi au Vendredi par défaut
  });

  const handleRoleSelect = (selectedRole: "ORGANIZER" | "PROVIDER") => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => {
    if (step === 2) {
      setRole(null);
      setStep(1);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const toggleDay = (day: number) => {
    setFormData(prev => {
      const isSelected = prev.workingDays.includes(day);
      if (isSelected) {
        return { ...prev, workingDays: prev.workingDays.filter(d => d !== day) };
      } else {
        return { ...prev, workingDays: [...prev.workingDays, day].sort() };
      }
    });
  };

  const handleOrganizerSubmit = async () => {
    setIsPending(true);
    try {
      await submitOrganizerProfile();
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setIsPending(false);
    }
  };

  const handleProviderSubmit = async () => {
    setIsPending(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "workingDays") {
          data.append(key, (value as number[]).join(","));
        } else {
          data.append(key, value as string);
        }
      });
      await submitProviderProfile(data);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setIsPending(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 1: CHOOSE ROLE
  // -------------------------------------------------------------
  if (step === 1 || !role) {
    const ROLE_CARDS: {
      role: "ORGANIZER" | "PROVIDER";
      icon: typeof Briefcase;
      title: string;
      description: string;
      features: { icon: typeof Search; label: string }[];
      tint: string;
      textTint: string;
      hoverBg: string;
      ring: string;
    }[] = [
      {
        role: "ORGANIZER",
        icon: Briefcase,
        title: "Je suis Organisateur",
        description: "Je cherche des prestataires pour mes événements.",
        features: [
          { icon: Search, label: "Recherche et mise en relation gratuites" },
          { icon: ShieldCheck, label: "Prestataires vérifiés à la main" },
          { icon: Wallet, label: "Paiement sécurisé, en ligne ou mobile money" },
        ],
        tint: "bg-trust/10 group-hover:bg-trust",
        textTint: "text-trust",
        hoverBg: "hover:border-trust",
        ring: "focus:ring-trust",
      },
      {
        role: "PROVIDER",
        icon: Sparkles,
        title: "Je suis Prestataire",
        description: "Je propose mes services (Artiste, Traiteur, Photo...).",
        features: [
          { icon: MessageCircle, label: "Profil public et demandes en illimité" },
          { icon: Gift, label: `${TRIAL_DAYS} jours de Premium offerts à l'inscription` },
          { icon: Wallet, label: "Vos gains reversés en toute sécurité" },
        ],
        tint: "bg-primary/10 group-hover:bg-primary",
        textTint: "text-primary",
        hoverBg: "hover:border-primary",
        ring: "focus:ring-primary",
      },
    ];

    return (
      <OnboardingBackground>
        <div className="flex flex-col items-center px-4 pb-16 pt-4">
          <span className="inline-block bg-primary/10 text-primary text-[12px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
            Inscription
          </span>
          <h1 className="text-center font-heading font-extrabold text-[clamp(30px,4vw,44px)] leading-[1.1] text-ink max-w-xl">
            Bienvenue sur <span className="text-primary">iziBooking</span>
          </h1>
          <p className="mt-3 text-center text-neutral-700 max-w-md">
            Pour commencer, dites-nous comment vous souhaitez utiliser la plateforme.
          </p>

          <div className="mt-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ROLE_CARDS.map((card, i) => (
              <motion.button
                key={card.role}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -6 }}
                onClick={() => handleRoleSelect(card.role)}
                disabled={isPending}
                className={`group relative rounded-3xl border-2 border-white bg-white p-8 text-left shadow-lg shadow-black/5 ${card.hoverBg} hover:shadow-2xl hover:shadow-black/10 focus:outline-none focus:ring-2 ${card.ring} focus:ring-offset-2 transition-all disabled:opacity-50`}
              >
                <ArrowUpRight size={18} className="absolute top-6 right-6 text-neutral-300 group-hover:text-ink transition-colors" />

                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 mb-5 ${card.tint} ${card.textTint} group-hover:text-white`}>
                  <card.icon className="h-8 w-8" />
                </div>

                <h3 className="font-heading font-bold text-xl text-ink">{card.title}</h3>
                <p className="mt-1.5 text-sm text-neutral-600">{card.description}</p>

                <ul className="mt-5 space-y-2.5 border-t border-ink/10 pt-4">
                  {card.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-[13px] text-neutral-700">
                      <f.icon size={15} className={`shrink-0 ${card.textTint}`} />
                      {f.label}
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>

          <p className="mt-8 text-xs text-neutral-500">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </OnboardingBackground>
    );
  }

  // -------------------------------------------------------------
  // ORGANIZER FLOW
  // -------------------------------------------------------------
  if (role === "ORGANIZER") {
    return (
      <OnboardingBackground>
      <div className="flex flex-col py-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button onClick={handleBack} className="flex items-center text-ink/60 hover:text-ink text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Retour
          </button>

          <div className="bg-white py-10 px-6 shadow-xl shadow-black/5 sm:rounded-3xl sm:px-10 border border-white text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-ink mb-2">
              Excellent choix !
            </h2>
            <p className="text-ink/60 mb-8">
              Votre compte Organisateur est presque prêt. Vous pourrez rechercher des prestataires et leur envoyer des demandes de devis.
            </p>
            <button
              onClick={handleOrganizerSubmit}
              disabled={isPending}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-sand bg-primary hover:bg-primary/90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
            >
              {isPending ? "Configuration en cours..." : "Accéder à mon tableau de bord"}
            </button>
          </div>
        </div>
      </div>
      </OnboardingBackground>
    );
  }

  // -------------------------------------------------------------
  // PROVIDER FLOW
  // -------------------------------------------------------------
  const totalSteps = 6;

  return (
    <OnboardingBackground>
    <div className="flex flex-col py-4 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <button onClick={handleBack} className="flex items-center text-ink/60 hover:text-ink text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Retour
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-medium text-ink/60 mb-2">
            <span>Étape {step - 1} sur {totalSteps - 1}</span>
            <span>{Math.round(((step - 1) / (totalSteps - 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-3xl sm:px-6 md:px-10 border border-white overflow-hidden">
        <AnimatePresence mode="wait">

          {/* STEP 2: IDENTITÉ */}
          {step === 2 && (
            <motion.div key="step-2" {...stepTransition} className="space-y-6">
              <StepHeader icon={Tag} title="Votre identité" subtitle="Dites-nous ce que vous proposez." />

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Pôle d’activité principal
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {POLE_OPTIONS.map((p) => {
                      const active = formData.pole === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, pole: p.value })}
                          className={`group flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-all ${
                            active
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-ink/10 bg-white hover:border-ink/25"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              active ? "bg-primary text-white" : "bg-sand/60 text-ink/45"
                            }`}
                          >
                            <p.icon size={17} />
                          </span>
                          <span className="min-w-0">
                            <span className={`block text-sm font-semibold ${active ? "text-primary" : "text-ink"}`}>
                              {p.label}
                            </span>
                            <span className="block text-[11px] text-ink/50 truncate">{p.sub}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink mb-2">
                    Nom de scène ou d’entreprise *
                  </label>
                  <div className="relative">
                    <span className={fieldIconWrapClass}><Sparkles size={17} /></span>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Ex: Les Danseurs du Wouri, Traiteur XYZ..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-ink mb-2">
                    Catégorie exacte *
                  </label>
                  <div className="relative">
                    <span className={fieldIconWrapClass}><Layers size={17} /></span>
                    <input
                      type="text"
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Ex: DJ, Photographe, Traiteur, Maquilleuse..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="specialty" className="block text-sm font-semibold text-ink mb-2">
                    Spécialité / Style (optionnel)
                  </label>
                  <div className="relative">
                    <span className={fieldIconWrapClass}><Palette size={17} /></span>
                    <input
                      type="text"
                      id="specialty"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Ex: Afrobeats, Cuisine Locale..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.category}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-sand bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer <ChevronRight size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOCALISATION ET TARIFS */}
          {step === 3 && (
            <motion.div key="step-3" {...stepTransition} className="space-y-6">
              <StepHeader icon={MapPin} title="Localisation & Tarifs" subtitle="Où êtes-vous basé et quels sont vos tarifs ?" />

              <div className="space-y-5">
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-ink mb-2">
                    Ville principale *
                  </label>
                  <div className="relative">
                    <span className={fieldIconWrapClass}><MapPin size={17} /></span>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Ex: Douala, Cameroun"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-ink mb-2">
                    Tarif de base indicatif (optionnel)
                  </label>
                  <div className="relative">
                    <span className={fieldIconWrapClass}><DollarSign size={17} /></span>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`${fieldInputClass} pr-14 font-mono`}
                      placeholder="Ex: 150000"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-ink/40 text-sm font-mono">
                      FCFA
                    </span>
                  </div>
                  <p className="text-xs text-ink/50 mt-1.5">Ce tarif apparaîtra sur votre profil public pour donner une idée aux clients.</p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleNext}
                  disabled={!formData.location}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-sand bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer <ChevronRight size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: MEDIAS */}
          {step === 4 && (
            <motion.div key="step-4" {...stepTransition} className="space-y-6">
              <StepHeader icon={UploadCloud} title="Photo de profil" subtitle="Ajoutez un visage ou un logo à votre profil." />

              <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-ink/10 border-dashed rounded-2xl hover:border-primary/50 transition-colors bg-sand/10">
                <div className="space-y-1 text-center flex flex-col items-center w-full">
                  {formData.image ? (
                    <img src={formData.image} alt="Profil" className="h-28 w-28 rounded-full object-cover mb-4 shadow-md border-4 border-white" />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-white shadow-sm border border-ink/10 flex items-center justify-center mb-4">
                      <UploadCloud className="h-10 w-10 text-ink/30" />
                    </div>
                  )}

                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kamita_preset"}
                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                      if (typeof result.info !== "object" || !result.info) return;
                      setFormData({ ...formData, image: result.info.secure_url });
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="relative cursor-pointer bg-white border border-ink/15 shadow-sm rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-sand/50 hover:border-primary/40 focus-within:outline-none transition-colors"
                      >
                        {formData.image ? "Changer la photo" : "Choisir une image"}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleNext}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-sand bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer <ChevronRight size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SERVICE INITIAL */}
          {step === 5 && (
            <motion.div key="step-5" {...stepTransition} className="space-y-6">
              <StepHeader icon={DollarSign} title="Premier Service" subtitle="Créez votre première offre pour être réservable immédiatement." />

              <div className="space-y-5">
                <div>
                  <label htmlFor="serviceName" className="block text-sm font-semibold text-ink mb-2">
                    Nom du service *
                  </label>
                  <div className="relative">
                    <span className={fieldIconWrapClass}><Tag size={17} /></span>
                    <input
                      type="text"
                      id="serviceName"
                      value={formData.serviceName}
                      onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Ex: Prestation Mariage Complète"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="servicePrice" className="block text-sm font-semibold text-ink mb-2">
                    Prix de départ pour ce service (optionnel)
                  </label>
                  <div className="relative">
                    <span className={fieldIconWrapClass}><DollarSign size={17} /></span>
                    <input
                      type="number"
                      id="servicePrice"
                      value={formData.servicePrice}
                      onChange={(e) => setFormData({ ...formData, servicePrice: e.target.value })}
                      className={`${fieldInputClass} pr-14 font-mono`}
                      placeholder="Ex: 250000"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-ink/40 text-sm font-mono">
                      FCFA
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleNext}
                  disabled={!formData.serviceName}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-sand bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer <ChevronRight size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: DISPONIBILITÉS */}
          {step === 6 && (
            <motion.div key="step-6" {...stepTransition} className="space-y-6">
              <StepHeader icon={Calendar} title="Horaires de base" subtitle="Quels jours de la semaine êtes-vous disponible ?" />

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 1, label: "Lundi" },
                    { id: 2, label: "Mardi" },
                    { id: 3, label: "Mercredi" },
                    { id: 4, label: "Jeudi" },
                    { id: 5, label: "Vendredi" },
                    { id: 6, label: "Samedi" },
                    { id: 0, label: "Dimanche" }
                  ].map((day) => {
                    const isSelected = formData.workingDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.id)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-colors
                          ${isSelected
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white border-ink/15 text-ink/60 hover:border-ink/30"
                          }`}
                      >
                        {day.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-ink/50 text-center mt-2">Par défaut: 09:00 - 18:00 (Vous pourrez ajuster les heures exactes dans le Dashboard).</p>
              </div>

              <div className="pt-8">
                <button
                  onClick={handleProviderSubmit}
                  disabled={isPending || formData.workingDays.length === 0}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-sand bg-primary hover:bg-primary/90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
                >
                  {isPending ? "Création du profil..." : "Terminer et accéder au Dashboard"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        </div>
      </div>
    </div>
    </OnboardingBackground>
  );
}
