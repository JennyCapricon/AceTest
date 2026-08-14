#!/usr/bin/env node
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { role: { not: 'ADMIN' } },
    data: { mustResetPassword: true },
  });

  const byRole = await prisma.user.groupBy({
    by: ['role'],
    where: { role: { not: 'ADMIN' } },
    _count: { _all: true },
  });

  console.log(`Flagged ${result.count} non-admin user(s) for password reset.`);
  for (const group of byRole) {
    console.log(`  - ${group.role}: ${group._count._all}`);
  }
  console.log('ADMIN accounts were left unchanged.');
}

main()
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });