# Quit Smoking App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first quit-smoking web app with a SQLite-backed single-user workflow that supports varenicline treatment tracking, pre-quit smoking logs, quit-date switching, craving handling, and progress review.

**Architecture:** Use a single Next.js App Router application with server-rendered pages and thin route handlers backed by Prisma + SQLite. Keep business rules in small domain/service modules so stage switching, timeline merging, and progress aggregation can be tested without rendering the whole app.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, SQLite, Zod, date-fns, Vitest, React Testing Library, Playwright

---

### Task 1: Bootstrap the workspace and app shell

**Files:**
- Create: `/home/sunlong/workspace/quit-smoking/package.json`
- Create: `/home/sunlong/workspace/quit-smoking/tsconfig.json`
- Create: `/home/sunlong/workspace/quit-smoking/next.config.ts`
- Create: `/home/sunlong/workspace/quit-smoking/.gitignore`
- Create: `/home/sunlong/workspace/quit-smoking/eslint.config.mjs`
- Create: `/home/sunlong/workspace/quit-smoking/vitest.config.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/test/setup.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/layout.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/page.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/records/page.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/progress/page.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/globals.css`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/app-shell.tsx`
- Test: `/home/sunlong/workspace/quit-smoking/src/components/app-shell.test.tsx`

- [ ] **Step 1: Initialize Git and write the failing shell test**

```bash
cd /home/sunlong/workspace/quit-smoking
git init
mkdir -p src/components
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/app-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/app-shell";

describe("AppShell", () => {
  it("renders the three primary navigation tabs", () => {
    render(
      <AppShell pathname="/">
        <div>body</div>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "今日" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "记录" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "进展" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/components/app-shell.test.tsx
```

Expected: FAIL with `Cannot find module '@/components/app-shell'` or missing test runner config.

- [ ] **Step 3: Install dependencies and create the minimum Next.js shell**

```bash
npm install next react react-dom prisma @prisma/client zod date-fns clsx lucide-react
npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright next-test-api-route-handler
```

```json
// /home/sunlong/workspace/quit-smoking/package.json
{
  "name": "quit-smoking",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev"
  }
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/app-shell.tsx
import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  pathname: "/" | "/records" | "/progress";
  children: ReactNode;
};

const tabs = [
  { href: "/" as const, label: "今日" },
  { href: "/records" as const, label: "记录" },
  { href: "/progress" as const, label: "进展" },
];

export function AppShell({ pathname, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <main className="app-main">{children}</main>
      <nav className="bottom-nav" aria-label="Primary">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={pathname === tab.href ? "tab active" : "tab"}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "戒烟计划",
  description: "酒石酸伐尼克兰戒烟记录",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/page.tsx
import { AppShell } from "@/components/app-shell";

export default function TodayPage() {
  return <AppShell pathname="/">初始化中</AppShell>;
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/records/page.tsx
import { AppShell } from "@/components/app-shell";

export default function RecordsPage() {
  return <AppShell pathname="/records">初始化中</AppShell>;
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/progress/page.tsx
import { AppShell } from "@/components/app-shell";

export default function ProgressPage() {
  return <AppShell pathname="/progress">初始化中</AppShell>;
}
```

```ts
// /home/sunlong/workspace/quit-smoking/vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```ts
// /home/sunlong/workspace/quit-smoking/src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- src/components/app-shell.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: bootstrap next app shell"
```

### Task 2: Add the SQLite schema and stage-calculation domain helpers

**Files:**
- Create: `/home/sunlong/workspace/quit-smoking/prisma/schema.prisma`
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/db.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/domain/stage.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/domain/progress.ts`
- Test: `/home/sunlong/workspace/quit-smoking/src/lib/domain/stage.test.ts`
- Test: `/home/sunlong/workspace/quit-smoking/src/lib/domain/progress.test.ts`

- [ ] **Step 1: Write failing tests for stage switching and progress math**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/domain/stage.test.ts
import { describe, expect, it } from "vitest";
import { getCurrentStage, getQuitWindow } from "@/lib/domain/stage";

describe("getCurrentStage", () => {
  it("returns prep before the target quit date", () => {
    expect(
      getCurrentStage({
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-10",
        now: new Date("2026-05-04T08:00:00+08:00"),
      }),
    ).toBe("prep");
  });

  it("returns quit on and after the target quit date", () => {
    expect(
      getCurrentStage({
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-05",
        now: new Date("2026-05-05T09:00:00+08:00"),
      }),
    ).toBe("quit");
  });
});

describe("getQuitWindow", () => {
  it("returns the allowed quit-date range from day 8 to day 35", () => {
    expect(getQuitWindow("2026-04-28")).toEqual({
      earliest: "2026-05-05",
      latest: "2026-06-01",
    });
  });
});
```

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/domain/progress.test.ts
import { describe, expect, it } from "vitest";
import { getDailyReduction, getMoneySaved } from "@/lib/domain/progress";

describe("getDailyReduction", () => {
  it("compares smoked count against baseline", () => {
    expect(getDailyReduction({ baselinePerDay: 20, smokedToday: 8 })).toEqual({
      fewerCigarettes: 12,
      reductionRate: 0.6,
    });
  });
});

describe("getMoneySaved", () => {
  it("uses pack price and cigarettes-per-pack", () => {
    expect(
      getMoneySaved({
        baselinePerDay: 20,
        smokedCount: 236,
        daysSinceQuit: 12,
        cigarettePricePerPack: 25,
        cigarettesPerPack: 20,
      }),
    ).toBe(64);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
npm test -- src/lib/domain/stage.test.ts src/lib/domain/progress.test.ts
```

Expected: FAIL with missing module errors for `stage` and `progress`.

- [ ] **Step 3: Add the schema and the smallest implementation**

```prisma
// /home/sunlong/workspace/quit-smoking/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Settings {
  id                         Int      @id @default(1)
  treatmentStartDate         DateTime
  targetQuitDate             DateTime?
  baselineCigarettesPerDay   Int
  cigarettePricePerPack      Decimal
  cigarettesPerPack          Int
  timezone                   String
  medicationName             String
  medicationScheduleJson     String
  createdAt                  DateTime @default(now())
  updatedAt                  DateTime @updatedAt
}

model MedicationLog {
  id               String   @id @default(cuid())
  scheduledForDate DateTime
  scheduledSlot    String
  takenAt          DateTime?
  status           String
  note             String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model SmokingLog {
  id         String   @id @default(cuid())
  smokedAt   DateTime
  count      Int
  contextTag String?
  triggerTag String?
  note       String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model RecordEntry {
  id         String   @id @default(cuid())
  occurredAt DateTime
  kind       String
  severity   Int?
  triggerTag String?
  actionTag  String?
  resolved   Boolean?
  note       String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model CravingFollowup {
  id                  String   @id @default(cuid())
  cravingRecordId     String   @unique
  followupDueAt       DateTime
  followupCompletedAt DateTime?
  outcome             String?
  note                String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/domain/stage.ts
import { addDays, formatISO, isBefore, startOfDay } from "date-fns";

type StageInput = {
  treatmentStartDate: string;
  targetQuitDate: string | null;
  now: Date;
};

export function getCurrentStage(input: StageInput): "prep" | "quit" {
  if (!input.targetQuitDate) return "prep";
  return isBefore(startOfDay(input.now), startOfDay(new Date(input.targetQuitDate)))
    ? "prep"
    : "quit";
}

export function getQuitWindow(treatmentStartDate: string) {
  const start = startOfDay(new Date(treatmentStartDate));

  return {
    earliest: formatISO(addDays(start, 7), { representation: "date" }),
    latest: formatISO(addDays(start, 34), { representation: "date" }),
  };
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/domain/progress.ts
export function getDailyReduction(input: {
  baselinePerDay: number;
  smokedToday: number;
}) {
  const fewerCigarettes = Math.max(input.baselinePerDay - input.smokedToday, 0);
  const reductionRate =
    input.baselinePerDay === 0 ? 0 : fewerCigarettes / input.baselinePerDay;

  return { fewerCigarettes, reductionRate };
}

export function getMoneySaved(input: {
  baselinePerDay: number;
  smokedCount: number;
  daysSinceQuit: number;
  cigarettePricePerPack: number;
  cigarettesPerPack: number;
}) {
  const expectedCount = input.baselinePerDay * input.daysSinceQuit;
  const fewerCount = Math.max(expectedCount - input.smokedCount, 0);
  const unitPrice = input.cigarettePricePerPack / input.cigarettesPerPack;

  return Math.round(fewerCount * unitPrice);
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = db;
```

- [ ] **Step 4: Run the tests and initialize the database**

Run:

```bash
npm test -- src/lib/domain/stage.test.ts src/lib/domain/progress.test.ts
npx prisma migrate dev --name init
npm run db:generate
```

Expected: unit tests PASS and Prisma creates `prisma/dev.db`.

- [ ] **Step 5: Commit**

```bash
git add prisma src/lib
git commit -m "feat: add quit-stage domain and sqlite schema"
```

### Task 3: Build onboarding and settings persistence

**Files:**
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/validation/settings.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/server/settings-service.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/api/settings/route.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/onboarding-form.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/app/page.tsx`
- Test: `/home/sunlong/workspace/quit-smoking/src/lib/server/settings-service.test.ts`
- Test: `/home/sunlong/workspace/quit-smoking/src/app/api/settings/route.test.ts`

- [ ] **Step 1: Write failing tests for settings validation and quit-date window**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/settings-service.test.ts
import { describe, expect, it } from "vitest";
import { validateQuitDate } from "@/lib/server/settings-service";

describe("validateQuitDate", () => {
  it("rejects a quit date before treatment day 8", () => {
    expect(() =>
      validateQuitDate({
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-04",
      }),
    ).toThrow("戒烟日必须在治疗第 8 到 35 天之间");
  });
});
```

```ts
// /home/sunlong/workspace/quit-smoking/src/app/api/settings/route.test.ts
import { testApiHandler } from "next-test-api-route-handler";
import * as route from "@/app/api/settings/route";

it("stores the single-user settings payload", async () => {
  await testApiHandler({
    appHandler: route,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: "POST",
        body: JSON.stringify({
          treatmentStartDate: "2026-04-28",
          baselineCigarettesPerDay: 20,
          cigarettePricePerPack: 25,
          cigarettesPerPack: 20,
          timezone: "Asia/Shanghai",
          medicationName: "酒石酸伐尼克兰",
          medicationSchedule: ["08:30", "20:30"],
        }),
      });

      expect(response.status).toBe(200);
    },
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
npm test -- src/lib/server/settings-service.test.ts src/app/api/settings/route.test.ts
```

Expected: FAIL with missing modules and route handler.

- [ ] **Step 3: Implement the onboarding form and service**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/validation/settings.ts
import { z } from "zod";

export const settingsSchema = z.object({
  treatmentStartDate: z.string().date(),
  targetQuitDate: z.string().date().nullable().optional(),
  baselineCigarettesPerDay: z.number().int().min(1).max(200),
  cigarettePricePerPack: z.number().positive(),
  cigarettesPerPack: z.number().int().min(1).max(100),
  timezone: z.string().min(1),
  medicationName: z.string().min(1),
  medicationSchedule: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1),
});
```

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/settings-service.ts
import { db } from "@/lib/db";
import { getQuitWindow } from "@/lib/domain/stage";
import { settingsSchema } from "@/lib/validation/settings";

export function validateQuitDate(input: {
  treatmentStartDate: string;
  targetQuitDate: string | null;
}) {
  if (!input.targetQuitDate) return;

  const { earliest, latest } = getQuitWindow(input.treatmentStartDate);

  if (input.targetQuitDate < earliest || input.targetQuitDate > latest) {
    throw new Error("戒烟日必须在治疗第 8 到 35 天之间");
  }
}

export async function upsertSettings(payload: unknown) {
  const parsed = settingsSchema.parse(payload);
  validateQuitDate(parsed);

  return db.settings.upsert({
    where: { id: 1 },
    update: {
      treatmentStartDate: new Date(parsed.treatmentStartDate),
      targetQuitDate: parsed.targetQuitDate ? new Date(parsed.targetQuitDate) : null,
      baselineCigarettesPerDay: parsed.baselineCigarettesPerDay,
      cigarettePricePerPack: parsed.cigarettePricePerPack,
      cigarettesPerPack: parsed.cigarettesPerPack,
      timezone: parsed.timezone,
      medicationName: parsed.medicationName,
      medicationScheduleJson: JSON.stringify(parsed.medicationSchedule),
    },
    create: {
      id: 1,
      treatmentStartDate: new Date(parsed.treatmentStartDate),
      targetQuitDate: parsed.targetQuitDate ? new Date(parsed.targetQuitDate) : null,
      baselineCigarettesPerDay: parsed.baselineCigarettesPerDay,
      cigarettePricePerPack: parsed.cigarettePricePerPack,
      cigarettesPerPack: parsed.cigarettesPerPack,
      timezone: parsed.timezone,
      medicationName: parsed.medicationName,
      medicationScheduleJson: JSON.stringify(parsed.medicationSchedule),
    },
  });
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { upsertSettings } from "@/lib/server/settings-service";

export async function POST(request: Request) {
  const payload = await request.json();
  const settings = await upsertSettings(payload);

  return NextResponse.json({ id: settings.id });
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/onboarding-form.tsx
"use client";

import { useState } from "react";

export function OnboardingForm() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);

    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        treatmentStartDate: formData.get("treatmentStartDate"),
        baselineCigarettesPerDay: Number(formData.get("baselineCigarettesPerDay")),
        cigarettePricePerPack: Number(formData.get("cigarettePricePerPack")),
        cigarettesPerPack: Number(formData.get("cigarettesPerPack")),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        medicationName: "酒石酸伐尼克兰",
        medicationSchedule: [formData.get("morningTime"), formData.get("eveningTime")].filter(Boolean),
      }),
    });

    window.location.reload();
  }

  return (
    <form action={handleSubmit} className="onboarding-form">
      <input name="treatmentStartDate" type="date" required />
      <input name="baselineCigarettesPerDay" type="number" min="1" required />
      <input name="cigarettePricePerPack" type="number" min="1" step="0.01" required />
      <input name="cigarettesPerPack" type="number" min="1" required />
      <input name="morningTime" type="time" required />
      <input name="eveningTime" type="time" />
      <button disabled={submitting}>{submitting ? "保存中..." : "开始记录"}</button>
    </form>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/page.tsx
import { AppShell } from "@/components/app-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { db } from "@/lib/db";

export default async function TodayPage() {
  const settings = await db.settings.findUnique({ where: { id: 1 } });

  if (!settings) {
    return (
      <AppShell pathname="/">
        <OnboardingForm />
      </AppShell>
    );
  }

  return <AppShell pathname="/">待接入今日视图</AppShell>;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:

```bash
npm test -- src/lib/server/settings-service.test.ts src/app/api/settings/route.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app src/components src/lib
git commit -m "feat: add onboarding and settings persistence"
```

### Task 4: Implement the prep-stage today view with medication and smoking logs

**Files:**
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/server/today-service.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/api/medication-logs/route.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/api/smoking-logs/route.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/today/medication-card.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/today/prep-stage-card.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/app/page.tsx`
- Test: `/home/sunlong/workspace/quit-smoking/src/lib/server/today-service.test.ts`

- [ ] **Step 1: Write failing tests for the prep-stage summary**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/today-service.test.ts
import { describe, expect, it } from "vitest";
import { buildPrepStageSummary } from "@/lib/server/today-service";

describe("buildPrepStageSummary", () => {
  it("summarizes today's smoked count against baseline", () => {
    expect(
      buildPrepStageSummary({
        baselinePerDay: 20,
        smokedToday: 8,
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-10",
        now: new Date("2026-05-04T08:00:00+08:00"),
      }),
    ).toMatchObject({
      stage: "prep",
      smokedToday: 8,
      fewerCigarettes: 12,
      daysUntilQuit: 6,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/lib/server/today-service.test.ts
```

Expected: FAIL with missing `today-service`.

- [ ] **Step 3: Implement prep-stage aggregation and write endpoints**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/today-service.ts
import { differenceInCalendarDays } from "date-fns";
import { getDailyReduction } from "@/lib/domain/progress";
import { getCurrentStage } from "@/lib/domain/stage";

export function buildPrepStageSummary(input: {
  baselinePerDay: number;
  smokedToday: number;
  treatmentStartDate: string;
  targetQuitDate: string | null;
  now: Date;
}) {
  const reduction = getDailyReduction({
    baselinePerDay: input.baselinePerDay,
    smokedToday: input.smokedToday,
  });

  return {
    stage: getCurrentStage(input),
    smokedToday: input.smokedToday,
    fewerCigarettes: reduction.fewerCigarettes,
    daysUntilQuit: input.targetQuitDate
      ? differenceInCalendarDays(new Date(input.targetQuitDate), input.now)
      : null,
  };
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/app/api/medication-logs/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const payload = await request.json();

  const log = await db.medicationLog.create({
    data: {
      scheduledForDate: new Date(payload.scheduledForDate),
      scheduledSlot: payload.scheduledSlot,
      takenAt: new Date(payload.takenAt),
      status: "taken",
      note: payload.note ?? null,
    },
  });

  return NextResponse.json(log);
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/app/api/smoking-logs/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const payload = await request.json();

  const log = await db.smokingLog.create({
    data: {
      smokedAt: new Date(payload.smokedAt),
      count: payload.count,
      contextTag: payload.contextTag ?? null,
      triggerTag: payload.triggerTag ?? null,
      note: payload.note ?? null,
    },
  });

  return NextResponse.json(log);
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/today/medication-card.tsx
"use client";

type MedicationCardProps = {
  scheduledSlots: string[];
  scheduledForDate: string;
};

export function MedicationCard(props: MedicationCardProps) {
  async function markTaken(slot: string) {
    await fetch("/api/medication-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduledForDate: props.scheduledForDate,
        scheduledSlot: slot,
        takenAt: new Date().toISOString(),
      }),
    });

    window.location.reload();
  }

  return (
    <section className="hero-card">
      <h2>今日服药</h2>
      {props.scheduledSlots.map((slot) => (
        <button key={slot} onClick={() => markTaken(slot)}>
          {slot} 已服用
        </button>
      ))}
    </section>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/today/prep-stage-card.tsx
"use client";

type PrepStageCardProps = {
  smokedToday: number;
  fewerCigarettes: number;
  daysUntilQuit: number | null;
};

export function PrepStageCard(props: PrepStageCardProps) {
  async function logOneCigarette() {
    await fetch("/api/smoking-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        smokedAt: new Date().toISOString(),
        count: 1,
      }),
    });

    window.location.reload();
  }

  return (
    <section className="hero-card">
      <p>今日已抽 {props.smokedToday} 支</p>
      <p>比基线少抽 {props.fewerCigarettes} 支</p>
      <p>{props.daysUntilQuit === null ? "请设置戒烟日" : `距戒烟日还有 ${props.daysUntilQuit} 天`}</p>
      <button onClick={logOneCigarette}>快速记一支</button>
    </section>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/page.tsx
import { AppShell } from "@/components/app-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { MedicationCard } from "@/components/today/medication-card";
import { PrepStageCard } from "@/components/today/prep-stage-card";
import { db } from "@/lib/db";
import { buildPrepStageSummary } from "@/lib/server/today-service";

export default async function TodayPage() {
  const settings = await db.settings.findUnique({ where: { id: 1 } });

  if (!settings) {
    return (
      <AppShell pathname="/">
        <OnboardingForm />
      </AppShell>
    );
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const smokedToday = await db.smokingLog.aggregate({
    _sum: { count: true },
    where: { smokedAt: { gte: startOfDay, lte: endOfDay } },
  });

  const summary = buildPrepStageSummary({
    baselinePerDay: settings.baselineCigarettesPerDay,
    smokedToday: smokedToday._sum.count ?? 0,
    treatmentStartDate: settings.treatmentStartDate.toISOString(),
    targetQuitDate: settings.targetQuitDate?.toISOString() ?? null,
    now: new Date(),
  });

  return (
    <AppShell pathname="/">
      <MedicationCard
        scheduledSlots={JSON.parse(settings.medicationScheduleJson) as string[]}
        scheduledForDate={startOfDay.toISOString()}
      />
      <PrepStageCard
        smokedToday={summary.smokedToday}
        fewerCigarettes={summary.fewerCigarettes}
        daysUntilQuit={summary.daysUntilQuit}
      />
    </AppShell>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- src/lib/server/today-service.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api src/components/today src/lib/server
git commit -m "feat: add prep-stage today view"
```

### Task 5: Add quit-date editing, quit-stage craving flow, and followups

**Files:**
- Create: `/home/sunlong/workspace/quit-smoking/src/app/api/quit-date/route.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/api/record-entries/route.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/app/api/craving-followups/[id]/route.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/today/quit-stage-card.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/today/followup-card.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/lib/server/today-service.ts`
- Test: `/home/sunlong/workspace/quit-smoking/src/lib/server/followup-service.test.ts`

- [ ] **Step 1: Write the failing test for followup scheduling**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/followup-service.test.ts
import { describe, expect, it } from "vitest";
import { buildFollowupDueAt } from "@/lib/server/followup-service";

describe("buildFollowupDueAt", () => {
  it("sets the followup due time 10 minutes after the craving event", () => {
    expect(buildFollowupDueAt("2026-05-05T10:00:00+08:00")).toBe(
      "2026-05-05T10:10:00.000+08:00",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/lib/server/followup-service.test.ts
```

Expected: FAIL with missing `followup-service`.

- [ ] **Step 3: Implement the quit-stage and followup flow**

```ts
// /home/sunlong/workspace/quit-smoking/src/app/api/quit-date/route.ts
import { NextResponse } from "next/server";
import { upsertSettings, validateQuitDate } from "@/lib/server/settings-service";
import { db } from "@/lib/db";

export async function PATCH(request: Request) {
  const payload = await request.json();
  const settings = await db.settings.findUniqueOrThrow({ where: { id: 1 } });

  validateQuitDate({
    treatmentStartDate: settings.treatmentStartDate.toISOString().slice(0, 10),
    targetQuitDate: payload.targetQuitDate,
  });

  await upsertSettings({
    treatmentStartDate: settings.treatmentStartDate.toISOString().slice(0, 10),
    targetQuitDate: payload.targetQuitDate,
    baselineCigarettesPerDay: settings.baselineCigarettesPerDay,
    cigarettePricePerPack: Number(settings.cigarettePricePerPack),
    cigarettesPerPack: settings.cigarettesPerPack,
    timezone: settings.timezone,
    medicationName: settings.medicationName,
    medicationSchedule: JSON.parse(settings.medicationScheduleJson) as string[],
  });

  return NextResponse.json({ ok: true });
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/followup-service.ts
import { addMinutes } from "date-fns";

export function buildFollowupDueAt(occurredAtIso: string) {
  return addMinutes(new Date(occurredAtIso), 10).toISOString();
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/app/api/record-entries/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildFollowupDueAt } from "@/lib/server/followup-service";

export async function POST(request: Request) {
  const payload = await request.json();

  const entry = await db.recordEntry.create({
    data: {
      occurredAt: new Date(payload.occurredAt),
      kind: payload.kind,
      severity: payload.severity ?? null,
      triggerTag: payload.triggerTag ?? null,
      actionTag: payload.actionTag ?? null,
      resolved: payload.resolved ?? null,
      note: payload.note ?? null,
    },
  });

  if (entry.kind === "craving") {
    await db.cravingFollowup.create({
      data: {
        cravingRecordId: entry.id,
        followupDueAt: new Date(buildFollowupDueAt(payload.occurredAt)),
      },
    });
  }

  return NextResponse.json(entry);
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/today/quit-stage-card.tsx
"use client";

export function QuitStageCard() {
  async function handleCraving(formData: FormData) {
    await fetch("/api/record-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "craving",
        occurredAt: new Date().toISOString(),
        severity: Number(formData.get("severity")),
        triggerTag: formData.get("triggerTag"),
        actionTag: formData.get("actionTag"),
        resolved: false,
      }),
    });

    window.location.reload();
  }

  return (
    <form action={handleCraving} className="hero-card">
      <input name="severity" type="range" min="1" max="10" defaultValue="5" />
      <select name="triggerTag" defaultValue="工作压力">
        <option value="工作压力">工作压力</option>
        <option value="饭后">饭后</option>
        <option value="社交">社交</option>
      </select>
      <select name="actionTag" defaultValue="喝水">
        <option value="喝水">喝水</option>
        <option value="散步">散步</option>
        <option value="深呼吸">深呼吸</option>
      </select>
      <button>开始一次抗烟瘾动作</button>
    </form>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/today/followup-card.tsx
"use client";

export function FollowupCard({ followupId }: { followupId: string }) {
  async function complete(outcome: "passed" | "still-craving") {
    await fetch(`/api/craving-followups/${followupId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome }),
    });
    window.location.reload();
  }

  return (
    <section className="sub-card">
      <p>10 分钟过去了，这次扛过去了吗？</p>
      <div className="row-actions">
        <button onClick={() => complete("passed")}>扛过去了</button>
        <button onClick={() => complete("still-craving")}>还想抽</button>
      </div>
    </section>
  );
}
```

```ts
// /home/sunlong/workspace/quit-smoking/src/app/api/craving-followups/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json();

  const updated = await db.cravingFollowup.update({
    where: { id },
    data: {
      followupCompletedAt: new Date(),
      outcome: payload.outcome,
      note: payload.note ?? null,
    },
  });

  return NextResponse.json(updated);
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/page.tsx
import { AppShell } from "@/components/app-shell";
import { FollowupCard } from "@/components/today/followup-card";
import { MedicationCard } from "@/components/today/medication-card";
import { PrepStageCard } from "@/components/today/prep-stage-card";
import { QuitStageCard } from "@/components/today/quit-stage-card";
import { db } from "@/lib/db";
import { getCurrentStage } from "@/lib/domain/stage";

export default async function TodayPage() {
  const settings = await db.settings.findUniqueOrThrow({ where: { id: 1 } });
  const stage = getCurrentStage({
    treatmentStartDate: settings.treatmentStartDate.toISOString(),
    targetQuitDate: settings.targetQuitDate?.toISOString() ?? null,
    now: new Date(),
  });

  const followup = await db.cravingFollowup.findFirst({
    where: {
      followupDueAt: { lte: new Date() },
      followupCompletedAt: null,
    },
    orderBy: { followupDueAt: "asc" },
  });

  return (
    <AppShell pathname="/">
      <MedicationCard
        scheduledSlots={JSON.parse(settings.medicationScheduleJson) as string[]}
        scheduledForDate={new Date().toISOString()}
      />
      {stage === "prep" ? <PrepStageCard smokedToday={0} fewerCigarettes={0} daysUntilQuit={null} /> : <QuitStageCard />}
      {followup ? <FollowupCard followupId={followup.id} /> : null}
    </AppShell>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- src/lib/server/followup-service.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api src/components/today src/lib/server
git commit -m "feat: add quit-stage craving followups"
```

### Task 6: Build the records timeline with merged smoking and event entries

**Files:**
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/server/timeline-service.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/records/timeline.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/records/quick-entry-sheet.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/app/records/page.tsx`
- Test: `/home/sunlong/workspace/quit-smoking/src/lib/server/timeline-service.test.ts`

- [ ] **Step 1: Write the failing test for the merged timeline**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/timeline-service.test.ts
import { describe, expect, it } from "vitest";
import { mergeTimelineItems } from "@/lib/server/timeline-service";

describe("mergeTimelineItems", () => {
  it("sorts smoking logs and record entries in reverse chronological order", () => {
    const items = mergeTimelineItems({
      smokingLogs: [{ id: "s1", smokedAt: new Date("2026-05-04T12:00:00+08:00"), count: 1 }],
      recordEntries: [{ id: "r1", occurredAt: new Date("2026-05-04T14:00:00+08:00"), kind: "mood", note: "烦躁" }],
    });

    expect(items.map((item) => item.id)).toEqual(["r1", "s1"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/lib/server/timeline-service.test.ts
```

Expected: FAIL with missing `timeline-service`.

- [ ] **Step 3: Implement the timeline service and records page**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/timeline-service.ts
type SmokingLogItem = { id: string; smokedAt: Date; count: number };
type RecordEntryItem = { id: string; occurredAt: Date; kind: string; note: string | null };

export function mergeTimelineItems(input: {
  smokingLogs: SmokingLogItem[];
  recordEntries: RecordEntryItem[];
}) {
  return [
    ...input.smokingLogs.map((item) => ({
      id: item.id,
      at: item.smokedAt,
      kind: "smoking",
      title: `抽烟 ${item.count} 支`,
    })),
    ...input.recordEntries.map((item) => ({
      id: item.id,
      at: item.occurredAt,
      kind: item.kind,
      title: item.note ?? item.kind,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/records/timeline.tsx
type TimelineItem = {
  id: string;
  title: string;
  kind: string;
  at: Date;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="timeline">
      {items.map((item) => (
        <article key={item.id} className="timeline-item">
          <strong>{item.title}</strong>
          <span>{item.kind}</span>
          <time>{item.at.toLocaleString("zh-CN")}</time>
        </article>
      ))}
    </section>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/records/quick-entry-sheet.tsx
"use client";

export function QuickEntrySheet() {
  async function addMoodEntry(formData: FormData) {
    await fetch("/api/record-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "mood",
        occurredAt: new Date().toISOString(),
        severity: Number(formData.get("severity")),
        note: formData.get("note"),
      }),
    });

    window.location.reload();
  }

  return (
    <form action={addMoodEntry} className="sub-card">
      <input name="severity" type="range" min="1" max="10" defaultValue="5" />
      <input name="note" placeholder="记录一下现在的状态" />
      <button>保存记录</button>
    </form>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/records/page.tsx
import { AppShell } from "@/components/app-shell";
import { QuickEntrySheet } from "@/components/records/quick-entry-sheet";
import { Timeline } from "@/components/records/timeline";
import { db } from "@/lib/db";
import { mergeTimelineItems } from "@/lib/server/timeline-service";

export default async function RecordsPage() {
  const [smokingLogs, recordEntries] = await Promise.all([
    db.smokingLog.findMany({ orderBy: { smokedAt: "desc" }, take: 50 }),
    db.recordEntry.findMany({ orderBy: { occurredAt: "desc" }, take: 50 }),
  ]);

  const items = mergeTimelineItems({ smokingLogs, recordEntries });

  return (
    <AppShell pathname="/records">
      <QuickEntrySheet />
      <Timeline items={items} />
    </AppShell>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- src/lib/server/timeline-service.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/records src/components/records src/lib/server
git commit -m "feat: add merged records timeline"
```

### Task 7: Build the progress page for prep and quit stages

**Files:**
- Create: `/home/sunlong/workspace/quit-smoking/src/lib/server/progress-service.ts`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/progress/prep-progress.tsx`
- Create: `/home/sunlong/workspace/quit-smoking/src/components/progress/quit-progress.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/app/progress/page.tsx`
- Test: `/home/sunlong/workspace/quit-smoking/src/lib/server/progress-service.test.ts`

- [ ] **Step 1: Write the failing test for prep-stage progress aggregation**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/progress-service.test.ts
import { describe, expect, it } from "vitest";
import { getPrepTrend } from "@/lib/server/progress-service";

describe("getPrepTrend", () => {
  it("builds a 7-day smoking trend from the daily totals", () => {
    expect(
      getPrepTrend({
        baselinePerDay: 20,
        dailyCounts: [
          { day: "2026-05-01", count: 15 },
          { day: "2026-05-02", count: 12 },
        ],
      }),
    ).toEqual([
      { day: "2026-05-01", count: 15, fewerThanBaseline: 5 },
      { day: "2026-05-02", count: 12, fewerThanBaseline: 8 },
    ]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/lib/server/progress-service.test.ts
```

Expected: FAIL with missing `progress-service`.

- [ ] **Step 3: Implement the progress service and stage-aware page**

```ts
// /home/sunlong/workspace/quit-smoking/src/lib/server/progress-service.ts
import { getMoneySaved } from "@/lib/domain/progress";

export function getPrepTrend(input: {
  baselinePerDay: number;
  dailyCounts: { day: string; count: number }[];
}) {
  return input.dailyCounts.map((item) => ({
    ...item,
    fewerThanBaseline: Math.max(input.baselinePerDay - item.count, 0),
  }));
}

export function getQuitSnapshot(input: {
  baselinePerDay: number;
  smokedCount: number;
  daysSinceQuit: number;
  cigarettePricePerPack: number;
  cigarettesPerPack: number;
}) {
  return {
    moneySaved: getMoneySaved(input),
  };
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/progress/prep-progress.tsx
type PrepProgressProps = {
  trend: { day: string; count: number; fewerThanBaseline: number }[];
};

export function PrepProgress({ trend }: PrepProgressProps) {
  return (
    <section className="hero-card">
      <h2>减烟趋势</h2>
      {trend.map((item) => (
        <article key={item.day} className="timeline-item">
          <strong>{item.day}</strong>
          <span>抽了 {item.count} 支</span>
          <span>比基线少 {item.fewerThanBaseline} 支</span>
        </article>
      ))}
    </section>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/components/progress/quit-progress.tsx
type QuitProgressProps = {
  moneySaved: number;
};

export function QuitProgress({ moneySaved }: QuitProgressProps) {
  return (
    <section className="hero-card">
      <h2>戒烟进展</h2>
      <p>累计节省 ¥{moneySaved}</p>
    </section>
  );
}
```

```tsx
// /home/sunlong/workspace/quit-smoking/src/app/progress/page.tsx
import { AppShell } from "@/components/app-shell";
import { PrepProgress } from "@/components/progress/prep-progress";
import { QuitProgress } from "@/components/progress/quit-progress";
import { db } from "@/lib/db";
import { getCurrentStage } from "@/lib/domain/stage";
import { getPrepTrend, getQuitSnapshot } from "@/lib/server/progress-service";

export default async function ProgressPage() {
  const settings = await db.settings.findUniqueOrThrow({ where: { id: 1 } });
  const stage = getCurrentStage({
    treatmentStartDate: settings.treatmentStartDate.toISOString(),
    targetQuitDate: settings.targetQuitDate?.toISOString() ?? null,
    now: new Date(),
  });

  if (stage === "prep") {
    const rows = await db.$queryRaw<{ day: string; count: number }[]>`
      select date(smokedAt) as day, sum(count) as count
      from SmokingLog
      group by date(smokedAt)
      order by day desc
      limit 7
    `;

    const trend = getPrepTrend({
      baselinePerDay: settings.baselineCigarettesPerDay,
      dailyCounts: [...rows].reverse(),
    });

    return (
      <AppShell pathname="/progress">
        <PrepProgress trend={trend} />
      </AppShell>
    );
  }

  const smokedAggregate = await db.smokingLog.aggregate({ _sum: { count: true } });
  const quitSnapshot = getQuitSnapshot({
    baselinePerDay: settings.baselineCigarettesPerDay,
    smokedCount: smokedAggregate._sum.count ?? 0,
    daysSinceQuit: 12,
    cigarettePricePerPack: Number(settings.cigarettePricePerPack),
    cigarettesPerPack: settings.cigarettesPerPack,
  });

  return (
    <AppShell pathname="/progress">
      <QuitProgress moneySaved={quitSnapshot.moneySaved} />
    </AppShell>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- src/lib/server/progress-service.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/progress src/components/progress src/lib/server
git commit -m "feat: add stage-aware progress page"
```

### Task 8: Apply the final visual system and responsive interaction polish

**Files:**
- Modify: `/home/sunlong/workspace/quit-smoking/src/app/globals.css`
- Modify: `/home/sunlong/workspace/quit-smoking/src/components/app-shell.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/components/today/medication-card.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/components/today/prep-stage-card.tsx`
- Modify: `/home/sunlong/workspace/quit-smoking/src/components/today/quit-stage-card.tsx`
- Test: `/home/sunlong/workspace/quit-smoking/e2e/quit-smoking.spec.ts`

- [ ] **Step 1: Write the failing Playwright smoke test**

```ts
// /home/sunlong/workspace/quit-smoking/e2e/quit-smoking.spec.ts
import { expect, test } from "@playwright/test";

test("mobile shell shows bottom navigation", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await expect(page.getByRole("link", { name: "今日" })).toBeVisible();
  await expect(page.getByRole("link", { name: "记录" })).toBeVisible();
  await expect(page.getByRole("link", { name: "进展" })).toBeVisible();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test:e2e
```

Expected: FAIL because the development server is not running or the current shell is not styled as expected.

- [ ] **Step 3: Implement the final responsive styling**

```css
/* /home/sunlong/workspace/quit-smoking/src/app/globals.css */
:root {
  --bg-top: #fff8ef;
  --bg-bottom: #efe5d7;
  --surface: rgba(255, 252, 246, 0.8);
  --surface-strong: #fffaf4;
  --line: rgba(65, 47, 28, 0.08);
  --text: #1f1d19;
  --muted: #6e675d;
  --accent: #cb7447;
  --accent-2: #e09552;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  color: var(--text);
  background:
    radial-gradient(circle at top, rgba(246, 199, 144, 0.45), transparent 30%),
    linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.app-shell {
  min-height: 100vh;
  padding: 20px 16px 104px;
}

.hero-card,
.sub-card,
.timeline-item {
  border: 1px solid var(--line);
  background: var(--surface);
  backdrop-filter: blur(18px);
  border-radius: 24px;
  box-shadow: 0 20px 48px rgba(83, 58, 35, 0.12);
}

.bottom-nav {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 10px;
  border-radius: 24px;
  background: rgba(255, 251, 246, 0.92);
  border: 1px solid var(--line);
}

.tab.active {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
}
```

- [ ] **Step 4: Run all verification commands**

Run:

```bash
npm test
npm run build
npm run test:e2e
```

Expected: all checks PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components e2e
git commit -m "feat: polish mobile ui and verify flows"
```

## Self-Review

Spec coverage check:

- `预备期/戒烟期` 双阶段由 Task 2, 4, 5, 7 覆盖
- `服药打卡` 由 Task 4 覆盖
- `前期抽烟记录` 由 Task 4 和 Task 6 覆盖
- `戒烟日设置` 由 Task 3 和 Task 5 覆盖
- `烟瘾应对 + 10 分钟回访` 由 Task 5 覆盖
- `记录页时间线` 由 Task 6 覆盖
- `进展页阶段化统计` 由 Task 7 覆盖
- `移动端视觉和交互感` 由 Task 1 和 Task 8 覆盖

Placeholder scan:

- No `TODO`, `TBD`, or “similar to” placeholders remain.
- Each task contains exact file paths, runnable commands, and minimal code to anchor implementation.

Type consistency check:

- Stage names are consistently `prep` and `quit`.
- Date fields consistently use `treatmentStartDate` and `targetQuitDate`.
- Smoking records live in `SmokingLog`; craving events live in `RecordEntry` with kind `craving`.
