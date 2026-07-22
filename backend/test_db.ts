import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- TEACHERS ---');
  const users = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    include: { teacherProfile: true },
  });
  console.log(JSON.stringify(users, null, 2));

  console.log('\n--- COURSE INSTRUCTORS ---');
  const instructors = await prisma.courseInstructor.findMany({
    include: { course: true },
  });
  console.log(JSON.stringify(instructors, null, 2));

  console.log('\n--- COURSES ---');
  const courses = await prisma.course.findMany();
  console.log(JSON.stringify(courses, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
