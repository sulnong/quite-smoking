type TimelineItem = {
  id: string;
  title: string;
  kind: string;
  at: Date;
};

const KIND_LABELS: Record<string, string> = {
  smoking: "抽烟记录",
  mood: "状态记录",
  craving: "烟瘾记录",
  support: "替代动作"
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="panel">
      <div className="panel__eyebrow">时间线</div>
      <h2 className="panel__title">最近记录</h2>
      <div className="timeline">
        {items.map((item) => (
          <article key={item.id} className="timeline-item">
            <div>
              <strong className="timeline-item__title">{item.title}</strong>
              <span className="timeline-item__kind">{KIND_LABELS[item.kind] ?? item.kind}</span>
            </div>
            <time className="timeline-item__time">{item.at.toLocaleString("zh-CN")}</time>
          </article>
        ))}
      </div>
    </section>
  );
}
