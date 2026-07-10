import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixNames() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const fullName = [user.firstName, user.middleName, user.lastName, user.familyName].filter(Boolean).join(' ');
    if (user.name !== fullName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: fullName }
      });
      console.log('Updated user:', fullName);
    }
  }
  console.log('Done fixing names');
}

fixNames().catch(console.error).finally(() => prisma.$disconnect());
