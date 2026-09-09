"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Tag, DollarSign, Clock, Info } from "lucide-react";
import { Service } from "@prisma/client";

export default function ServicesClient({ 
  initialServices, 
  providerProfileId 
}: { 
  initialServices: Service[];
  providerProfileId: string;
}) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setDescription("");
    setStartingPrice("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingId(service.id);
    setName(service.name);
    setCategory(service.category || "");
    setDescription(service.description || "");
    setStartingPrice(service.startingPrice ? service.startingPrice.toString() : "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Minimal optimistic UI / Mock save for now
    const newService: Service = {
      id: editingId || `temp-${Date.now()}`,
      providerProfileId,
      name,
      category: category || null,
      description: description || null,
      startingPrice: startingPrice ? parseFloat(startingPrice) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (editingId) {
      setServices(services.map(s => s.id === editingId ? newService : s));
    } else {
      setServices([newService, ...services]);
    }
    
    // TODO: Connect to actual API route
    
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      setServices(services.filter(s => s.id !== id));
      // TODO: Connect to actual API route
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink">Mes Services & Packages</h1>
          <p className="text-ink/60 mt-1">Créez et gérez les offres que vous proposez à vos clients.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" /> Ajouter un Service
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input 
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/10 bg-sand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 rounded-xl border border-ink/10 text-ink/70 font-medium hover:bg-sand/50 transition-colors">
              Catégories
            </button>
          </div>
        </div>

        {/* List */}
        {filteredServices.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-ink/30" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-ink mb-2">Aucun service trouvé</h3>
            <p className="text-ink/60 max-w-md">
              {search ? "Modifiez votre recherche pour trouver ce que vous cherchez." : "Commencez par ajouter votre premier service ou package pour que les clients sachent ce que vous proposez."}
            </p>
            {!search && (
              <button onClick={openAddModal} className="mt-6 text-primary font-semibold hover:underline">
                Créer mon premier service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredServices.map(service => (
              <div key={service.id} className="group border border-ink/10 rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all bg-white relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    {service.category && (
                      <span className="inline-block px-2.5 py-1 rounded-md bg-ink/5 text-ink/60 text-xs font-bold uppercase tracking-wider mb-2">
                        {service.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-ink">{service.name}</h3>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(service)} className="p-2 text-ink/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="p-2 text-ink/50 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-ink/60 text-sm mb-4 line-clamp-2">
                  {service.description || "Aucune description renseignée."}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-ink/5 text-sm">
                  {service.startingPrice && (
                    <div className="flex items-center gap-1.5 font-medium text-ink">
                      <DollarSign className="w-4 h-4 text-ink/40" />
                      À partir de <strong className="text-accent-600 ml-1">{service.startingPrice} FCFA</strong>
                    </div>
                  )}
                  {/* Durée estimée pourrait être ajoutée ici */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Basic Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-ink/10">
              <h2 className="text-xl font-heading font-bold text-ink">
                {editingId ? "Modifier le service" : "Nouveau service"}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Nom du service / Package *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="Ex: Animation DJ Soirée Privée"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Catégorie</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="Ex: Mariage, Corporate, Mixage..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Prix "À partir de" (FCFA)</label>
                <input 
                  type="number" 
                  value={startingPrice}
                  onChange={e => setStartingPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="Ex: 150000"
                />
                <p className="text-xs text-ink/50 flex items-center gap-1 mt-1.5">
                  <Info className="w-3.5 h-3.5" /> Laissez vide si vous préférez faire des devis 100% sur mesure.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" 
                  placeholder="Détaillez ce qui est inclus dans cette prestation..."
                />
              </div>
            </form>
            
            <div className="px-6 py-4 bg-sand/30 border-t border-ink/10 flex justify-end gap-3 mt-auto">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-ink/70 hover:bg-ink/5 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
