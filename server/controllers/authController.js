import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import generateToken from '../utils/generateToken.js';
import { logAction } from './auditController.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, gender, phone, school, studentId, class: className, department, employeeId } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'STUDENT',
        gender,
        phone,
        studentProfile: role === 'STUDENT' ? {
          create: { school, studentId, class: className }
        } : undefined,
        teacherProfile: role === 'TEACHER' ? {
          create: { school, department, employeeId }
        } : undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        studentProfile: true,
        teacherProfile: true,
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      res.status(401);
      throw new Error('Account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user);

    const { password: _, ...userData } = user;

    logAction(user.id, 'LOGIN', `User ${user.email} logged in as ${user.role}`, req);

    res.json({
      success: true,
      data: { user: userData, token },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        gender: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        studentProfile: true,
        teacherProfile: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, gender, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName, gender, phone, avatar },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        gender: true,
        phone: true,
        avatar: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
