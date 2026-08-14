import prisma from '../config/db.js';

export const generateCertificate = async (req, res, next) => {
  try {
    const { resultId } = req.body;

    const result = await prisma.result.findUnique({
      where: { id: resultId },
      include: {
        exam: true,
        student: true,
      },
    });

    if (!result) {
      res.status(404);
      throw new Error('Result not found');
    }

    const existing = await prisma.certificate.findUnique({ where: { resultId } });
    if (existing) {
      return res.json({ success: true, data: existing, message: 'Certificate already exists' });
    }

    const certificate = await prisma.certificate.create({
      data: {
        resultId,
        studentName: `${result.student.firstName} ${result.student.lastName}`,
        examTitle: result.exam.title,
        score: result.obtainedMarks,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        grade: result.grade || 'F',
      },
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (req, res, next) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: req.params.id },
      include: {
        result: {
          include: {
            exam: { include: { subject: true } },
            student: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!certificate) {
      res.status(404);
      throw new Error('Certificate not found');
    }

    res.json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
};

export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { result: { studentId: req.user.id } },
      include: {
        result: {
          include: { exam: { include: { subject: true } } },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    res.json({ success: true, data: certificates });
  } catch (error) {
    next(error);
  }
};
