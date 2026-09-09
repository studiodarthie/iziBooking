import Link from "next/link";


export function HomeFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24">
          <div className="flex-[1.4]">
            <div className="text-white font-heading font-bold text-2xl mb-4 tracking-tight">iziBooking</div>
            <p className="text-sm max-w-[32ch] leading-relaxed">
              La scène africaine, réservable en un clic. Le pont entre les talents et les événements inoubliables.
            </p>
            <div className="mt-8">
              <label className="text-xs font-medium text-neutral-400 block mb-2 uppercase tracking-wider">
                Newsletter
              </label>
              <form className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 flex-1 focus:outline-none focus:border-accent text-sm"
                  required
                />
                <button type="submit" className="bg-primary hover:bg-accent-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
                  S'inscrire
                </button>
              </form>
            </div>
          </div>
          
          <div className="flex-1">
            <h6 className="text-neutral-400 font-semibold mb-5 text-sm uppercase tracking-wider">À propos</h6>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-sm text-neutral-300 hover:text-accent transition-colors">Comment ça marche</Link>
              <Link href="/onboarding" className="text-sm text-neutral-300 hover:text-accent transition-colors">Devenir prestataire</Link>
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">Carrières</Link>
            </div>
          </div>
          
          <div className="flex-1">
            <h6 className="text-neutral-400 font-semibold mb-5 text-sm uppercase tracking-wider">Support</h6>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">Centre d'aide</Link>
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">Sécurité & confiance</Link>
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">Contact</Link>
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">FAQ</Link>
            </div>
          </div>
          
          <div className="flex-1">
            <h6 className="text-neutral-400 font-semibold mb-5 text-sm uppercase tracking-wider">Légal</h6>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">Conditions générales</Link>
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">Politique de confidentialité</Link>
              <Link href="#" className="text-sm text-neutral-300 hover:text-accent transition-colors">Mentions légales</Link>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-neutral-800 text-xs text-neutral-500 gap-4">
          <span>© {new Date().getFullYear()} iziBooking. Tous droits réservés.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            <a href="#" className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
            <a href="#" className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
            <a href="#" className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
