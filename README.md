# AceTest

**AceTest** is a full-stack exam management platform built for teachers and students. Teachers can create, schedule, and grade exams from a question bank, while students can sit timed exams, track results, earn badges, climb leaderboards, and download certificates.

## Why AceTest?

Running assessments in many schools still relies on paper, spreadsheets, and manual grading — a process that is slow, error-prone, and hard to scale across multiple classes or schools.

AceTest solves this by digitizing the entire exam lifecycle in one place:

- **Teachers** author questions once and reuse them across exams, publish or schedule exams, and get instant auto-grading with detailed analytics.
- **Students** take timed, proctored-style exams online with immediate feedback and permanent records.
- **Admins** manage users, schools, and audit activity across the platform.

## Key Features

- **Role-based dashboards** for Admin, Teacher, and Student
- **Question bank** with multiple question types (MCQ, etc.), difficulty levels, and bulk import
- **Exam engine** with timers, question shuffling, pass marks, scheduling, and configurable attempts
- **Auto-grading** with instant results, percentages, grades, and pass/fail determination
- **Analytics** for teachers (class performance) and admins (platform-wide stats)
- **Gamification** — points, streaks, badges, and a student leaderboard
- **Certificates** — downloadable certificates for successful students
- **Notifications & announcements** — in-app alerts and platform-wide announcements
- **Audit logs** for admin accountability
- **School management** with subscriptions and activation controls

## Technologies Used

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | Next.js 14 (App Router-ready pages), React 18, Tailwind CSS, Chart.js, lucide-react, axios |
| Backend  | Node.js, Express, JWT auth, bcrypt, Cloudinary, multer, pdfkit, xlsx |
| Database | SQLite (dev) via Prisma ORM                          |
| Tooling  | npm workspaces-style monorepo, concurrently, nodemon |

## Project Structure

```
AceTest/
├── client/                  # Next.js frontend
│   ├── components/          # Reusable UI + layout components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── exam/            # Exam-taking components
│   │   ├── layout/          # Navbar, footer, dashboard layout
│   │   └── ui/              # Primitive UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Auth context, utilities
│   ├── pages/               # Next.js pages (admin/, teacher/, student/, auth/)
│   ├── public/              # Static assets
│   ├── services/            # API client (axios) and endpoint wrappers
│   └── styles/              # Global styles
├── server/                  # Express REST API
│   ├── config/              # DB + Cloudinary config
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, error handling
│   ├── prisma/              # Schema, migrations, seed
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   └── utils/               # Token helpers, etc.
├── database/                # (reserved) DB tooling/scripts
├── shared/                  # (reserved) shared code between client/server
└── package.json             # Root scripts (concurrently)
```

## Prerequisites

- Node.js **18.x or newer** (v20+ recommended)
- npm **9.x or newer**

## Installation

```bash
# Clone the repository
git clone https://github.com/JennyCapricon/AceTest.git
cd AceTest

# Install all dependencies (root, server, client)
npm run install:all
```

## Environment Variables

Copy the example env file and adjust values:

```bash
cp server/.env.example server/.env
```

| Variable                     | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `DATABASE_URL`               | Prisma datasource URL (SQLite: `file:./dev.db`)    |
| `JWT_SECRET`                 | Secret used to sign auth tokens                    |
| `JWT_EXPIRES_IN`             | Token lifetime, e.g. `7d`                          |
| `PORT`                       | API port (default `5000`)                          |
| `NODE_ENV`                   | `development` or `production`                      |
| `CLOUDINARY_CLOUD_NAME`      | Cloudinary cloud name (uploads)                    |
| `CLOUDINARY_API_KEY`         | Cloudinary API key                                 |
| `CLOUDINARY_API_SECRET`      | Cloudinary API secret                              |
| `NEXT_PUBLIC_API_URL`        | Client → API base URL (default `http://localhost:5000/api`) |

> The `.env` file is gitignored — never commit real credentials. Uploads will still work for local development if Cloudinary values are left as placeholders.

### Set up the database

```bash
cd server
npx prisma generate   # Generate the Prisma client
npx prisma db push    # Create the SQLite database from the schema
```

### Seed demo data (optional)

```bash
cd server
npm run prisma:seed
```

| Role    | Email                | Password      |
| ------- | -------------------- | ------------- |
| Admin   | admin@acetest.com    | password123   |
| Teacher | teacher@acetest.com  | password123   |
| Student | student@acetest.com  | password123   |

## Running Locally

Start the API and the client together from the repository root:

```bash
npm run dev
```

- Client: **http://localhost:3000**
- API: **http://localhost:5000** (health check at `/api/health`)

Or run each part individually:

```bash
npm run dev:server   # Express API only
npm run dev:client   # Next.js frontend only
```

## Testing

There are currently no automated test suites configured in the repository. The project is verified through:

- **Production build** — `npm run build` (client) must complete without errors
- **Manual verification** — sign in with the seeded accounts and exercise the three role dashboards
- **API smoke test** — `GET /api/health` should return `{ "success": true }`

Adding automated tests (Jest/Vitest for the server, Playwright for the client) is a recommended next step.

## Build & Deployment

### Production build

```bash
npm run build      # builds the Next.js client (output in client/.next)
```

### Run the API in production

```bash
cd server
npm start
```

### Deploying

- **Client**: deploy `client/` to any Next.js-compatible host (Vercel, Netlify, or a Node server via `next start`). Set `NEXT_PUBLIC_API_URL` to your deployed API.
- **API**: deploy `server/` to any Node.js host (Render, Railway, Fly.io, or a VPS). Point `DATABASE_URL` at a managed SQLite or switch the Prisma provider to PostgreSQL/MySQL for production.

## Future Improvements

- Automated test suites (unit + e2e)
- PostgreSQL/MySQL migration for production deployments
- Question bank bulk import from Excel templates
- Live proctoring / anti-cheating features
- Email notifications for exam results and announcements
- OAuth/social login and SSO for schools
- Offline exam mode for low-connectivity classrooms
- Internationalization (i18n)
- Docker Compose setup for one-command deployment

## License

This project is private and intended for the AceTest team. All rights reserved.
