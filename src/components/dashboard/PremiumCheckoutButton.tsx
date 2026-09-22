"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { startPremiumCheckout } from "@/app/dashboard/settings/premium/actions";
import { PREMIUM_TIERS } from "@/lib/plan";

const fmt = (n: number) => n.toLocaleString("fr-FR");

export function PremiumCheckoutButton() {
  const [tierId, setTierId] = useState(PREMIUM_TIERS.find((t) => t.popular)?.id ?? PREMIUM_TIERS[0].id);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await startPremiumCheckout(tierId);
    if (res.success && res.paymentPageUrl) {
      window.location.href = res.paymentPageUrl;
      return;
    }
    setLoading(false);
    alert(res.error || "Une erreur s'est produite.");
  };

  const selected = PREMIUM_TIERS.find((t) => t.id === tierId) ?? PREMIUM_TIERS[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {PREMIUM_TIERS.map((tier) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => setTierId(tier.id)}
            className={`relative text-left rounded-xl border-2 p-3 transition-colors ${
              tierId === tier.id ? "border-accent-2-600 bg-accent-2/10" : "border-ink/10 hover:border-ink/20"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-2 right-2 bg-accent-2-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Populaire
              </span>
            )}
            <p className="text-sm font-bold text-ink">{tier.label}</p>
            <p className="text-xs text-ink/60 mt-0.5">{fmt(tier.perMonth)} FCFA/mois</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-2 hover:bg-accent-2-600 text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
      >
        <Zap size={18} />
        {loading ? "Redirection..." : `Passer Premium — ${fmt(selected.price)} FCFA`}
      </button>
    </div>
  );
}
