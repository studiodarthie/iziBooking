import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.findUnique({ where: { email: "darthie.pro@gmail.com" } })
  if (user) {
    await prisma.user.update({
      where: { email: "darthie.pro@gmail.com" },
      data: {
        role: "ARTIST",
        artistProfile: {
          create: {
            stageName: "DJ Darthie",
            category: "DJ",
            location: "Paris, France",
            bio: "Test bio",
            basePrice: 100
          }
        }
      }
    })
    console.log("User updated to ARTIST and artist profile created.")
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())
