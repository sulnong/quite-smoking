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
    smokedToday: input.smokedToday
  });

  return {
    stage: getCurrentStage(input),
    smokedToday: input.smokedToday,
    fewerCigarettes: reduction.fewerCigarettes,
    reductionRate: reduction.reductionRate,
    daysUntilQuit: input.targetQuitDate
      ? differenceInCalendarDays(new Date(input.targetQuitDate), input.now)
      : null
  };
}
