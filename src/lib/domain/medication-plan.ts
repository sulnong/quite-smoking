import { differenceInCalendarDays, startOfDay } from "date-fns";

export type MedicationSlot = {
  label: "早" | "晚";
  time: string;
  doseMg: 0.5 | 1;
};

export function getTreatmentDay(input: { treatmentStartDate: string; date: string }) {
  return differenceInCalendarDays(
    startOfDay(new Date(input.date)),
    startOfDay(new Date(input.treatmentStartDate))
  ) + 1;
}

export function getMedicationPlanForDate(input: {
  treatmentStartDate: string;
  date: string;
  morningTime: string;
  eveningTime: string;
}) {
  const treatmentDay = getTreatmentDay(input);

  if (treatmentDay <= 3) {
    return {
      treatmentDay,
      summary: "0.5mg 每日 1 次",
      description: "开始 3 天建议晨间服用，先让身体适应。",
      slots: [{ label: "早" as const, time: input.morningTime, doseMg: 0.5 as const }]
    };
  }

  if (treatmentDay <= 7) {
    return {
      treatmentDay,
      summary: "0.5mg 每日 2 次",
      description: "接下来 4 天早晚各 1 次，继续预备期减烟。",
      slots: [
        { label: "早" as const, time: input.morningTime, doseMg: 0.5 as const },
        { label: "晚" as const, time: input.eveningTime, doseMg: 0.5 as const }
      ]
    };
  }

  return {
    treatmentDay,
    summary: "1mg 每日 2 次",
    description: "从第 8 天起进入维持阶段，通常也是正式戒烟窗口。",
    slots: [
      { label: "早" as const, time: input.morningTime, doseMg: 1 as const },
      { label: "晚" as const, time: input.eveningTime, doseMg: 1 as const }
    ]
  };
}
