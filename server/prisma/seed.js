import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@acetest.com' },
    update: {},
    create: {
      email: 'teacher@acetest.com',
      password: hashedPassword,
      role: 'TEACHER',
      firstName: 'John',
      lastName: 'Doe',
      teacherProfile: {
        create: {
          school: 'AceTest High School',
          department: 'Science',
        },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@acetest.com' },
    update: {},
    create: {
      email: 'student@acetest.com',
      password: hashedPassword,
      role: 'STUDENT',
      firstName: 'Jane',
      lastName: 'Smith',
      studentProfile: {
        create: {
          school: 'AceTest High School',
          studentId: 'STU001',
          class: 'SS3',
        },
      },
    },
  });

  const math = await prisma.subject.upsert({
    where: { name: 'Mathematics' },
    update: {},
    create: { name: 'Mathematics', code: 'MATH101', description: 'General Mathematics' },
  });

  const english = await prisma.subject.upsert({
    where: { name: 'English' },
    update: {},
    create: { name: 'English', code: 'ENG101', description: 'English Language' },
  });

  const physics = await prisma.subject.upsert({
    where: { name: 'Physics' },
    update: {},
    create: { name: 'Physics', code: 'PHY101', description: 'General Physics' },
  });

  const badges = [
    { name: 'First Exam', description: 'Completed your first exam', icon: '🎯', criteria: 'FIRST_EXAM' },
    { name: 'Perfect Score', description: 'Scored 100% on an exam', icon: '💯', criteria: 'PERFECT_SCORE' },
    { name: 'Quiz Master', description: 'Completed 5 exams', icon: '📚', criteria: 'FIVE_EXAMS' },
    { name: 'Exam Veteran', description: 'Completed 10 exams', icon: '🎓', criteria: 'TEN_EXAMS' },
    { name: '7-Day Streak', description: 'Maintained a 7-day streak', icon: '🔥', criteria: 'STREAK_7' },
    { name: 'Monthly Warrior', description: 'Maintained a 30-day streak', icon: '💪', criteria: 'STREAK_30' },
    { name: 'Century Club', description: 'Earned 100 points', icon: '⭐', criteria: 'POINTS_100' },
    { name: 'Point Legend', description: 'Earned 500 points', icon: '🏆', criteria: 'POINTS_500' },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  console.log('Seed data created successfully');
  console.log({ teacher: teacher.email, student: student.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
