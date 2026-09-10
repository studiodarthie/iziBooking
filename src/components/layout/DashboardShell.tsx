"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar, type NavbarUser } from "@/components/layout/Navbar";

export function DashboardShell({
  role,
  user,
  children,
}: {
  role: string;
  user: NavbarUser;
  children: React.ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-sand/30 text-ink font-sans overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar role={role} />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative flex w-72 max-w-[80vw]">
            <Sidebar role={role} />
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute top-5 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-72 w-full h-full">
        <Navbar user={user} onMenuClick={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex-1">
              {children}
            </div>

            {/* Petit Footer Discret pour le Dashboard */}
            <footer className="mt-12 pt-6 border-t border-ink/10 text-center text-xs text-ink/40 font-medium">
              <p>&copy; {new Date().getFullYear()} iziBooking. Tous droits réservés.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
