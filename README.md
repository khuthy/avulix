# Avulix ISAMS — Integrated School Administration and Management System

> Powered by **Danho Systems** · Built for South African schools

A modern, cloud-hosted school administration platform covering learner management, finance, attendance, admissions, library, inventory, and transport — all in one system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS v3, shadcn/ui |
| Backend | Next.js API Routes + Server Actions |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 (JWT + RBAC) |
| File Storage | Local FS / MinIO-compatible S3 |
| Email | Nodemailer (pluggable SMTP) |
| Package Manager | pnpm |
| Monorepo | Turborepo |

---

## Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL 14+
- (Optional) MinIO for file storage

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/danhosystems/avulix.git
cd avulix
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env with your database URL, NextAuth secret, and SMTP config
```

### 3. Run Migrations

```bash
pnpm db:migrate
```

### 4. Seed Database

```bash
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
# App available at http://localhost:3000
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| School Admin | admin@demo.avulix.co.za | Demo1234! |
| Teacher | teacher@demo.avulix.co.za | Demo1234! |

---

## Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Overview stats, recent activity, quick actions |
| **Students** | Learner profiles, admission records, guardian details |
| **Admissions** | Kanban pipeline — Pending → Reviewing → Accepted/Rejected |
| **Attendance** | Daily attendance marking per grade, historical view |
| **Staff** | Staff directory with departments and positions |
| **Finance — Fees** | Fee structure management (monthly/quarterly/annual) |
| **Finance — Payments** | Payment recording with printable receipts |
| **Finance — Debtors** | Outstanding balances with days-overdue tracking |
| **Library** | Resource catalogue, loan management, overdue tracking |
| **Inventory** | Asset register with condition tracking and audit dates |
| **Transport** | Route management with stops and learner assignments |
| **Reports** | Generate and export CSV reports for all modules |
| **Audit Log** | Full system activity trail (Admin only) |
| **Settings** | School profile, user management |

---

## Brand Colors

| Color | Role | Hex |
|-------|------|-----|
| Red | Actions / CTAs | `#C0392B` |
| Red Light | Hover states | `#E8574A` |
| Red Dark | Active states | `#8C2820` |
| Navy | Structure / Sidebar | `#1A2340` |
| Navy Light | Navy hover | `#2E3F6F` |
| Lime | Success / Paid | `#8DB531` |
| Lime Dark | Lime text | `#637F22` |
| Gray 50 | Page backgrounds | `#F5F6F8` |

---

## POPIA Compliance

Avulix processes personal information in accordance with the **Protection of Personal Information Act (POPIA), Act 4 of 2013**. Key measures:

- Role-based access control (RBAC) — users only see their school's data
- Complete audit trail for all data mutations
- Document retention date support
- Confidential document flagging
- POPIA acknowledgement banner on first login

---

## Folder Structure

```
avulix/
├── apps/
│   └── web/                    # Next.js 14 app
│       ├── app/
│       │   ├── (auth)/         # Login page
│       │   ├── (dashboard)/    # All protected pages
│       │   └── api/            # REST API routes
│       ├── components/
│       │   ├── ui/             # shadcn/ui base components
│       │   ├── layout/         # Sidebar, TopNav, PageHeader
│       │   ├── shared/         # DataTable, StatCard, StatusBadge, etc.
│       │   ├── admissions/     # Application components
│       │   ├── finance/        # Receipt, PaymentForm, DebtorCard
│       │   └── students/       # StudentProfileCard
│       └── lib/                # auth, prisma, audit, utils
└── packages/
    └── db/
        └── prisma/             # Schema & seed
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:studio` | Open Prisma Studio |

---

## SA-SAMS & LURITS

> Export formats for Department of Education reporting (SA-SAMS & LURITS) are **coming soon**.

---

## License

**Proprietary** — All rights reserved. Developed by **Danho Systems**.

For licensing enquiries: systems@danho.co.za
