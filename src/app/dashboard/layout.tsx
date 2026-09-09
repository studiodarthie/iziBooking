import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Vérifier l'utilisateur en base
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  // Si l'utilisateur n'a pas encore de profil prestataire et n'est pas un organisateur
  // Mais ici, nous voulons que le dashboard se rende avec le rôle du user (user.role)
  // Onboarding est géré lors de la création du compte via next-auth "newUser"

  return (
    <div className="flex h-screen bg-sand/30 text-ink font-sans overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar role={user.role} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-72 w-full h-full">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex-1">
              {children}
            </div>
            
            {/* Petit Footer Discret pour le Dashboard */}
            <footer className="mt-12 pt-6 border-t border-ink/10 flex flex-col md:flex-row items-center justify-between text-xs text-ink/40 font-medium">
              <p>&copy; {new Date().getFullYear()} iziBooking. Tous droits réservés.</p>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <a href="#" className="hover:text-ink/70 transition-colors">Support</a>
                <a href="#" className="hover:text-ink/70 transition-colors">Termes</a>
                <a href="#" className="hover:text-ink/70 transition-colors">Confidentialité</a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
