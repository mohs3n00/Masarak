import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with default settings...');

  // 1. Platform Settings
  await prisma.platformSetting.upsert({
    where: { key: 'SITE_NAME' },
    update: {},
    create: {
      key: 'SITE_NAME',
      value: 'Masarak',
      description: 'The name of the platform',
    },
  });

  await prisma.platformSetting.upsert({
    where: { key: 'PRIMARY_COLOR' },
    update: {},
    create: {
      key: 'PRIMARY_COLOR',
      value: '#00A86B',
      description: 'The primary brand color',
    },
  });

  // 2. Homepage Config
  await prisma.homepageConfig.upsert({
    where: { section: 'HERO' },
    update: {},
    create: {
      section: 'HERO',
      title: 'ابدأ رحلتك التعليمية مع مسارك',
      subtitle: 'منصة تعليمية حديثة تساعدك على التعلم بسهولة.',
      description: 'كل ما يحتاجه طالب الثانوية العامة في مكان واحد. فيديوهات شرح، مراجعات، امتحانات، وواجبات لضمان التفوق.',
      buttonText: 'ابدأ الآن',
      buttonLink: '/courses',
      isActive: true,
    },
  });

  await prisma.homepageConfig.upsert({
    where: { section: 'FEATURED_COURSES' },
    update: {},
    create: {
      section: 'FEATURED_COURSES',
      title: 'الكورسات المميزة',
      subtitle: 'أفضل الكورسات اللي هتساعدك تقفل المادة',
      isActive: true,
    },
  });

  // 3. Footer Config
  const footerLinks = [
    { platform: 'FACEBOOK', value: 'https://facebook.com/masarak' },
    { platform: 'WHATSAPP', value: '+201234567890' },
    { platform: 'EMAIL', value: 'support@masarak.com' },
    { platform: 'ADDRESS', value: 'القاهرة، مصر' },
  ];

  for (const link of footerLinks) {
    await prisma.footerConfig.upsert({
      where: { platform: link.platform },
      update: {},
      create: {
        platform: link.platform,
        value: link.value,
        isActive: true,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
