import prisma from '../config/db.js';

export const awardPoints = async (userId, points) => {
  try {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return;

    const now = new Date();
    const lastActive = profile.lastActiveAt ? new Date(profile.lastActiveAt) : null;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = profile.streak;
    if (lastActive) {
      const lastDate = lastActive.toDateString();
      const todayDate = now.toDateString();
      const yesterdayDate = yesterday.toDateString();

      if (lastDate === todayDate) {
        // already active today, keep streak
      } else if (lastDate === yesterdayDate) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await prisma.studentProfile.update({
      where: { userId },
      data: {
        points: { increment: points },
        streak: newStreak,
        lastActiveAt: now,
      },
    });
  } catch (error) {
    console.error('Failed to award points:', error);
  }
};

export const checkBadges = async (userId) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { badges: true },
    });
    if (!profile) return;

    const earnedBadgeIds = profile.badges.map((b) => b.badgeId);
    const allBadges = await prisma.badge.findMany();
    const newBadges = [];

    const submissionCount = await prisma.submission.count({ where: { studentId: userId } });
    const results = await prisma.result.findMany({ where: { studentId: userId } });

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      let earn = false;
      if (badge.criteria === 'FIRST_EXAM' && submissionCount >= 1) earn = true;
      else if (badge.criteria === 'PERFECT_SCORE' && results.some((r) => r.percentage === 100)) earn = true;
      else if (badge.criteria === 'FIVE_EXAMS' && submissionCount >= 5) earn = true;
      else if (badge.criteria === 'TEN_EXAMS' && submissionCount >= 10) earn = true;
      else if (badge.criteria === 'STREAK_7' && profile.streak >= 7) earn = true;
      else if (badge.criteria === 'STREAK_30' && profile.streak >= 30) earn = true;
      else if (badge.criteria === 'POINTS_100' && profile.points >= 100) earn = true;
      else if (badge.criteria === 'POINTS_500' && profile.points >= 500) earn = true;

      if (earn) {
        await prisma.studentBadge.create({
          data: { studentId: profile.id, badgeId: badge.id },
        });
        newBadges.push(badge);
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Failed to check badges:', error);
    return [];
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all', limit = 50 } = req.query;

    const leaderboard = await prisma.studentProfile.findMany({
      orderBy: { points: 'desc' },
      take: parseInt(limit),
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        badges: { include: { badge: true } },
      },
    });

    const ranked = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      firstName: entry.user.firstName,
      lastName: entry.user.lastName,
      email: entry.user.email,
      avatar: entry.user.avatar,
      points: entry.points,
      streak: entry.streak,
      badges: entry.badges.map((b) => b.badge),
    }));

    res.json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};

export const getMyGamification = async (req, res, next) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: { badges: { include: { badge: true } } },
    });

    if (!profile) {
      return res.json({ success: true, data: { points: 0, streak: 0, badges: [] } });
    }

    res.json({
      success: true,
      data: {
        points: profile.points,
        streak: profile.streak,
        badges: profile.badges.map((b) => b.badge),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBadges = async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: badges });
  } catch (error) {
    next(error);
  }
};
