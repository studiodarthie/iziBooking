import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Calendar, Camera, Music, Utensils, Briefcase } from "lucide-react";

type ProviderCardProps = {
  id: string;
  name: string;
  category: string;
  location: string;
  basePrice: number | null;
  currency: string;
  image?: string | null;
  rating?: number; // real average rating, 0 or undefined means no reviews yet
  reviewCount?: number;
  availableDate?: string;
  bio?: string | null;
  pole?: string;
};

export function ProviderCard({
  id, name, category, location, basePrice, currency, image,
  rating, reviewCount = 0, availableDate, bio, pole
}: ProviderCardProps) {
  
  // Icon based on Pole
  const getPoleIcon = () => {
    switch(pole) {
      case "DIVERTISSEMENT": return <Music size={14} className="text-primary" />;
      case "RECEPTION": return <Utensils size={14} className="text-primary" />;
      case "IMAGE_SOUVENIR": return <Camera size={14} className="text-primary" />;
      default: return <Briefcase size={14} className="text-primary" />;
    }
  };

  const poleLabel = pole === "DIVERTISSEMENT" ? "Divertissement" :
                    pole === "RECEPTION" ? "Réception & Traiteur" :
                    pole === "IMAGE_SOUVENIR" ? "Image & Souvenir" : "Services";

  return (
    <div className="group bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/p/${id}`} className="contents">
        {/* Cover Image */}
        <div className="relative h-48 w-full bg-sand/50 overflow-hidden">
          {image ? (
            <Image 
              src={image} 
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-ink/20 font-heading text-4xl font-bold bg-primary/5">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Pill Badges (Top Left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {pole && (
              <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-ink shadow-sm flex items-center gap-1.5 w-fit">
                {getPoleIcon()}
                {poleLabel}
              </div>
            )}
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-ink shadow-sm flex items-center gap-1.5 w-fit">
              <span className="text-primary">•</span>
              {category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading font-bold text-lg text-ink line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm font-semibold text-ink shrink-0 ml-2 bg-sand/50 px-2 py-0.5 rounded-md">
              {reviewCount > 0 && rating ? (
                <>
                  <Star size={12} className="fill-accent text-accent" />
                  <span>{rating.toFixed(1)}</span>
                </>
              ) : (
                <span className="text-ink/40 text-xs">Nouveau</span>
              )}
            </div>
          </div>

          {/* Bio snippet */}
          {bio && (
            <p className="text-sm text-ink/60 line-clamp-2 mb-4">
              {bio}
            </p>
          )}

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-2 text-sm text-ink/70">
              <MapPin size={14} className="text-primary/70" />
              <span className="line-clamp-1">{location}</span>
            </div>
            
            {availableDate && (
              <div className="flex items-center gap-2 text-sm text-trust">
                <Calendar size={14} className="text-trust" />
                <span className="font-medium">Disponible le {availableDate}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 mt-auto pt-4 border-t border-ink/10 flex items-center justify-between">
        <div>
          <span className="text-xs text-ink/50 block mb-0.5 uppercase tracking-wider font-semibold">À partir de</span>
          {basePrice ? (
            <span className="font-bold text-ink text-lg">{basePrice.toLocaleString("fr-FR")} {currency}</span>
          ) : (
            <span className="font-bold text-ink text-lg">Sur devis</span>
          )}
        </div>

        <Link href={`/book/${id}`} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary/20 transition-colors">
          <Calendar size={16} />
          Réserver
        </Link>
      </div>
    </div>
  );
}
