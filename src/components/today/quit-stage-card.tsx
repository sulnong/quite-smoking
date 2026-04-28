"use client";

import { useTransition } from "react";

export function QuitStageCard({ daysSinceQuit }: { daysSinceQuit: number }) {
  const [isPending, startTransition] = useTransition();

  function handleCraving(formData: FormData) {
    startTransition(async () => {
      await fetch("/api/record-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "craving",
          occurredAt: new Date().toISOString(),
          severity: Number(formData.get("severity")),
          triggerTag: formData.get("triggerTag"),
          actionTag: formData.get("actionTag"),
          resolved: false
        })
      });

      window.location.reload();
    });
  }

  function handleCravingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleCraving(new FormData(event.currentTarget));
  }

  return (
    <section className="panel panel--accent">
      <div className="panel__eyebrow">正式戒烟期</div>
      <h2 className="panel__title">已经进入无烟阶段</h2>
      <p className="panel__copy">烟瘾出现时先做一个动作，10 分钟后再回来确认这次状态。</p>
      <div className="countdown-card">
        <span className="countdown-card__label">无烟进度</span>
        <strong className="countdown-card__value">第 {Math.max(daysSinceQuit, 1)} 天</strong>
      </div>
      <div className="baseline-note baseline-note--on-accent">
        没有明显烟瘾时，也可以先做替代动作，让身体更熟悉非吸烟的缓冲方式。
      </div>
      <form className="stack-form" onSubmit={handleCravingSubmit}>
        <label className="field">
          <span className="field__label">这次烟瘾有多强</span>
          <input name="severity" type="range" min="1" max="10" defaultValue="5" />
        </label>
        <label className="field">
          <span className="field__label">触发场景</span>
          <select name="triggerTag" defaultValue="工作压力">
            <option value="工作压力">工作压力</option>
            <option value="饭后">饭后</option>
            <option value="社交">社交</option>
          </select>
        </label>
        <label className="field">
          <span className="field__label">准备做什么</span>
          <select name="actionTag" defaultValue="喝水">
            <option value="喝水">喝水</option>
            <option value="散步">散步</option>
            <option value="深呼吸">深呼吸</option>
          </select>
        </label>
        <button className="primary-button" type="submit" disabled={isPending}>
          {isPending ? "记录中..." : "开始一次抗烟瘾动作"}
        </button>
      </form>
    </section>
  );
}
