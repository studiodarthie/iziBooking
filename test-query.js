const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const profile = await prisma.providerProfile.findUnique({
      where: { id: 'cmtlk7wuh0001vg1fxk505w7x' },
      include: {
        user: { select: { image: true, name: true } },
        mediaLinks: { orderBy: { createdAt: "desc" } },
        blockedDates: {
          select: { date: true, id: true },
          where: { date: { gte: new Date() } }
        }
      }
    });
    console.log("Success");
  } catch (e) {
    console.error(e.message);
  }
}
main().finally(() => prisma.$disconnect());
