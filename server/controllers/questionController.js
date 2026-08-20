import prisma from '../config/db.js';
import * as XLSX from 'xlsx';

const normalizeOptions = (options) => {
  if (!options) return null;
  if (typeof options === 'string') return options;
  if (Array.isArray(options)) return JSON.stringify(options.filter(Boolean));
  return JSON.stringify(options);
};

const parseOptions = (question) => {
  if (!question) return question;
  if (question.options && typeof question.options === 'string') {
    try { question.options = JSON.parse(question.options); } catch {}
  }
  return question;
};

export const createQuestion = async (req, res, next) => {
  try {
    const { subjectId, topicId, classLevel, questionText, questionType, options, correctAnswer, explanation, marks, difficulty, videoUrl } = req.body;

    const question = await prisma.question.create({
      data: {
        subjectId,
        topicId: topicId || null,
        classLevel: classLevel || null,
        questionText,
        questionType: questionType || 'MCQ',
        options: normalizeOptions(options),
        correctAnswer,
        explanation,
        videoUrl,
        marks: marks || 1,
        difficulty: difficulty || 'MEDIUM',
        createdBy: req.user.id,
      },
    });

    res.status(201).json({ success: true, data: parseOptions(question) });
  } catch (error) {
    next(error);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const { subjectId, topicId, classLevel, difficulty, questionType, page = 1, limit = 20 } = req.query;

    const where = {};
    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.topicId = topicId;
    if (classLevel) where.classLevel = classLevel;
    if (difficulty) where.difficulty = difficulty;
    if (questionType) where.questionType = questionType;

    if (req.user.role === 'TEACHER') {
      where.createdBy = req.user.id;
    }

    const skip = (page - 1) * limit;
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: { subject: true, topic: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.question.count({ where }),
    ]);

    res.json({
      success: true,
      data: questions.map(parseOptions),
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

export const getQuestion = async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
      include: { subject: true, topic: true },
    });

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    res.json({ success: true, data: parseOptions(question) });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    if (req.user.role === 'TEACHER' && question.createdBy !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this question');
    }

    const updateData = { ...req.body };
    if (updateData.options) {
      updateData.options = normalizeOptions(updateData.options);
    }

    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ success: true, data: parseOptions(updated) });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    if (req.user.role === 'TEACHER' && question.createdBy !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this question');
    }

    await prisma.question.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
};

export const importQuestions = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an Excel file');
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const subject = await prisma.subject.findFirst();

    const questions = data.map((row) => {
      let rawOptions = row.options || row.Options || null;
      if (typeof rawOptions === 'string') {
        try { rawOptions = JSON.parse(rawOptions); } catch {}
      }
      return {
        subjectId: row.subjectId || subject?.id || '',
        questionText: row.question || row.questionText || row.Question,
        questionType: row.type || row.questionType || row.QuestionType || 'MCQ',
        options: normalizeOptions(rawOptions),
        correctAnswer: row.answer || row.correctAnswer || row.CorrectAnswer || row.Answer || '',
        explanation: row.explanation || row.Explanation || null,
        marks: parseInt(row.marks || row.Marks || 1),
        difficulty: (row.difficulty || row.Difficulty || 'MEDIUM').toUpperCase(),
        createdBy: req.user.id,
      };
    });

    const created = await prisma.question.createMany({ data: questions });

    res.status(201).json({
      success: true,
      message: `${created.count} questions imported successfully`,
      count: created.count,
    });
  } catch (error) {
    next(error);
  }
};
