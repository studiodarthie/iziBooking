import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const magistral = localFont({
  variable: "--font-magistral",
  src: [
    { path: "../fonts/magistral-condensed-light.otf", weight: "300", style: "normal" },
    { path: "../fonts/magistral-condensed-bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/magistral-condensed-extrabold.otf", weight: "800", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "iziBooking - La scène africaine, réservable en un clic",
  description: "Plateforme de réservation d'artistes et de prestataires événementiels, pensée pour l'Afrique.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${magistral.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
