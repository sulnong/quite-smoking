import { differenceInCalendarDays, format, subDays } from "date-fns";

import { AppShell } from "@/components/app-shell";
import { PrepProgress } from "@/components/progress/prep-progress";
import { QuitProgress } from "@/components/progress/quit-progress";
import { db } from "@/lib/db";
import { getCurrentStage } from "@/lib/domain/stage";
import { getPrepTrend, getQuitSnapshot } from "@/lib/server/progress-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const settings = await db.settings.findUniqueOrThrow({ where: { id: 1 } });
  const stage = getCurrentStage({
    treatmentStartDate: settings.treatmentStartDate.toISOString(),
    targetQuitDate: settings.targetQuitDate?.toISOString() ?? null,
    now: new Date()
  });

  if (stage === "prep") {
    const startDate = subDays(new Date(), 6);
    startDate.setHours(0, 0, 0, 0);

    const smokingLogs = await db.smokingLog.findMany({
      where: {
        smokedAt: {
          gte: startDate
        }
      },
      orderBy: {
        smokedAt: "asc"
      }
    });

    const dailyMap = new Map<string, number>();

    for (const log of smokingLogs) {
      const day = format(log.smokedAt, "yyyy-MM-dd");
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + log.count);
    }

    const trend = getPrepTrend({
      baselinePerDay: settings.baselineCigarettesPerDay,
      dailyCounts: Array.from({ length: 7 }, (_, index) => {
        const day = format(subDays(new Date(), 6 - index), "yyyy-MM-dd");
        return {
          day,
          count: dailyMap.get(day) ?? 0
        };
      })
    });

    return (
      <AppShell pathname="/progress">
        <section className="page-intro">
          <div className="page-intro__eyebrow">进展页</div>
          <h1 className="page-intro__title">先看减烟曲线，别急着追求一次到位。</h1>
          <p className="page-intro__copy">预备期的关键不是完美，而是把数量趋势拉下来，为正式戒烟日做准备。</p>
        </section>
        <PrepProgress baselinePerDay={settings.baselineCigarettesPerDay} trend={trend} />
      </AppShell>
    );
  }

  const smokedAggregate = await db.smokingLog.aggregate({
    _sum: { count: true },
    where: settings.targetQuitDate
      ? {
          smokedAt: {
            gte: settings.targetQuitDate
          }
        }
      : undefined
  });

  const daysSinceQuit = settings.targetQuitDate
    ? differenceInCalendarDays(new Date(), settings.targetQuitDate) + 1
    : 1;

  const quitSnapshot = getQuitSnapshot({
    baselinePerDay: settings.baselineCigarettesPerDay,
    smokedCount: smokedAggregate._sum.count ?? 0,
    daysSinceQuit,
    cigarettePricePerPack: Number(settings.cigarettePricePerPack),
    cigarettesPerPack: settings.cigarettesPerPack
  });

  return (
    <AppShell pathname="/progress">
      <section className="page-intro">
        <div className="page-intro__eyebrow">进展页</div>
        <h1 className="page-intro__title">继续把每一天累出来，数字会慢慢替你说话。</h1>
        <p className="page-intro__copy">戒烟期优先看连续天数和节省金额，帮助你把已经得到的收益具体化。</p>
      </section>
      <QuitProgress
        moneySaved={quitSnapshot.moneySaved}
        daysSinceQuit={daysSinceQuit}
        baselinePerDay={settings.baselineCigarettesPerDay}
      />
    </AppShell>
  );
}
