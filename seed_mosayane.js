const fs = require('fs');
let env = '';
if (fs.existsSync('.env')) env = fs.readFileSync('.env', 'utf8');
else if (fs.existsSync('.env.local')) env = fs.readFileSync('.env.local', 'utf8');

const dbUrl = env.split('\n').find(l => l.startsWith('DATABASE_URL')).split('=')[1].replace(/['"]/g, '');
process.env.DATABASE_URL = dbUrl;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst({ where: { email: 'mosayane@example.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Delphine MEBONDE',
        email: 'mosayane@example.com',
        image: 'https://musicinafrica.net/wp-content/uploads/2024/07/img-20221214-wa0042.jpg',
      }
    });
  }

  const profile = await prisma.providerProfile.create({
    data: {
      userId: user.id,
      pole: 'DIVERTISSEMENT',
      name: 'Mosayane 2 Claire',
      category: 'Artiste',
      specialty: 'Afro Fusion',
      bio: "Delphine MEBONDE alias MOSAYANE 2 Claire, est une artiste exigeante et originale du Cameroun, qui a su s’entourer de personnes qui lui permettent de libérer son imaginaire et son énergie. Véritable bête de scène, elle allie une voix puissante à des performances captivantes.",
      location: 'Cameroun',
      basePrice: null,
      currency: 'XAF'
    }
  });

  console.log('Created Mosayane Profile with ID:', profile.id);
}
main().catch(console.error).finally(() => prisma.$disconnect());
