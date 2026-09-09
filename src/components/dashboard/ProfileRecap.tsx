"use client";

import { User, ProviderProfile } from "@prisma/client";
import { User as UserIcon, MapPin, Tag, CheckCircle2, Music, Camera, Briefcase, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type UserWithProfile = User & {
  providerProfile: ProviderProfile | null;
};

export function ProfileRecap({ user }: { user: UserWithProfile }) {
  const profile = user.providerProfile;

  if (!profile) {
    return (
      <div className="flex h-full w-80 flex-col border-l border-ink/10 bg-white p-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Profil incomplet</h3>
        <p className="text-sm text-ink/70 mb-4">
          Vous devez terminer votre inscription pour accéder à toutes les fonctionnalités.
        </p>
        <Link 
          href="/onboarding"
          className="w-full text-center py-2 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Compléter mon profil
        </Link>
      </div>
    );
  }

  // Choose icon based on pole
  const getPoleIcon = () => {
    switch(profile.pole) {
      case "DIVERTISSEMENT": return <Music className="w-4 h-4" />;
      case "RECEPTION": return <Briefcase className="w-4 h-4" />;
      case "IMAGE_SOUVENIR": return <Camera className="w-4 h-4" />;
      case "SERVICES": return <Sparkles className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const poleLabels = {
    DIVERTISSEMENT: "Divertissement",
    RECEPTION: "Réception",
    IMAGE_SOUVENIR: "Image & Souvenir",
    SERVICES: "Services"
  };

  return (
    <div className="flex h-full w-80 flex-col border-l border-ink/10 bg-white">
      <div className="p-6 border-b border-ink/10">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-sand/50 shadow-sm bg-sand/30 flex items-center justify-center">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={profile.name} 
                fill 
                className="object-cover" 
              />
            ) : (
              <UserIcon className="w-10 h-10 text-primary/50" />
            )}
          </div>
          <h2 className="text-xl font-heading font-bold text-ink flex items-center gap-1 justify-center">
            {profile.name}
            {profile.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </h2>
          <p className="text-sm text-ink/70 mt-1">{user.email}</p>
          <span className="mt-2 inline-flex items-center rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink/70 ring-1 ring-inset ring-ink/10">
            {poleLabels[profile.pole]}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/50 mb-4">
          Résumé du profil
        </h3>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-ink/50 font-medium uppercase">Catégorie</p>
              <p className="text-sm font-semibold text-ink">{profile.category}</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              {getPoleIcon()}
            </div>
            <div>
              <p className="text-xs text-ink/50 font-medium uppercase">Spécialité / Style</p>
              <p className="text-sm font-semibold text-ink">{profile.specialty || "Non spécifié"}</p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-ink/50 font-medium uppercase">Localisation</p>
              <p className="text-sm font-semibold text-ink">{profile.location}</p>
            </div>
          </li>
        </ul>

        {profile.basePrice && (
          <div className="mt-8 bg-sand/30 rounded-xl p-4 border border-ink/5">
            <p className="text-xs text-ink/50 font-medium uppercase text-center mb-1">Tarif de base</p>
            <p className="text-2xl font-heading font-bold text-ink text-center">
              {profile.basePrice} <span className="text-base text-ink/70">{profile.currency}</span>
            </p>
          </div>
        )}
        
        <div className="mt-8">
          <Link 
            href="/dashboard/settings"
            className="w-full flex items-center justify-center py-2.5 px-4 bg-ink/5 text-ink rounded-lg font-medium hover:bg-ink/10 transition-colors text-sm"
          >
            Modifier le profil
          </Link>
        </div>
      </div>
    </div>
  );
}
