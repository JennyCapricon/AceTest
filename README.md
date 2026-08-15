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
- **Password recovery** — forgot-password flow with email reset links (1-hour expiry, tokens stored hashed)
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
| `PORT`                   | API port (default `5000`)                          |
| `NODE_ENV`               | `development` or `production`                      |
| `CLIENT_URL`             | Frontend URL used to build password-reset links (default `http://localhost:3000`) |
| `SMTP_HOST` / `SMTP_PORT` | SMTP server for reset emails (leave unset in dev)  |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials                                   |
| `MAIL_FROM`              | "From" address for outgoing emails                 |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name (uploads)                    |
| `CLOUDINARY_API_KEY`     | Cloudinary API key                                 |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret                              |
| `NEXT_PUBLIC_API_URL`    | Client → API base URL (default `http://localhost:5000/api`) |

> The `.env` file is gitignored — never commit real credentials. Uploads will still work for local development if Cloudinary values are left as placeholders. If SMTP is not configured, password-reset links are printed to the server console instead of emailed.

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
npm run build      # builds the Next.js client (static export -> client/out)
```

### Run the API in production

```bash
cd server
npm start
```

### Deploying

AceTest is a two-part deployment: the Next.js **client** (static on Netlify) and the **Express API** (Node.js on Render with hosted PostgreSQL). Netlify cannot run the Express backend — do not attempt to deploy the `server/` folder there.

**Step 1 — Deploy the backend to Render.**

The repo includes a `render.yaml` blueprint that provisions the API web service and a managed PostgreSQL database together:

1. Push this repository to GitHub (deploys are automatic).
2. In Render: **New → Blueprint → select this repository** → click **Apply**.
   - Render creates the `acetest-api` web service and the `acetest-db` PostgreSQL instance.
   - `POSTGRES_DATABASE_URL` is wired automatically from the database.
   - `JWT_SECRET` is auto-generated on first deploy.
3. In the **acetest-api** service → **Environment**:
   - Set `CLIENT_URL` to your frontend (default `https://acetestex.netlify.app`).
   - Optional: add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` for password-reset emails.
   - Optional: add `CLOUDINARY_*` for uploads.
4. The build command already runs `prisma generate` + `prisma db push` against the PostgreSQL schema (`prisma/schema.postgres.prisma`), so tables are created on first deploy.
5. Verify the service is healthy at `GET https://<your-api>.onrender.com/api/health` → `{ "success": true }`.

> **Backend env vars (Render):** `NODE_ENV=production`, `PORT=10000`, `POSTGRES_DATABASE_URL` (managed), `JWT_SECRET` (auto), `JWT_EXPIRES_IN=7d`, `CLIENT_URL`, plus optional SMTP/Cloudinary. Never commit real values — they live in Render's dashboard.

**Step 2 — Create your production admin.**

Do **not** rely on the seeded demo accounts. Use the interactive CLI (password is entered hidden, never hardcoded):

```bash
cd server
npm run prisma:generate:pg
npm run create:admin
```

- Run it with `POSTGRES_DATABASE_URL` pointing at production (on Render's shell it's already set; locally, export it first).
- It prompts for an email and a hidden password (min 8 chars), bcrypt-hashes it, and creates/upgrades an `ADMIN` user.

> **Production accounts:** accounts created in local development (e.g. `nwadike894@gmail.com`, the seeded demo users) do **not** exist in the production database. Only accounts created on Render — the admin from `create:admin` and users who registered — are real. Password reset links are only sent for accounts that exist.

**Step 2a — Require existing users to set a new password (automatic).**

Every non-admin user is forced to change their password on their next login. This happens **automatically** on the first production deploy after this feature ships — no Render Shell, no dashboard clicks, no shared password:

- On startup in production (`NODE_ENV=production`), the API runs a one-time migration against the production Postgres database (`POSTGRES_DATABASE_URL`).
- The build step already runs `prisma db push`, which creates the `mustResetPassword` column (and the `app_meta` marker table) before the server starts. A defensive check also adds the column via `ALTER TABLE` if it is ever missing.
- It sets `mustResetPassword = true` for all users whose role is not `ADMIN`; **admin accounts are never modified** and no passwords or reset tokens are written.
- A marker row is stored in `app_meta` so the migration runs exactly once per database — restarting the service is safe (idempotent) and users who already changed their password are never re-flagged.
- The server logs only a safe summary: `Password reset migration completed: STUDENT=X, TEACHER=Y, OTHER=Z` (never emails, passwords, or tokens).
- Flagged users are redirected to `/auth/force-reset-password` after signing in and must change their password (verified against their current password); the flag is cleared automatically afterward.
- New registrations are never flagged.

The manual CLI (`npm run flag:reset`) still exists as an optional fallback if you ever need to force everyone again on demand — run it in Render → acetest-api → **Shell** (or locally with `POSTGRES_DATABASE_URL` exported).

**Step 2b — Enable password-reset emails (SMTP).**

Without SMTP, the API logs the reset link to the Render console but no email is sent. To deliver real emails, add these env vars in Render → your `acetest-api` service → **Environment** (then redeploy):

- `SMTP_HOST` — e.g. `smtp.gmail.com`, `smtp.sendgrid.net`, `smtp-relay.brevo.com`, `smtp.zoho.com`
- `SMTP_PORT` — `587` (STARTTLS) or `465` (SSL)
- `SMTP_USER` — your provider username/email
- `SMTP_PASS` — app password / API key (Gmail requires an App Password; never use your account password)
- `MAIL_FROM` — e.g. `AceTest <no-reply@yourdomain.com>`

Senders: Gmail (enable 2FA → Google Account → App passwords), SendGrid (API key), Brevo, Zoho Mail, or Resend. SMTP values are secrets — set them only in the Render dashboard, never in the repo.

**Until SMTP is configured**, you can still reset a password: request a reset for an existing account, then open Render → your `acetest-api` service → **Logs** — the reset link is printed there and works exactly like the emailed one.

**Step 3 — Deploy the frontend to Netlify.**

The `netlify.toml` builds the client as a static export (`output: 'export'`, output `client/out`) and already sets the build-time env var `NEXT_PUBLIC_API_URL=https://acetest-api.onrender.com/api`, so the Render URL is baked into every deploy automatically:

- Site settings → Build & Deploy: base directory `client`, build command `npm run build`, publish directory `out`, Node 20.
- (Optional override) To point at a different API, set `NEXT_PUBLIC_API_URL` in the Netlify dashboard — dashboard variables take precedence over `netlify.toml`.
- Deploys → **Clear cache and deploy site**.

**Step 4 — Verify.**

- `GET /api/health` returns `{ "success": true }`
- Log in with the admin you created in Step 2.

> **Development vs production Prisma:** local development uses `prisma/schema.prisma` (SQLite, `DATABASE_URL`). Production uses `prisma/schema.postgres.prisma` (PostgreSQL, `POSTGRES_DATABASE_URL`). For long-term production schema changes, migrate from `db push` to `prisma migrate` (`npm run prisma:migrate:pg`).

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
