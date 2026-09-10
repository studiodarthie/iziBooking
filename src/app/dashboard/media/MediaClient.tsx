"use client";

import { Image as ImageIcon, Plus, Music, Loader2, Trash2 } from "lucide-react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { addMediaToProfile, deleteMedia } from "./actions";
import { useState } from "react";
import Image from "next/image";

type MediaLink = {
  id: string;
  type: string;
  url: string;
};

export default function MediaClient({ initialMedia, isPremium, photoLimit }: { initialMedia: MediaLink[]; isPremium: boolean; photoLimit: number }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaLink[]>(initialMedia);
  const photoCount = media.filter(m => m.type === "IMAGE").length;
  const photoLimitReached = !isPremium && photoCount >= photoLimit;

  const handleSuccess = async (result: CloudinaryUploadWidgetResults) => {
    if (typeof result.info !== "object" || !result.info) return;
    setIsUploading(true);
    try {
      const url = result.info.secure_url;
      const format = result.info.resource_type === "video" ? "video" : result.info.format;

      // On the server, it creates and revalidates
      await addMediaToProfile(url, format);

      // Temporarily add to UI before full refresh (or just let server action refresh)
      // For immediate feedback:
      let type = "IMAGE";
      if (["mp4", "mov", "video"].includes(format)) type = "VIDEO";
      else if (["mp3", "wav", "audio"].includes(format)) type = "AUDIO";

      setMedia(prev => [{ id: "temp-" + Date.now(), url, type }, ...prev]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de l'ajout du média.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith("temp-")) return;
    setIsDeleting(id);
    try {
      await deleteMedia(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression du média");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Médiathèque</h1>
          <p className="mt-1 text-sm text-ink/70">
            Gérez vos photos, vidéos et extraits audios pour votre profil artiste.
          </p>
          {!isPremium && (
            <p className="mt-1 text-xs font-medium text-ink/50">
              {photoCount}/{photoLimit} photos utilisées (forfait gratuit).{" "}
              {photoLimitReached && (
                <a href="/dashboard/settings/premium" className="text-primary underline">Passer Premium pour des photos illimitées</a>
              )}
            </p>
          )}
        </div>

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kamita_preset"}
          options={{
            resourceType: "auto", // Allows images and videos
          }}
          onSuccess={handleSuccess}
        >
          {({ open }) => (
            <button 
              onClick={() => open()} 
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-sand hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              {isUploading ? "Ajout..." : "Ajouter un média"}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {media.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-ink/5 border border-ink/10 rounded-2xl">
          <ImageIcon size={48} className="text-ink/20 mb-4" />
          <p className="text-ink/60 font-medium">Aucun média pour le moment</p>
          <p className="text-ink/40 text-sm mt-1">Ajoutez des photos ou vidéos pour mettre en valeur votre profil</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {media.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-ink/5 border border-ink/10 flex flex-col">
              {item.type === "IMAGE" ? (
                <Image src={item.url} alt="Media" fill className="object-cover" />
              ) : item.type === "VIDEO" ? (
                <video src={item.url} className="w-full h-full object-cover" controls />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-ink/40">
                  <Music size={48} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">Audio</span>
                </div>
              )}
              
              {/* Overlay with delete button */}
              <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting === item.id}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                  title="Supprimer ce média"
                >
                  {isDeleting === item.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
