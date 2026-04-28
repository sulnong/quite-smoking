/*
  Warnings:

  - You are about to drop the `SmokeRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SmokeRecord";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "treatmentStartDate" DATETIME NOT NULL,
    "targetQuitDate" DATETIME,
    "baselineCigarettesPerDay" INTEGER NOT NULL,
    "cigarettePricePerPack" DECIMAL NOT NULL,
    "cigarettesPerPack" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "medicationScheduleJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MedicationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scheduledForDate" DATETIME NOT NULL,
    "scheduledSlot" TEXT NOT NULL,
    "takenAt" DATETIME,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SmokingLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "smokedAt" DATETIME NOT NULL,
    "count" INTEGER NOT NULL,
    "contextTag" TEXT,
    "triggerTag" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecordEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurredAt" DATETIME NOT NULL,
    "kind" TEXT NOT NULL,
    "severity" INTEGER,
    "triggerTag" TEXT,
    "actionTag" TEXT,
    "resolved" BOOLEAN,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CravingFollowup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cravingRecordId" TEXT NOT NULL,
    "followupDueAt" DATETIME NOT NULL,
    "followupCompletedAt" DATETIME,
    "outcome" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CravingFollowup_cravingRecordId_key" ON "CravingFollowup"("cravingRecordId");
