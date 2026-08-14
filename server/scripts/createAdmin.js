#!/usr/bin/env node
import 'dotenv/config';
import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
  });
}

function prompt(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function promptHidden(query) {
  process.stdout.write(query);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve) => {
    let value = '';
    const onData = (char) => {
      const c = String(char);
      if (c === '\u0003') {
        process.stdout.write('\n');
        process.exit(130);
      }
      if (c === '\n' || c === '\r' || c === '\u0004') {
        process.stdin.removeListener('data', onData);
        process.stdin.setRawMode(false);
        process.stdout.write('\n');
        resolve(value);
      } else if (c === '\u007f' || c === '\b') {
        value = value.slice(0, -1);
        readline.moveCursor(process.stdout, -1, 0);
        process.stdout.write(' ');
        readline.moveCursor(process.stdout, -1, 0);
      } else if (c !== '\u0000') {
        value += c;
        process.stdout.write('*');
      }
    };
    process.stdin.on('data', onData);
  });
}

async function collectCredentials() {
  if (process.stdin.isTTY) {
    const email = await prompt('Admin email: ');
    const password = await promptHidden('Admin password (input is hidden): ');
    return { email, password };
  }

  const lines = (await readStdin()).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    throw new Error('Piped input must provide the email on line 1 and the password on line 2');
  }
  return { email: lines[0], password: lines[1] };
}

async function main() {
  const { email, password } = await collectCredentials();

  if (!email || !email.includes('@')) {
    throw new Error('A valid email address is required');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', password: hashedPassword, isActive: true },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    },
    select: { id: true, email: true, role: true },
  });

  console.log(`\nAdmin account ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((error) => {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });