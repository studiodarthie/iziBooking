"use client";

import { useState } from "react";
import { Plus, X, Save, Tag } from "lucide-react";
import { createCoupon, toggleCouponActive, deleteCoupon } from "@/app/dashboard/coupons/actions";
import { useRouter } from "next/navigation";
import type { Coupon, DiscountType } from "@prisma/client";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function CouponForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE" as DiscountType,
    discountValue: "",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await createCoupon({
      code: formData.code,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      validFrom: formData.validFrom || undefined,
      validUntil: formData.validUntil || undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
    });

    setLoading(false);
    if (res.success) {
      onCancel();
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="bg-sand/30 border border-ink/10 rounded-2xl p-6 mb-8 relative">
      <button
        onClick={onCancel}
        className="absolute top-6 right-6 text-ink/40 hover:text-ink transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-bold text-ink mb-6">Nouveau code promo</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Code</label>
            <input
              required
              type="text"
              placeholder="Ex: BIENVENUE20"
              className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Type de remise</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
              value={formData.discountType}
              onChange={e => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
            >
              <option value="PERCENTAGE">Pourcentage (%)</option>
              <option value="FIXED_AMOUNT">Montant fixe (FCFA)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">
              Valeur {formData.discountType === "PERCENTAGE" ? "(%)" : "(FCFA)"}
            </label>
            <input
              required
              type="number"
              min={0}
              max={formData.discountType === "PERCENTAGE" ? 100 : undefined}
              placeholder={formData.discountType === "PERCENTAGE" ? "20" : "5000"}
              className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.discountValue}
              onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Limite d&apos;usage (optionnel)</label>
            <input
              type="number"
              min={1}
              placeholder="Illimité"
              className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.usageLimit}
              onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Expire le (optionnel)</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.validUntil}
              onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 font-semibold text-ink bg-white border border-ink/20 rounded-xl hover:bg-sand/50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? "..." : "Créer le code"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CouponListClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleToggle = async (coupon: Coupon) => {
    setBusyId(coupon.id);
    const res = await toggleCouponActive(coupon.id, !coupon.isActive);
    setBusyId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Supprimer le code ${coupon.code} ?`)) return;
    setBusyId(coupon.id);
    const res = await deleteCoupon(coupon.id);
    setBusyId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-ink/60">
          Un code actif peut être saisi par un organisateur au moment de sa demande de réservation.
        </p>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Créer un code
          </button>
        )}
      </div>

      {isCreating && <CouponForm onCancel={() => setIsCreating(false)} />}

      {!isCreating && initialCoupons.length === 0 && (
        <div className="bg-white border border-ink/10 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center mb-4 text-primary">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">Aucun code promo</h3>
          <p className="text-ink/60 max-w-sm mb-6">
            Lancez une offre de bienvenue ou une promotion saisonnière en créant votre premier code.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-ink hover:bg-ink/90 text-white font-semibold py-2.5 px-6 rounded-xl transition-all"
          >
            Créer mon premier code
          </button>
        </div>
      )}

      {!isCreating && initialCoupons.length > 0 && (
        <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Remise</th>
                <th className="px-6 py-4">Utilisation</th>
                <th className="px-6 py-4">Expire le</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialCoupons.map(coupon => (
                <tr key={coupon.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-6 py-4 font-bold text-ink">{coupon.code}</td>
                  <td className="px-6 py-4 text-ink/70">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString('fr-FR')} FCFA`}
                  </td>
                  <td className="px-6 py-4 text-ink/70">
                    {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : " (illimité)"}
                  </td>
                  <td className="px-6 py-4 text-ink/70">
                    {coupon.validUntil ? toDateInputValue(coupon.validUntil) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      coupon.isActive ? "bg-success/10 text-success" : "bg-ink/5 text-ink/50"
                    }`}>
                      {coupon.isActive ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        disabled={busyId === coupon.id}
                        onClick={() => handleToggle(coupon)}
                        className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                      >
                        {coupon.isActive ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        disabled={busyId === coupon.id}
                        onClick={() => handleDelete(coupon)}
                        className="text-xs font-bold text-red-500 hover:underline disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
