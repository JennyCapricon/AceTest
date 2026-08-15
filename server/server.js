import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import { runPasswordResetMigration } from './services/passwordResetMigration.js';

import authRoutes from './routes/auth.js';
import examRoutes from './routes/exam.js';
import questionRoutes from './routes/question.js';
import resultRoutes from './routes/result.js';
import adminRoutes from './routes/admin.js';
import subjectRoutes from './routes/subject.js';
import auditRoutes from './routes/audit.js';
import gamificationRoutes from './routes/gamification.js';
import certificateRoutes from './routes/certificate.js';
import notificationRoutes from './routes/notification.js';
import announcementRoutes from './routes/announcement.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AceTest API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);

app.use(errorHandler);

await runPasswordResetMigration();

app.listen(PORT, () => {
  console.log(`AceTest server running on port ${PORT}`);
});
