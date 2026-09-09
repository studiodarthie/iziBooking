"use client";

import { useState } from "react";
import { Plus, X, Save } from "lucide-react";
import { createService, updateService, deleteService } from "@/app/dashboard/services/actions";
import { useRouter } from "next/navigation";

export function ServiceForm({ service, onCancel }: { service?: any, onCancel: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: service?.name || "",
    category: service?.category || "",
    description: service?.description || "",
    startingPrice: service?.startingPrice || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      startingPrice: formData.startingPrice ? Number(formData.startingPrice) : undefined,
    };

    let res;
    if (service?.id) {
      res = await updateService(service.id, data);
    } else {
      res = await createService(data);
    }

    setLoading(false);
    if (res.success) {
      onCancel();
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async () => {
    if (!service?.id) return;
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
    
    setLoading(true);
    const res = await deleteService(service.id);
    if (res.success) {
      onCancel();
      router.refresh();
    } else {
      alert(res.error);
      setLoading(false);
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
      
      <h3 className="text-xl font-bold text-ink mb-6">
        {service ? "Modifier le service" : "Nouveau service"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Nom du service / Package</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Pack Mariage Complet"
              className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Catégorie (optionnel)</label>
            <input 
              type="text" 
              placeholder="Ex: Sonorisation"
              className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1">Description</label>
          <textarea 
            rows={3}
            placeholder="Détaillez ce que comprend ce service..."
            className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="w-full md:w-1/2">
          <label className="block text-sm font-semibold text-ink mb-1">Prix de départ (indicatif)</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.startingPrice}
              onChange={e => setFormData({...formData, startingPrice: e.target.value})}
            />
            <span className="absolute right-4 top-2.5 text-ink/50 font-medium">FCFA</span>
          </div>
          <p className="text-xs text-ink/50 mt-1">Comme les réservations se font sur devis, ce prix donne juste une idée à vos clients.</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-ink/10">
          {service?.id ? (
            <button 
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="text-red-500 font-medium hover:text-red-600 text-sm"
            >
              Supprimer ce service
            </button>
          ) : <div></div>}
          
          <div className="flex gap-3">
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
              <Save className="w-4 h-4" /> {loading ? "..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function ServiceListClient({ initialServices }: { initialServices: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeService = editingId ? initialServices.find(s => s.id === editingId) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-ink/60">
          Présentez vos différentes offres. Les clients pourront s'en inspirer pour leur demande de devis.
        </p>
        {!isCreating && !editingId && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Ajouter un service
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <ServiceForm 
          service={activeService} 
          onCancel={() => {
            setIsCreating(false);
            setEditingId(null);
          }} 
        />
      )}

      {!isCreating && !editingId && initialServices.length === 0 && (
        <div className="bg-white border border-ink/10 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center mb-4 text-primary">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">Aucun service</h3>
          <p className="text-ink/60 max-w-sm mb-6">
            Commencez par ajouter les services que vous proposez pour construire votre catalogue.
          </p>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-ink hover:bg-ink/90 text-white font-semibold py-2.5 px-6 rounded-xl transition-all"
          >
            Créer mon premier service
          </button>
        </div>
      )}

      {!isCreating && !editingId && initialServices.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {initialServices.map(service => (
            <div key={service.id} className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  {service.category && (
                    <span className="inline-block px-2.5 py-1 rounded-md bg-sand text-ink text-[10px] font-bold uppercase tracking-wider mb-2">
                      {service.category}
                    </span>
                  )}
                  <h4 className="font-bold text-lg text-ink leading-tight">{service.name}</h4>
                </div>
                <button 
                  onClick={() => setEditingId(service.id)}
                  className="text-ink/30 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  Modifier
                </button>
              </div>
              <p className="text-sm text-ink/60 line-clamp-3 mb-6 min-h-[60px]">
                {service.description || "Aucune description"}
              </p>
              <div className="pt-4 border-t border-ink/5">
                <div className="text-xs text-ink/50 uppercase font-semibold mb-1">À partir de</div>
                <div className="text-xl font-heading font-bold text-ink">
                  {service.startingPrice ? `${service.startingPrice.toLocaleString('fr-FR')} FCFA` : "Sur devis"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
