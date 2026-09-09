import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export function RevenueWidget({ total, currency, growth }: { total: number, currency: string, growth: number }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
  };

  const isPositive = growth >= 0;

  return (
    <div className="bg-gradient-to-br from-primary to-accent-500 rounded-2xl p-6 shadow-md text-white flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
          <Wallet className="w-4 h-4" /> Revenus (Mois)
        </h2>
        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
          Sep 2026
        </span>
      </div>

      <div className="relative z-10 mt-6 mb-2">
        <div className="text-4xl lg:text-5xl font-heading font-bold tracking-tight">
          {formatCurrency(total)}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className={`flex items-center text-sm font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-success/20 text-green-100' : 'bg-error/20 text-red-100'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
            {Math.abs(growth)}%
          </div>
          <span className="text-sm text-white/70">vs mois précédent</span>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
        <div>
          <p className="text-xs text-white/70 font-medium">À encaisser</p>
          <p className="text-lg font-bold">{formatCurrency(total * 0.35)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium">En attente (Devis)</p>
          <p className="text-lg font-bold">{formatCurrency(total * 0.15)}</p>
        </div>
      </div>
    </div>
  );
}
