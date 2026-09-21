import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Demande de lien magique : limitée par IP et par adresse email (anti-spam d'emails).
  if (req.nextUrl.pathname === "/api/auth/signin/email" && req.method === "POST") {
    let email = "";
    try {
      email = String((await req.clone().formData()).get("email") ?? "").trim().toLowerCase();
    } catch {
      // corps illisible : on limite seulement par IP
    }
    const allowed =
      (await rateLimit(`magic-ip:${clientIp(req.headers)}`, 10, 600)) &&
      (!email || (await rateLimit(`magic-email:${email}`, 3, 600)));
    if (!allowed) {
      // Format attendu par le client NextAuth : un JSON avec l'url de redirection.
      return NextResponse.json(
        { url: `${req.nextUrl.origin}/login?error=TooManyRequests` },
        { status: 429 }
      );
    }
    return NextResponse.next();
  }

  return authMiddleware(req as NextRequestWithAuth, event);
}

export const config = {
  matcher: ["/onboarding/:path*", "/api/auth/signin/email"],
};
