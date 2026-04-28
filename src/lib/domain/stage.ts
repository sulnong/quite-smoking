import { addDays, formatISO, isBefore, startOfDay } from "date-fns";

export type Stage = "prep" | "quit";

export type StageInput = {
  treatmentStartDate: string;
  targetQuitDate: string | null;
  now: Date;
};

export function getCurrentStage(input: StageInput): Stage {
  if (!input.targetQuitDate) return "prep";

  // Compare by calendar day to avoid surprising stage flips due to time-of-day.
  const nowDay = startOfDay(input.now);
  const quitDay = startOfDay(new Date(input.targetQuitDate));

  return isBefore(nowDay, quitDay) ? "prep" : "quit";
}

export function getQuitWindow(treatmentStartDate: string): {
  earliest: string;
  latest: string;
} {
  const start = startOfDay(new Date(treatmentStartDate));

  return {
    // Day 8 (inclusive) relative to the treatment start day.
    earliest: formatISO(addDays(start, 7), { representation: "date" }),
    // Day 35 (inclusive) relative to the treatment start day.
    latest: formatISO(addDays(start, 34), { representation: "date" }),
  };
}

