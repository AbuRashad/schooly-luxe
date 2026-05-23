# Schooly Luxe MVP Architecture

- **Monorepo tooling**: pnpm workspaces + turbo
- **Frontend**: Next.js (TypeScript, Tailwind)
- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL + Prisma
- **Shared packages**:
  - `@schooly-luxe/ui`: reusable UI primitives
  - `@schooly-luxe/types`: shared platform types
  - `@schooly-luxe/config`: shared tsconfig presets
