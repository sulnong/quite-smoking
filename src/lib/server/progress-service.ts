import { getMoneySaved } from "@/lib/domain/progress";

export function getPrepTrend(input: {
  baselinePerDay: number;
  dailyCounts: { day: string; count: number }[];
}) {
  return input.dailyCounts.map((item) => ({
    ...item,
    fewerThanBaseline: Math.max(input.baselinePerDay - item.count, 0)
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
    moneySaved: getMoneySaved(input)
  };
}
