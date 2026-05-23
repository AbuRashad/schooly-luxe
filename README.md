# Schooly Luxe

Schooly Luxe is a premium school management MVP built as a TypeScript-first monorepo. It combines school administration, attendance, finance foundations, analytics, and ICT asset management in a modern dashboard experience.

## Product framing

- **Product name**: Schooly Luxe
- **Positioning**: Premium school operations platform
- **MVP modules**:
  - Authentication + role-aware user profile
  - Schools
  - Students
  - Attendance
  - ICT Assets
  - Dashboard analytics summary
  - Finance foundation (invoices + payments for summary KPIs)

## Monorepo layout

```text
apps/
  api/            NestJS backend API + JWT auth + Prisma integration
  web/            Next.js web dashboard (Tailwind + TypeScript)
packages/
  config/         Shared TS config presets
  types/          Shared cross-app TypeScript contracts
  ui/             Shared UI primitives
prisma/
  schema.prisma   Database schema
  seed.ts         Seed script
infrastructure/
  docker/
    docker-compose.yml

docs/
  architecture.md
```

## Tech stack

- **Workspace**: pnpm + turbo
- **Frontend**: Next.js 14 + Tailwind CSS + Zod
- **Backend**: NestJS 10 + Zod + JWT auth
- **Database**: PostgreSQL 16
- **ORM**: Prisma

## Quick start

### 1) Prerequisites

- Node.js 20+ (Node 24 tested)
- pnpm 9+
- Docker (for local PostgreSQL)

### 2) Environment

```bash
cp .env.example .env
```

### 3) Start database

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

### 4) Install dependencies

```bash
pnpm install
```

### 5) Generate Prisma client + migrate + seed

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### 6) Start development apps

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Seeded login credentials

- **Email**: `admin@schoolyluxe.com`
- **Password**: `Admin@12345`

(Overridable with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env`.)

## API endpoints (MVP)

- `GET /health`
- `POST /auth/login`
- `GET /auth/me`
- `GET /dashboard/summary`
- `GET /students`
- `POST /students`
- `GET /attendance`
- `POST /attendance`
- `GET /assets`
- `POST /assets`
- `GET /schools`

## Scripts

```bash
pnpm dev        # run web + api in watch mode
pnpm build      # turbo build
pnpm lint       # turbo type-check style linting
pnpm test       # placeholder tests
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Known limitations (MVP scope)

- Single-school operational assumptions in frontend flows.
- Basic JWT auth without refresh tokens.
- No advanced RBAC policy enforcement yet (role stored and returned, but not fully permission-scoped routes).
- Placeholder test scripts only; deeper automated coverage is roadmap.

## Roadmap

1. Multi-tenant school switching and scoped RBAC policy engine.
2. Full finance module (student billing ledger, receipts, aging reports).
3. Parent/teacher portals and communication modules.
4. Advanced analytics visualizations and scheduled reporting.
5. Audit logs, notifications, and document management.

