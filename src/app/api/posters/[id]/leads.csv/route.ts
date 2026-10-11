import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Non autorisé", { status: 401 });

  const campaign = await prisma.posterCampaign.findUnique({
    where: { id },
    include: { leads: { orderBy: { createdAt: "desc" } } },
  });

  if (!campaign || campaign.userId !== session.user.id) {
    return new NextResponse("Introuvable", { status: 404 });
  }

  const header = ["Prénom", "Nom", "Téléphone", "WhatsApp", "Email", "Date"];
  const rows = campaign.leads.map((l) => [
    l.firstName,
    l.lastName,
    l.phone,
    l.isWhatsapp ? "Oui" : "Non",
    l.email ?? "",
    l.createdAt.toISOString().slice(0, 10),
  ]);

  const csv = [header, ...rows].map((row) => row.map((v) => csvEscape(String(v))).join(",")).join("\n");
  const filename = `contacts-${campaign.slug}.csv`;

  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
