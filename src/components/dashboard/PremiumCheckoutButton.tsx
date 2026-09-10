"use client";

import { useState } from "react";
import { startPremiumCheckout } from "@/app/dashboard/settings/premium/actions";

export function PremiumCheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await startPremiumCheckout();
    if (res.success && res.paymentPageUrl) {
      window.location.href = res.paymentPageUrl;
      return;
    }
    setLoading(false);
    alert(res.error || "Une erreur s'est produite.");
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-6 py-3 bg-accent-2 hover:bg-accent-2-600 text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
    >
      {loading ? "Redirection..." : "Passer Premium — 15 000 FCFA / mois"}
    </button>
  );
}
