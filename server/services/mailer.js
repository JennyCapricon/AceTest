import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM || 'AceTest <no-reply@acetest.com>';

function createTransport() {
  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return null;
}

export async function sendPasswordResetEmail({ to, firstName, resetUrl }) {
  const subject = 'Reset your AceTest password';
  const text = [
    `Hi ${firstName},`,
    '',
    'We received a request to reset your AceTest password.',
    `Click the link below to choose a new password (valid for 1 hour):`,
    '',
    resetUrl,
    '',
    "If you didn't request this, you can safely ignore this email.",
    '',
    '- The AceTest Team',
  ].join('\n');

  const transporter = createTransport();

  if (!transporter) {
    console.log('\n[AceTest] Password reset requested for:', to);
    console.log('[AceTest] Reset link (dev fallback, no SMTP configured):', resetUrl, '\n');
    return;
  }

  await transporter.sendMail({ from: mailFrom, to, subject, text });
}