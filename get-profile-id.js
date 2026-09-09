const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ 
    where: { email: "darthie.pro@gmail.com" },
    include: { providerProfile: true }
  });
  
  if (user && user.providerProfile) {
    console.log("PROFILE_ID=" + user.providerProfile.id);
  } else {
    console.log("No profile found.");
  }
}
main().finally(() => prisma.$disconnect());
