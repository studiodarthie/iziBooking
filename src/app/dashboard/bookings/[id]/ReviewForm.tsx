"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { submitReview } from "./actions";

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Merci de choisir une note.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await submitReview(bookingId, rating, comment);
    setLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6">
      <h3 className="font-heading font-bold text-ink mb-1">Comment s’est passée la prestation ?</h3>
      <p className="text-sm text-ink/60 mb-4">Votre avis sera visible sur le profil public du prestataire.</p>

      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            className="p-0.5"
          >
            <Star
              size={28}
              className={(hoverRating || rating) >= n ? "fill-accent text-accent" : "text-ink/20"}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Décrivez votre expérience (optionnel)..."
        className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none mb-3"
      />

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Publier mon avis
      </button>
    </div>
  );
}
