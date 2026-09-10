"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { DiscountType } from "@prisma/client";

export async function createCoupon(data: {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    return { success: false, error: "Profil non autorisé." };
  }

  const code = data.code.trim().toUpperCase();
  if (!code) {
    return { success: false, error: "Le code est obligatoire." };
  }
  if (data.discountValue <= 0) {
    return { success: false, error: "La valeur de la remise doit être positive." };
  }
  if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
    return { success: false, error: "Un pourcentage ne peut pas dépasser 100." };
  }

  try {
    await prisma.coupon.create({
      data: {
        providerProfileId: user.providerProfile.id,
        code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        usageLimit: data.usageLimit,
      }
    });

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { success: false, error: "Vous utilisez déjà ce code pour un autre coupon." };
    }
    console.error("Error creating coupon:", error);
    return { success: false, error: "Erreur lors de la création du coupon." };
  }
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    return { success: false, error: "Profil non autorisé." };
  }

  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon || coupon.providerProfileId !== user.providerProfile.id) {
      return { success: false, error: "Coupon non trouvé ou non autorisé." };
    }

    await prisma.coupon.update({
      where: { id },
      data: { isActive }
    });

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error toggling coupon:", error);
    return { success: false, error: "Erreur lors de la mise à jour du coupon." };
  }
}

export async function deleteCoupon(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    return { success: false, error: "Profil non autorisé." };
  }

  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon || coupon.providerProfileId !== user.providerProfile.id) {
      return { success: false, error: "Coupon non trouvé ou non autorisé." };
    }

    await prisma.coupon.delete({ where: { id } });

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return { success: false, error: "Erreur lors de la suppression du coupon." };
  }
}
