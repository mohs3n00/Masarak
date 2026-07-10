
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const section = await prisma.courseSection.findFirst();
  console.log('Testing delete on section:', section?.id);
  if (!section) return;
  try {
    await prisma.courseSection.delete({ where: { id: section.id } });
    console.log('Delete success');
  } catch(e) {
    console.error('Delete failed:', e);
  }
}
run().finally(() => prisma.$disconnect());

