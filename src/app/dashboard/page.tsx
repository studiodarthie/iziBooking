import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { OrganizerDashboard } from "@/components/dashboard/organizer/OrganizerDashboard";
import { ProviderDashboard } from "@/components/dashboard/provider/ProviderDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      providerProfile: {
        include: {
          services: true,
          bookings: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      },
      bookings: {
        include: {
          providerProfile: {
            include: {
              user: { select: { image: true } }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!user) redirect("/login");

  if (user.role === "PROVIDER") {
    return <ProviderDashboard user={user} />;
  }

  return <OrganizerDashboard user={user} />;
}
