import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
    // Présent uniquement pendant une session "Visualiser l'interface" déclenchée par un admin
    // (src/app/admin/users/actions.ts) : id de l'admin derrière le compte actuellement affiché.
    impersonatedBy?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    impersonatedBy?: string;
  }
}
