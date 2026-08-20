import prisma from '../config/db.js';
import { logAction } from './auditController.js';
import { awardPoints, checkBadges } from './gamificationController.js';

const parseQuestionOptions = (questions) => {
  return questions.map((q) => {
    if (q.options && typeof q.options === 'string') {
      try { q.options = JSON.parse(q.options); } catch {}
    }
    return q;
  });
};

export const createExam = async (req, res, next) => {
  try {
    const { title, description, subjectId, topicId, classLevel, duration, totalMarks, passMark, instructions, shuffleQuestions, showResult, maxAttempts, scheduledAt, startsAt, endsAt } = req.body;

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        subjectId,
        topicId: topicId || null,
        classLevel: classLevel || null,
        duration: parseInt(duration),
        totalMarks: totalMarks ? parseInt(totalMarks) : null,
        passMark: parseInt(passMark || 40),
        instructions,
        shuffleQuestions: shuffleQuestions || false,
        showResult: showResult !== false,
        maxAttempts: parseInt(maxAttempts || 1),
        createdBy: req.user.id,
        status: 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

export const getExams = async (req, res, next) => {
  try {
    const { status, subjectId, classLevel, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) where.status = status;
    if (subjectId) where.subjectId = subjectId;
    if (classLevel) where.classLevel = classLevel;

    if (req.user.role === 'TEACHER') {
      where.createdBy = req.user.id;
    }

    const skip = (page - 1) * limit;
    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          subject: true,
          topic: true,
          creator: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { questions: true, submissions: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.exam.count({ where }),
    ]);

    res.json({
      success: true,
      data: exams,
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

export const getExam = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: {
        subject: true,
        creator: { select: { id: true, firstName: true, lastName: true } },
        questions: {
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            marks: true,
            difficulty: true,
          },
        },
        _count: { select: { submissions: true, results: true } },
      },
    });

    if (!exam) {
      res.status(404);
      throw new Error('Exam not found');
    }

    if (exam.questions) {
      exam.questions = parseQuestionOptions(exam.questions);
    }
    res.json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });

    if (!exam) {
      res.status(404);
      throw new Error('Exam not found');
    }

    if (req.user.role === 'TEACHER' && exam.createdBy !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized');
    }

    const updated = await prisma.exam.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });

    if (!exam) {
      res.status(404);
      throw new Error('Exam not found');
    }

    if (req.user.role === 'TEACHER' && exam.createdBy !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized');
    }

    await prisma.exam.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    next(error);
  }
};

export const publishExam = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { questions: true } } },
    });

    if (!exam) {
      res.status(404);
      throw new Error('Exam not found');
    }

    if (exam._count.questions === 0) {
      res.status(400);
      throw new Error('Cannot publish exam with no questions');
    }

    const updated = await prisma.exam.update({
      where: { id: req.params.id },
      data: { status: 'PUBLISHED' },
    });

    res.json({ success: true, data: updated, message: 'Exam published' });
  } catch (error) {
    next(error);
  }
};

export const scheduleExam = async (req, res, next) => {
  try {
    const { scheduledAt, startsAt, endsAt } = req.body;

    const updated = await prisma.exam.update({
      where: { id: req.params.id },
      data: {
        status: 'SCHEDULED',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        startsAt: startsAt ? new Date(startsAt) : undefined,
        endsAt: endsAt ? new Date(endsAt) : undefined,
      },
    });

    res.json({ success: true, data: updated, message: 'Exam scheduled' });
  } catch (error) {
    next(error);
  }
};

export const addQuestionsToExam = async (req, res, next) => {
  try {
    const { questionIds } = req.body;

    await prisma.question.updateMany({
      where: { id: { in: questionIds } },
      data: { examId: req.params.id },
    });

    res.json({ success: true, message: `${questionIds.length} questions added` });
  } catch (error) {
    next(error);
  }
};

export const getAvailableExams = async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        status: { in: ['PUBLISHED', 'SCHEDULED'] },
      },
      include: {
        subject: true,
        _count: { select: { questions: true } },
      },
    });

    res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
};

export const startExam = async (req, res, next) => {
  try {
    const examId = req.params.id;
    const studentId = req.user.id;

    const existing = await prisma.submission.findUnique({
      where: { examId_studentId: { examId, studentId } },
    });

    if (existing && existing.status === 'COMPLETED') {
      res.status(400);
      throw new Error('You have already completed this exam');
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true },
    });

    if (!exam) {
      res.status(404);
      throw new Error('Exam not found');
    }

    if (exam.status !== 'PUBLISHED' && exam.status !== 'SCHEDULED') {
      res.status(400);
      throw new Error('Exam is not available');
    }

    let questions = parseQuestionOptions(exam.questions);
    if (exam.shuffleQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    if (existing && existing.status === 'IN_PROGRESS') {
      return res.json({
        success: true,
        data: {
          submission: existing,
          exam: { ...exam, questions },
        },
      });
    }

    const submission = await prisma.submission.create({
      data: {
        examId,
        studentId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    logAction(req.user.id, 'EXAM_START', `Started exam: ${exam.title} (${examId})`, req);

    res.json({
      success: true,
      data: {
        submission,
        exam: { ...exam, questions },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitExam = async (req, res, next) => {
  try {
    const examId = req.params.id;
    const studentId = req.user.id;
    const { answers, timeSpent } = req.body;

    const submission = await prisma.submission.findUnique({
      where: { examId_studentId: { examId, studentId } },
      include: { exam: { include: { questions: true } } },
    });

    if (!submission || submission.status === 'COMPLETED') {
      res.status(400);
      throw new Error('Cannot submit this exam');
    }

    let totalMarks = 0;
    let obtainedMarks = 0;

    for (const answer of answers) {
      const question = submission.exam.questions.find(
        (q) => q.id === answer.questionId
      );

      if (!question) continue;

      totalMarks += question.marks;
      const isCorrect =
        question.questionType === 'MCQ' || question.questionType === 'TRUE_FALSE'
          ? question.correctAnswer === answer.selectedAnswer
          : null;

      const marksObtained = isCorrect ? question.marks : 0;
      if (isCorrect) obtainedMarks += marksObtained;

      await prisma.answer.create({
        data: {
          submissionId: submission.id,
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          marksObtained,
        },
      });
    }

    const finalTotalMarks = submission.exam.totalMarks || totalMarks;

    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: 'COMPLETED',
        submittedAt: new Date(),
        timeSpent: timeSpent || 0,
      },
    });

    const percentage = finalTotalMarks > 0
      ? (obtainedMarks / finalTotalMarks) * 100
      : 0;
    const passed = percentage >= submission.exam.passMark;

    let grade = 'F';
    if (percentage >= 70) grade = 'A';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';

    const result = await prisma.result.create({
      data: {
        examId,
        studentId,
        submissionId: submission.id,
        totalMarks: finalTotalMarks,
        obtainedMarks,
        percentage,
        grade,
        passed,
      },
    });

    const earnedPoints = Math.round(obtainedMarks * 10);
    await awardPoints(studentId, earnedPoints);
    const newBadges = await checkBadges(studentId);

    logAction(req.user.id, 'EXAM_SUBMIT', `Submitted exam: ${submission.exam.title} - Score: ${obtainedMarks}/${finalTotalMarks}`, req);

    res.json({
      success: true,
      data: { ...result, pointsEarned: earnedPoints, newBadges },
      message: passed ? 'Congratulations! You passed!' : 'You did not pass. Try again!',
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentUpcomingExams = async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        status: 'PUBLISHED',
        startsAt: { gte: new Date() },
      },
      include: {
        subject: true,
        _count: { select: { questions: true } },
      },
      orderBy: { startsAt: 'asc' },
    });

    res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
};
