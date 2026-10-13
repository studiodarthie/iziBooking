import { Eye } from "lucide-react";
import { stopImpersonating } from "@/app/admin/users/actions";

/**
 * Bandeau permanent affiché sur tout le dashboard tant qu'un admin visualise l'interface d'un
 * autre compte (session.impersonatedBy) — un rappel impossible à manquer qu'on n'est pas
 * vraiment connecté en tant que cet utilisateur, avec un retour en un clic.
 */
export function ImpersonationBanner({ targetName, adminName }: { targetName: string; adminName: string | null }) {
  return (
    <div className="sticky top-0 z-[60] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-ink text-white text-sm font-semibold px-4 py-2.5 text-center">
      <span className="flex items-center gap-1.5">
        <Eye size={15} />
        Vous visualisez l&apos;interface de <strong>{targetName}</strong>
        {adminName ? ` — connecté en tant qu'admin : ${adminName}` : ""}
      </span>
      <form action={stopImpersonating}>
        <button type="submit" className="underline decoration-white/50 hover:decoration-white transition-colors">
          Retour admin
        </button>
      </form>
    </div>
  );
}
