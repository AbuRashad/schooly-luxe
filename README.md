# Schooly Luxe

Schooly Luxe is a premium school management platform. This repository contains a **Streamlit** Python app that can be deployed instantly on [Streamlit Community Cloud](https://streamlit.io/cloud) — no database or server setup required.

## Live demo

[![Open in Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/AbuRashad/schooly-luxe/main/streamlit_app.py)

## Product modules

- 🔐 Login with role-aware user profile
- 📊 Dashboard analytics summary (students, attendance, assets, finance KPIs)
- 👩‍🎓 Students – list and enroll new students
- 📋 Attendance – view and record daily attendance
- 🖥️ ICT Assets – asset registry with status tracking

## Demo credentials

| Email | Password | Role |
|---|---|---|
| admin@schoolyluxe.com | Admin@12345 | ADMIN |
| teacher@schoolyluxe.com | Teacher@12345 | TEACHER |

## Quick start (local)

### 1) Prerequisites

- Python 3.9+

### 2) Install dependencies

```bash
pip install -r requirements.txt
```

### 3) Run the app

```bash
streamlit run streamlit_app.py
```

The app opens at **http://localhost:8501**.

## Deploy on Streamlit Community Cloud

1. Fork / push this repo to GitHub.
2. Go to [share.streamlit.io](https://share.streamlit.io) and click **New app**.
3. Select your repo and set the **Main file path** to `streamlit_app.py`.
4. Click **Deploy** — no environment variables needed.

> **Note:** The app uses in-memory session state for demo purposes. Data resets on page refresh. For persistent storage in production, connect a database (e.g. Supabase, PlanetScale) and adapt `_make_seed_data()` / the page functions accordingly.

## Repository layout

```text
streamlit_app.py        Python Streamlit entrypoint (main app)
requirements.txt        Python dependencies
.streamlit/
  config.toml           Streamlit theme (dark, amber accent)

# Legacy TypeScript monorepo (reference only — not required to run the Streamlit app)
apps/
  api/                  NestJS backend (original architecture)
  web/                  Next.js frontend (original architecture)
packages/               Shared TS packages
prisma/                 Prisma schema + seed
infrastructure/         Docker Compose for Postgres
docs/                   Architecture docs
```

## Tech stack (Streamlit version)

- **Language**: Python 3.9+
- **Framework**: Streamlit ≥ 1.35
- **Data**: pandas + in-memory `st.session_state`
- **Persistence**: session-scoped (demo); swap for any DB adapter as needed

## Roadmap

1. Persistent storage adapter (Supabase / SQLite / Postgres).
2. Multi-school support and scoped RBAC.
3. Full finance module — student billing ledger, receipts, aging reports.
4. Parent/teacher portals and communication modules.
5. Advanced analytics charts and scheduled reporting.

