import Link from "next/link";
import { ChevronRight, Image as ImageIcon, CreditCard, Calendar, Star } from "lucide-react";

export function ProfileHealthWidget({ score = 75 }: { score?: number }) {
  // Logic to determine color based on score
  const getScoreColor = () => {
    if (score >= 90) return "text-success bg-success/20";
    if (score >= 60) return "text-warning bg-warning/20";
    return "text-error bg-error/20";
  };
  
  const getStrokeColor = () => {
    if (score >= 90) return "stroke-success";
    if (score >= 60) return "stroke-warning";
    return "stroke-error";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-heading font-semibold text-ink flex items-center gap-2">
          <span className="text-xl">🚀</span> Santé du profil
        </h2>
        <Link href="/dashboard/settings/profile" className="text-sm font-medium text-ink/60 hover:text-primary transition-colors flex items-center gap-1">
          Modifier <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 px-6 pb-6 flex flex-col items-center">
        {/* Circular Progress (SVG) */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-sand" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              strokeWidth="8" 
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * score) / 100}
              className={`transition-all duration-1000 ease-out ${getStrokeColor()}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-heading font-bold ${getScoreColor().split(' ')[0]}`}>{score}%</span>
          </div>
        </div>

        <p className="text-sm text-ink/70 text-center mb-6">
          Un profil complet attire jusqu'à <strong className="text-ink">3x plus de réservations</strong>. Complétez ces étapes :
        </p>

        <div className="w-full space-y-3">
          <Link href="/dashboard/media" className="flex items-center gap-3 p-3 rounded-xl border border-ink/10 hover:border-primary/50 hover:bg-primary/5 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <ImageIcon className="w-4 h-4 text-ink/50 group-hover:text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-ink">Ajouter des photos/vidéos</h4>
              <p className="text-xs text-ink/50">Médiathèque (0/5)</p>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-ink/20 group-hover:border-primary/50"></div>
          </Link>
          
          <Link href="/dashboard/settings/payments" className="flex items-center gap-3 p-3 rounded-xl border border-ink/10 hover:border-primary/50 hover:bg-primary/5 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <CreditCard className="w-4 h-4 text-ink/50 group-hover:text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-ink">Configurer les paiements</h4>
              <p className="text-xs text-ink/50">Pour recevoir vos acomptes</p>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-ink/20 group-hover:border-primary/50"></div>
          </Link>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20 opacity-70">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-ink line-through decoration-ink/30">Calendrier mis à jour</h4>
              <p className="text-xs text-success font-medium">Terminé</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
