type QuitProgressProps = {
  moneySaved: number;
  daysSinceQuit: number;
  baselinePerDay: number;
};

export function QuitProgress({ moneySaved, daysSinceQuit, baselinePerDay }: QuitProgressProps) {
  return (
    <section className="panel panel--accent">
      <div className="panel__eyebrow">戒烟进展</div>
      <h2 className="panel__title">你已经进入稳定的无烟阶段</h2>
      <p className="panel__copy">累计节省按基线 {baselinePerDay} 支/天、你填写的价格和戒烟后记录推算。</p>
      <div className="metric-strip">
        <div className="metric-chip">
          <span className="metric-chip__label">无烟天数</span>
          <strong className="metric-chip__value">{daysSinceQuit} 天</strong>
        </div>
        <div className="metric-chip">
          <span className="metric-chip__label">累计节省</span>
          <strong className="metric-chip__value">¥{moneySaved}</strong>
        </div>
      </div>
    </section>
  );
}
