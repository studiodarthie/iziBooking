import { CheckCircle2, Plus, PenSquare } from "lucide-react";

export function ProviderSkillsWidget({ category = "DJ" }: { category?: string }) {
  // Mock data for skills
  const skills = [
    "Mixage Live",
    "Animation Micro",
    "Éclairage Scénique",
    "Playlist Personnalisée",
    "Sonorisation Complète"
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-heading font-semibold text-ink flex items-center gap-2">
          <span className="text-xl">✨</span> Mes Services
        </h2>
        <button className="text-sm font-medium text-ink/60 hover:text-primary transition-colors flex items-center gap-1">
          Modifier <PenSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-6">
        <p className="text-xs text-ink/60 mb-4">
          Vous pouvez ajouter jusqu’à 5 services clés pour la catégorie <strong className="text-ink">{category}</strong>.
        </p>

        <ul className="space-y-3">
          {skills.map((skill, idx) => (
            <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-sand/30 border border-ink/5 hover:bg-sand/50 transition-colors group">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-ink">{skill}</span>
              </div>
            </li>
          ))}
          {skills.length < 5 && (
            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-ink/20 text-ink/60 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Ajouter un service ({5 - skills.length} restants)</span>
            </button>
          )}
        </ul>
      </div>
    </div>
  );
}
