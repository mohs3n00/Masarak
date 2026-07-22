import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('No DATABASE_URL in .env');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    include: { user: true }
  });

  if (!teacherProfile) {
    console.log('No teacher found');
    return;
  }

  const user = teacherProfile.user;
  console.log('Found teacher:', user.phone);

  try {
    const loginRes = await axios.post('https://triumphant-grace-production-8963.up.railway.app/api/auth/login', {
      identifier: user.phone,
      password: 'password123',
    });

    const token = loginRes.data.access_token;
    console.log('Got token:', token ? 'YES' : 'NO');

    const coursesRes = await axios.get('https://triumphant-grace-production-8963.up.railway.app/api/teacher/courses', {
      headers: { Authorization: `Bearer \${token}` },
      params: { skip: 0, take: 20 }
    });

    console.log('--- API RESPONSE ---');
    console.log(JSON.stringify(coursesRes.data, null, 2));
    
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
