import prisma from '../config/db.js';

export const getResults = async (req, res, next) => {
  try {
    const { examId, page = 1, limit = 20 } = req.query;
    const where = {};

    if (examId) where.examId = examId;

    if (req.user.role === 'STUDENT') {
      where.studentId = req.user.id;
    } else if (req.user.role === 'TEACHER') {
      const exams = await prisma.exam.findMany({
        where: { createdBy: req.user.id },
        select: { id: true },
      });
      where.examId = { in: exams.map((e) => e.id) };
    }

    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          exam: { include: { subject: true } },
          student: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.result.count({ where }),
    ]);

    res.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getResult = async (req, res, next) => {
  try {
    const result = await prisma.result.findUnique({
      where: { id: req.params.id },
      include: {
        exam: {
          include: { subject: true, questions: true },
        },
        submission: {
          include: {
            answers: { include: { question: true } },
          },
        },
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!result) {
      res.status(404);
      throw new Error('Result not found');
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const [totalResults, completedExams, upcomingExams, avgResult, recentResults] =
      await Promise.all([
        prisma.result.count({ where: { studentId } }),
        prisma.submission.count({
          where: { studentId, status: 'COMPLETED' },
        }),
        prisma.exam.count({
          where: {
            status: 'PUBLISHED',
            startsAt: { gte: new Date() },
          },
        }),
        prisma.result.aggregate({
          where: { studentId },
          _avg: { percentage: true },
        }),
        prisma.result.findMany({
          where: { studentId },
          include: {
            exam: { include: { subject: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalExams: totalResults,
        completedExams,
        upcomingExams,
        averageScore: Math.round(avgResult._avg.percentage || 0),
        recentResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const [totalExams, totalStudents, results] = await Promise.all([
      prisma.exam.count({ where: { createdBy: teacherId } }),
      prisma.submission.findMany({
        where: {
          exam: { createdBy: teacherId },
          status: 'COMPLETED',
        },
        select: { studentId: true },
        distinct: ['studentId'],
      }),
      prisma.result.findMany({
        where: { exam: { createdBy: teacherId } },
        select: { passed: true },
      }),
    ]);

    const passRate = results.length > 0
      ? Math.round((results.filter((r) => r.passed).length / results.length) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        totalExams,
        totalStudents: totalStudents.length,
        averagePassRate: passRate,
        totalResults: results.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalStudents, totalTeachers, totalAdmins, totalExams, totalSchools] =
      await Promise.all([
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'TEACHER' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.exam.count(),
        prisma.school.count(),
      ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalExams,
        totalSchools,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportResults = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const results = await prisma.result.findMany({
      where: { examId },
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
        exam: true,
      },
      orderBy: { percentage: 'desc' },
    });

    const format = req.query.format || 'json';

    if (format === 'csv') {
      const header = 'Name,Email,Score,Total,Percentage,Grade,Passed\n';
      const rows = results
        .map(
          (r) =>
            `${r.student.firstName} ${r.student.lastName},${r.student.email},${r.obtainedMarks},${r.totalMarks},${r.percentage.toFixed(1)}%,${r.grade},${r.passed ? 'Yes' : 'No'}`
        )
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=results-${examId}.csv`
      );
      return res.send(header + rows);
    }

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
