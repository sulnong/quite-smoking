type SmokingLogItem = {
  id: string;
  smokedAt: Date;
  count: number;
  contextTag?: string | null;
  triggerTag?: string | null;
  note?: string | null;
};

type RecordEntryItem = {
  id: string;
  occurredAt: Date;
  kind: string;
  note: string | null;
};

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
      detail: [item.contextTag, item.triggerTag ? `烟瘾后 ${item.triggerTag}` : null, item.note]
        .filter(Boolean)
        .join(" · ")
    })),
    ...input.recordEntries.map((item) => ({
      id: item.id,
      at: item.occurredAt,
      kind: item.kind,
      title: item.note ?? item.kind
    }))
  ].sort((a, b) => b.at.getTime() - a.at.getTime());
}
