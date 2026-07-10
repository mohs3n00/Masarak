import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const data = await prisma.platformBranding.findMany();
  console.log("DB DATA:", JSON.stringify(data, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
