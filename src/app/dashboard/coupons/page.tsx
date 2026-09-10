import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CouponListClient } from "@/components/dashboard/CouponForm";
import { Tag } from "lucide-react";

export default async function CouponsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: { include: { coupons: { orderBy: { createdAt: 'desc' } } } } }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    redirect("/dashboard");
  }

  const coupons = user.providerProfile.coupons;

  return (
    <div className="flex flex-col h-full space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Tag className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-ink">Codes promo</h1>
          </div>
          <p className="mt-2 text-ink/60">
            Créez des codes de réduction que les organisateurs peuvent appliquer au moment de leur demande.
          </p>
        </div>
      </div>

      <CouponListClient initialCoupons={coupons} />
    </div>
  );
}
