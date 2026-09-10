import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, BarChart3, LogOut, ShieldCheck, Banknote, UserCog, AlertTriangle } from "lucide-react";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Vérifier l'utilisateur en base et son rôle
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  if (user.isBanned) {
    redirect("/api/auth/signout?callbackUrl=/login?banned=1");
  }

  return (
    <div className="flex h-screen bg-sand/30 text-ink font-sans overflow-hidden">
      {/* Admin Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col bg-ink text-sand">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-heading font-black text-xl tracking-tight text-white">
              iziAdmin
            </span>
          </div>
          <nav className="flex flex-1 flex-col mt-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  <li>
                    <Link
                      href="/admin"
                      className="group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 hover:bg-sand/10 hover:text-white text-sand/80 transition-all"
                    >
                      <BarChart3 className="h-6 w-6 shrink-0" />
                      Vue d’ensemble
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/providers"
                      className="group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 hover:bg-sand/10 hover:text-white text-sand/80 transition-all"
                    >
                      <Users className="h-6 w-6 shrink-0" />
                      Prestataires
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/payouts"
                      className="group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 hover:bg-sand/10 hover:text-white text-sand/80 transition-all"
                    >
                      <Banknote className="h-6 w-6 shrink-0" />
                      Reversements
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/disputes"
                      className="group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 hover:bg-sand/10 hover:text-white text-sand/80 transition-all"
                    >
                      <AlertTriangle className="h-6 w-6 shrink-0" />
                      Litiges
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/users"
                      className="group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 hover:bg-sand/10 hover:text-white text-sand/80 transition-all"
                    >
                      <UserCog className="h-6 w-6 shrink-0" />
                      Utilisateurs
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="/dashboard"
                  className="group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 hover:bg-red-500/10 hover:text-red-400 text-sand/60 transition-all"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Quitter l’Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64 w-full h-full">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-ink/5 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
            <AdminUserMenu name={user.name} email={user.email!} image={user.image} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
