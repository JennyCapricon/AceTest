import prisma from '../config/db.js';

const MIGRATION_KEY = 'password_reset_migration_completed';

async function ensureMustResetPasswordColumn() {
  const [column] = await prisma.$queryRawUnsafe(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'mustResetPassword'`
  );
  if (!column) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "users" ADD COLUMN "mustResetPassword" BOOLEAN NOT NULL DEFAULT false`
    );
  }
}

function summarize(byRole) {
  let students = 0;
  let teachers = 0;
  let others = 0;
  for (const group of byRole) {
    if (group.role === 'STUDENT') students = group._count._all;
    else if (group.role === 'TEACHER') teachers = group._count._all;
    else others += group._count._all;
  }
  return { students, teachers, others };
}

export async function runPasswordResetMigration() {
  if (process.env.NODE_ENV !== 'production') return;

  try {
    const alreadyDone = await prisma.appMeta.findUnique({ where: { key: MIGRATION_KEY } });
    if (alreadyDone) {
      console.log('Password reset migration already completed - skipping.');
      return;
    }

    if (process.env.POSTGRES_DATABASE_URL) {
      await ensureMustResetPasswordColumn();
    }

    await prisma.user.updateMany({
      where: { role: { not: 'ADMIN' } },
      data: { mustResetPassword: true },
    });

    const byRole = await prisma.user.groupBy({
      by: ['role'],
      where: { role: { not: 'ADMIN' } },
      _count: { _all: true },
    });

    const { students, teachers, others } = summarize(byRole);

    await prisma.appMeta.upsert({
      where: { key: MIGRATION_KEY },
      update: { value: JSON.stringify({ students, teachers, others, completedAt: new Date().toISOString() }) },
      create: { key: MIGRATION_KEY, value: JSON.stringify({ students, teachers, others, completedAt: new Date().toISOString() }) },
    });

    console.log(`Password reset migration completed: STUDENT=${students}, TEACHER=${teachers}, OTHER=${others}`);
  } catch (error) {
    console.error(`Password reset migration failed: ${error.message}`);
  }
}