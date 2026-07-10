const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.platformBranding.findMany().then(r => console.dir(r)).finally(() => prisma.$disconnect());
