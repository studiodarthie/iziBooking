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
              <a href="mailto:contact@izibooking.africa" className="text-sm text-neutral-300 hover:text-accent transition-colors">
                contact@izibooking.africa
              </a>
            </div>
          </div>

          <div className="flex-1">
            <h6 className="text-neutral-400 font-semibold mb-5 text-sm uppercase tracking-wider">À propos</h6>
            <div className="flex flex-col gap-3">
              <Link href="/search" className="text-sm text-neutral-300 hover:text-accent transition-colors">Trouver un prestataire</Link>
              <Link href="/onboarding" className="text-sm text-neutral-300 hover:text-accent transition-colors">Devenir prestataire</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-neutral-800 text-xs text-neutral-500 gap-4">
          <span>© {new Date().getFullYear()} iziBooking. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}
