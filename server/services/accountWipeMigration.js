import prisma from '../config/db.js';

const WIPE_KEY = 'account_wipe_completed';

// FK-safe order: children before parents (users last).
const DELETE_ORDER = [
  'answer',
  'certificate',
  'result',
  'submission',
  'studentBadge',
  'studentProfile',
  'teacherProfile',
  'notification',
  'auditLog',
  'announcement',
  'question',
  'exam',
  'user',
];

export async function runAccountWipeMigration() {
  if (process.env.NODE_ENV !== 'production') return;

  try {
    const alreadyDone = await prisma.appMeta.findUnique({ where: { key: WIPE_KEY } });
    if (alreadyDone) {
      console.log('Account wipe already completed - skipping.');
      return;
    }

    const byRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { _all: true },
    });
    const total = byRole.reduce((sum, group) => sum + group._count._all, 0);

    for (const model of DELETE_ORDER) {
      await prisma[model].deleteMany({});
    }

    const summary = byRole.map((group) => `${group.role}=${group._count._all}`).join(', ');

    await prisma.appMeta.upsert({
      where: { key: WIPE_KEY },
      update: { value: JSON.stringify({ usersDeleted: total, completedAt: new Date().toISOString() }) },
      create: { key: WIPE_KEY, value: JSON.stringify({ usersDeleted: total, completedAt: new Date().toISOString() }) },
    });

    console.log(`Account wipe completed: users deleted=${total} (${summary})`);
  } catch (error) {
    console.error(`Account wipe failed: ${error.message}`);
  }
}