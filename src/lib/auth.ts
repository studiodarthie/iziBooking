import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import prisma from "@/lib/prisma";
import { sendSignInEmail, notifyNewUserSignup } from "@/lib/email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      // Template par défaut de NextAuth trop générique (bouton nu, aucune marque) : certains
      // serveurs mail le bloquent comme contenu suspect. On envoie notre propre email de marque.
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendSignInEmail({ to: identifier, url });
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return true;
      const existing = await prisma.user.findUnique({ where: { email: user.email } });
      if (existing?.isBanned) return false;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Needs to exist on user in DB, Prisma handles it
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  events: {
    // Se déclenche une seule fois, exactement à la création de la ligne User en base
    // (première connexion Google ou premier lien magique) — avant même l'onboarding.
    async createUser({ user }) {
      if (!user.email) return;
      notifyNewUserSignup({ name: user.name ?? null, email: user.email }).catch(() => {});
    },
  },
};
