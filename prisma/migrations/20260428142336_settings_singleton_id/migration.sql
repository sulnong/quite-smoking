/*
  Purpose:
  Align Settings singleton semantics with the schema: Settings.id is a fixed singleton key
  (default 1) rather than an autoincrementing id.

  SQLite does not support altering PRIMARY KEY/AUTOINCREMENT in place, so we rebuild.
*/

PRAGMA foreign_keys=off;

CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
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

INSERT INTO "new_Settings" (
  "id",
  "treatmentStartDate",
  "targetQuitDate",
  "baselineCigarettesPerDay",
  "cigarettePricePerPack",
  "cigarettesPerPack",
  "timezone",
  "medicationName",
  "medicationScheduleJson",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "treatmentStartDate",
  "targetQuitDate",
  "baselineCigarettesPerDay",
  "cigarettePricePerPack",
  "cigarettesPerPack",
  "timezone",
  "medicationName",
  "medicationScheduleJson",
  "createdAt",
  "updatedAt"
FROM "Settings";

DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";

PRAGMA foreign_keys=on;
