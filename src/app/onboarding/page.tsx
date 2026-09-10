"use client";

import { useState } from "react";
import { Briefcase, Sparkles, MapPin, DollarSign, UploadCloud, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { submitProviderProfile, submitOrganizerProfile } from "./actions";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";

type Role = "ORGANIZER" | "PROVIDER" | null;

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
    return (
      <div className="min-h-screen bg-sand flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-ink">
            Bienvenue sur iziBooking
          </h2>
          <p className="mt-2 text-center text-sm text-ink/60">
            Pour commencer, dites-nous comment vous souhaitez utiliser la plateforme.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <button
              onClick={() => handleRoleSelect("ORGANIZER")}
              disabled={isPending}
              className="relative rounded-2xl border-2 border-ink/10 bg-white p-8 text-center hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all hover:shadow-lg group disabled:opacity-50"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 group-hover:bg-primary/10 transition-colors mb-4">
                <Briefcase className="h-8 w-8 text-ink/70 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-ink">Je suis Organisateur</h3>
              <p className="mt-2 text-sm text-ink/60">Je cherche des prestataires pour mes événements.</p>
            </button>

            <button
              onClick={() => handleRoleSelect("PROVIDER")}
              disabled={isPending}
              className="relative rounded-2xl border-2 border-ink/10 bg-white p-8 text-center hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all hover:shadow-lg group disabled:opacity-50"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 group-hover:bg-primary/10 transition-colors mb-4">
                <Sparkles className="h-8 w-8 text-ink/70 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-ink">Je suis Prestataire</h3>
              <p className="mt-2 text-sm text-ink/60">Je propose mes services (Artiste, Traiteur, Photo...).</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ORGANIZER FLOW
  // -------------------------------------------------------------
  if (role === "ORGANIZER") {
    return (
      <div className="min-h-screen bg-sand flex flex-col py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button onClick={handleBack} className="flex items-center text-ink/60 hover:text-ink text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Retour
          </button>
          
          <div className="bg-white py-10 px-6 shadow-xl shadow-ink/5 sm:rounded-2xl sm:px-10 border border-ink/5 text-center">
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
    );
  }

  // -------------------------------------------------------------
  // PROVIDER FLOW
  // -------------------------------------------------------------
  const totalSteps = 6;
  
  return (
    <div className="min-h-screen bg-sand flex flex-col py-12 sm:px-6 lg:px-8 font-sans">
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
          <div className="w-full bg-ink/10 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl shadow-ink/5 sm:rounded-2xl sm:px-10 border border-ink/5">
          
          {/* STEP 2: IDENTITÉ */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-ink">Votre identité</h2>
                <p className="text-sm text-ink/60 mt-1">Dites-nous ce que vous proposez.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="pole" className="block text-sm font-medium text-ink mb-1">
                    Pôle d’activité principal
                  </label>
                  <select
                    id="pole"
                    value={formData.pole}
                    onChange={(e) => setFormData({ ...formData, pole: e.target.value })}
                    className="block w-full rounded-xl border-ink/20 py-3 pl-4 pr-10 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                  >
                    <option value="DIVERTISSEMENT">Divertissement (Musique, Danse, Animation...)</option>
                    <option value="RECEPTION">Réception (Traiteur, Décoration, Salles...)</option>
                    <option value="IMAGE_SOUVENIR">Image & Souvenir (Photo, Vidéo, Drone...)</option>
                    <option value="SERVICES">Services (Sécurité, Transport, Wedding Planner...)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
                    Nom de scène ou d’entreprise *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-xl border-ink/20 pl-4 pr-4 py-3 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                    placeholder="Ex: Les Danseurs du Wouri, Traiteur XYZ..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-ink mb-1">
                    Catégorie exacte *
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full rounded-xl border-ink/20 py-3 pl-4 pr-4 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                    placeholder="Ex: DJ, Photographe, Traiteur..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-ink mb-1">
                    Spécialité / Style (optionnel)
                  </label>
                  <input
                    type="text"
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="block w-full rounded-xl border-ink/20 py-3 pl-4 pr-4 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                    placeholder="Ex: Afrobeats, Cuisine Locale..."
                  />
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
            </div>
          )}

          {/* STEP 3: LOCALISATION ET TARIFS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-ink">Localisation & Tarifs</h2>
                <p className="text-sm text-ink/60 mt-1">Où êtes-vous basé et quels sont vos tarifs ?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-ink mb-1">
                    Ville principale *
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-ink/40" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="block w-full rounded-xl border-ink/20 pl-10 py-3 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                      placeholder="Ex: Douala, Cameroun"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-ink mb-1">
                    Tarif de base indicatif (optionnel)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-ink/40" />
                    </div>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="block w-full rounded-xl border-ink/20 pl-10 pr-12 py-3 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20 font-mono"
                      placeholder="Ex: 150000"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-ink/50 sm:text-sm font-mono">FCFA</span>
                    </div>
                  </div>
                  <p className="text-xs text-ink/50 mt-1">Ce tarif apparaîtra sur votre profil public pour donner une idée aux clients.</p>
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
            </div>
          )}

          {/* STEP 4: MEDIAS */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-ink">Photo de profil</h2>
                <p className="text-sm text-ink/60 mt-1">Ajoutez un visage ou un logo à votre profil.</p>
              </div>

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-ink/10 border-dashed rounded-2xl hover:border-primary/50 transition-colors bg-sand/10">
                <div className="space-y-1 text-center flex flex-col items-center w-full">
                  {formData.image ? (
                    <img src={formData.image} alt="Profil" className="h-28 w-28 rounded-full object-cover mb-4 shadow-md border-4 border-white" />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-white shadow-sm border border-ink/5 flex items-center justify-center mb-4">
                      <UploadCloud className="h-10 w-10 text-ink/30" />
                    </div>
                  )}
                  
                  <CldUploadWidget
                    uploadPreset="izibooking_preset"
                    signatureEndpoint="/api/cloudinary/sign"
                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                      if (typeof result.info !== "object" || !result.info) return;
                      setFormData({ ...formData, image: result.info.secure_url });
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="relative cursor-pointer bg-white border border-ink/10 shadow-sm rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-sand/50 focus-within:outline-none transition-colors"
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
            </div>
          )}

          {/* STEP 5: SERVICE INITIAL */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-ink">Premier Service</h2>
                <p className="text-sm text-ink/60 mt-1">Créez votre première offre pour être réservable immédiatement.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="serviceName" className="block text-sm font-medium text-ink mb-1">
                    Nom du service *
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="block w-full rounded-xl border-ink/20 pl-4 pr-4 py-3 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                    placeholder="Ex: Prestation Mariage Complète"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="servicePrice" className="block text-sm font-medium text-ink mb-1">
                    Prix de départ pour ce service (optionnel)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-ink/40" />
                    </div>
                    <input
                      type="number"
                      id="servicePrice"
                      value={formData.servicePrice}
                      onChange={(e) => setFormData({ ...formData, servicePrice: e.target.value })}
                      className="block w-full rounded-xl border-ink/20 pl-10 pr-12 py-3 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20 font-mono"
                      placeholder="Ex: 250000"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-ink/50 sm:text-sm font-mono">FCFA</span>
                    </div>
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
            </div>
          )}

          {/* STEP 6: DISPONIBILITÉS */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-ink">Horaires de base</h2>
                <p className="text-sm text-ink/60 mt-1">Quels jours de la semaine êtes-vous disponible ?</p>
              </div>

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
                        className={`py-3 px-2 rounded-xl text-sm font-medium border transition-colors
                          ${isSelected 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-white border-ink/20 text-ink/60 hover:border-ink/40"
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
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
