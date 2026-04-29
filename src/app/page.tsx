import { AppShell } from "@/components/app-shell";
import { FollowupCard } from "@/components/today/followup-card";
import { OnboardingForm } from "@/components/onboarding-form";
import { MedicationCard } from "@/components/today/medication-card";
import { PrepStageCard } from "@/components/today/prep-stage-card";
import { QuitStageCard } from "@/components/today/quit-stage-card";
import { SupportActionsCard } from "@/components/today/support-actions-card";
import { db } from "@/lib/db";
import { getMedicationPlanForDate, getTreatmentDay } from "@/lib/domain/medication-plan";
import { getQuitWindow } from "@/lib/domain/stage";
import { buildPrepStageSummary } from "@/lib/server/today-service";
import { differenceInCalendarDays } from "date-fns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
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

  const [smokedToday, medicationLogs, followup] = await Promise.all([
    db.smokingLog.aggregate({
      _sum: { count: true },
      where: {
        smokedAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }),
    db.medicationLog.findMany({
      where: {
        scheduledForDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: "taken"
      },
      orderBy: {
        takenAt: "asc"
      }
    }),
    db.cravingFollowup.findFirst({
      where: {
        followupDueAt: {
          lte: new Date()
        },
        followupCompletedAt: null
      },
      orderBy: {
        followupDueAt: "asc"
      }
    })
  ]);

  const summary = buildPrepStageSummary({
    baselinePerDay: settings.baselineCigarettesPerDay,
    smokedToday: smokedToday._sum.count ?? 0,
    treatmentStartDate: settings.treatmentStartDate.toISOString(),
    targetQuitDate: settings.targetQuitDate?.toISOString() ?? null,
    now: new Date()
  });

  const scheduledSlots = JSON.parse(settings.medicationScheduleJson) as string[];
  const medicationPlan = getMedicationPlanForDate({
    treatmentStartDate: settings.treatmentStartDate.toISOString().slice(0, 10),
    date: new Date().toISOString().slice(0, 10),
    morningTime: scheduledSlots[0] ?? "08:00",
    eveningTime: scheduledSlots[1] ?? "20:00"
  });
  const quitWindow = getQuitWindow(settings.treatmentStartDate.toISOString().slice(0, 10));
  const daysSinceQuit = settings.targetQuitDate
    ? differenceInCalendarDays(new Date(), settings.targetQuitDate) + 1
    : 0;
  const treatmentDay = getTreatmentDay({
    treatmentStartDate: settings.treatmentStartDate.toISOString().slice(0, 10),
    date: new Date().toISOString().slice(0, 10)
  });
  const medicationComplete = medicationLogs.length >= medicationPlan.slots.length;

  return (
    <AppShell pathname="/">
      <section className="page-intro">
        <div className="page-intro__eyebrow">今日计划</div>
        <h1 className="page-intro__title">把今天过稳，第 8 天后再正式进入戒烟日。</h1>
        <p className="page-intro__copy">
          现在先按时服药、真实记录抽烟数量。你不需要一开始就完美，只需要持续把数据记下来。
        </p>
      </section>
      {medicationComplete ? null : (
        <MedicationCard
          treatmentDay={treatmentDay}
          planSummary={medicationPlan.summary}
          planDescription={medicationPlan.description}
          slots={medicationPlan.slots}
          scheduledForDate={startOfDay.toISOString()}
          completedLogs={medicationLogs.map((log) => ({
            scheduledSlot: log.scheduledSlot,
            takenAt: log.takenAt?.toISOString() ?? null,
            doseMg: log.doseMg ?? null
          }))}
        />
      )}
      {summary.stage === "prep" ? (
        <PrepStageCard
          treatmentDay={treatmentDay}
          baselinePerDay={settings.baselineCigarettesPerDay}
          smokedToday={summary.smokedToday}
          fewerCigarettes={summary.fewerCigarettes}
          daysUntilQuit={summary.daysUntilQuit}
          reductionRate={summary.reductionRate}
          targetQuitDate={settings.targetQuitDate?.toISOString().slice(0, 10) ?? null}
          quitWindow={quitWindow}
        />
      ) : (
        <QuitStageCard daysSinceQuit={daysSinceQuit} />
      )}
      <SupportActionsCard />
      {followup ? <FollowupCard followupId={followup.id} /> : null}
    </AppShell>
  );
}
