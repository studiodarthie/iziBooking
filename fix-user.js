const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: "darthie.pro@gmail.com" } });
  
  if (user) {
    // 1. Changer le rôle
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "PROVIDER" }
    });

    // 2. Créer un profil prestataire
    await prisma.providerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        pole: "DIVERTISSEMENT",
        name: user.name || "Test Prestataire",
        category: "Test",
        specialty: "Test",
        location: "Test",
        basePrice: 100
      },
      update: {}
    });
    
    console.log("Utilisateur transformé en Prestataire avec succès !");
  }
}
main().finally(() => prisma.$disconnect());
