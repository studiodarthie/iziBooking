import type { Prisma } from "@prisma/client";

export type DashboardUser = Prisma.UserGetPayload<{
  include: {
    providerProfile: {
      include: {
        services: true;
        bookings: true;
      };
    };
    bookings: {
      include: {
        providerProfile: {
          include: {
            user: { select: { image: true } };
          };
        };
      };
    };
  };
}>;
