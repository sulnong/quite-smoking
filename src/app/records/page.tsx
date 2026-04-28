import { AppShell } from "@/components/app-shell";
import { QuickEntrySheet } from "@/components/records/quick-entry-sheet";
import { Timeline } from "@/components/records/timeline";
import { db } from "@/lib/db";
import { mergeTimelineItems } from "@/lib/server/timeline-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const [smokingLogs, recordEntries] = await Promise.all([
    db.smokingLog.findMany({ orderBy: { smokedAt: "desc" }, take: 50 }),
    db.recordEntry.findMany({ orderBy: { occurredAt: "desc" }, take: 50 })
  ]);

  const items = mergeTimelineItems({ smokingLogs, recordEntries });

  return (
    <AppShell pathname="/records">
      <section className="page-intro">
        <div className="page-intro__eyebrow">记录页</div>
        <h1 className="page-intro__title">把抽烟、情绪和烟瘾事件放到同一条时间线上。</h1>
        <p className="page-intro__copy">回看时更容易发现自己是在什么场景下最容易抽、最容易扛住。</p>
      </section>
      <QuickEntrySheet />
      <Timeline items={items} />
    </AppShell>
  );
}
