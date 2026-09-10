"use client";

import { useState } from "react";
import { toggleProviderVerification } from "./actions";
import { ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProviderQuickView } from "@/components/admin/ProviderQuickView";
import type { ProviderWithDetails } from "./page";

export function ProviderListClient({ initialProviders }: { initialProviders: ProviderWithDetails[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderWithDetails | null>(null);

  const handleToggle = async (providerId: string, currentStatus: boolean) => {
    // Prevent the row click event from firing if we clicked the button directly
    setLoadingId(providerId);
    const res = await toggleProviderVerification(providerId, currentStatus);
    setLoadingId(null);
    
    if (res.success) {
      // Update the local state of selectedProvider to reflect the new status without closing the drawer
      if (selectedProvider && selectedProvider.id === providerId) {
        setSelectedProvider({ ...selectedProvider, isVerified: !currentStatus });
      }
      router.refresh();
    } else {
      alert("Erreur: " + res.error);
    }
  };

  return (
    <>
      {initialProviders.map((provider) => (
        <tr 
          key={provider.id} 
          onClick={() => setSelectedProvider(provider)}
          className="border-b border-ink/5 hover:bg-sand/30 transition-colors cursor-pointer group"
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-ink/10 overflow-hidden bg-white shrink-0 group-hover:shadow-md transition-shadow">
                {provider.user?.image ? (
                  <img src={provider.user.image} alt={provider.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink/50 font-bold bg-accent/10 text-accent-700">
                    {provider.name?.charAt(0) || "P"}
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-ink group-hover:text-primary transition-colors">{provider.name}</div>
                <div className="text-xs text-ink/50">{provider.user?.email || "Aucun email"}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 font-medium">
            {provider.category}
          </td>
          <td className="px-6 py-4">
            {provider.location}
          </td>
          <td className="px-6 py-4">
            {provider.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success">
                <CheckCircle2 size={14} /> Vérifié
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-warning/20 text-warning-700">
                <ShieldAlert size={14} /> En attente
              </span>
            )}
          </td>
          <td className="px-6 py-4 text-right">
            <button
              disabled={loadingId === provider.id}
              onClick={(e) => {
                e.stopPropagation(); // Don't open the drawer when clicking the button directly
                handleToggle(provider.id, provider.isVerified);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 ${
                provider.isVerified 
                  ? "bg-ink/5 text-ink/50 hover:bg-red-500/10 hover:text-red-600 opacity-0 group-hover:opacity-100" 
                  : "bg-success text-white hover:bg-success/90 shadow-sm shadow-success/20"
              }`}
            >
              {loadingId === provider.id ? (
                "..."
              ) : provider.isVerified ? (
                "Révoquer"
              ) : (
                <>
                  <ShieldCheck size={16} /> Approuver
                </>
              )}
            </button>
          </td>
        </tr>
      ))}

      {/* Slide-over UI */}
      <ProviderQuickView 
        provider={selectedProvider} 
        onClose={() => setSelectedProvider(null)} 
        onToggleVerification={handleToggle}
        isToggling={loadingId !== null}
      />
    </>
  );
}
