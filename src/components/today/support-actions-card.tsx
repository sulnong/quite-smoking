"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

const ACTIONS = [
  {
    title: "喝水",
    description: "先让嘴和手有替代动作，把点烟的惯性打断。"
  },
  {
    title: "深呼吸",
    description: "慢慢吸气和呼气 4 轮，先把这一波紧绷感卸下来。"
  },
  {
    title: "转移注意力",
    description: "起身走动、刷牙或换个环境，让冲动不在原地发酵。"
  }
];

export function SupportActionsCard() {
  const [isPending, startTransition] = useTransition();
  const [timerMinutes, setTimerMinutes] = useState<3 | 5>(3);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const timerTotalSeconds = timerMinutes * 60;
  const progress = useMemo(() => {
    if (remainingSeconds === 0) {
      return 0;
    }

    return ((timerTotalSeconds - remainingSeconds) / timerTotalSeconds) * 360;
  }, [remainingSeconds, timerTotalSeconds]);

  const timerLabel = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(
    remainingSeconds % 60
  ).padStart(2, "0")}`;

  function logSupportAction(actionTag: string) {
    startTransition(async () => {
      await fetch("/api/record-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "support",
          occurredAt: new Date().toISOString(),
          actionTag,
          note: `${actionTag} 自助动作`
        })
      });

      window.location.reload();
    });
  }

  return (
    <section className="panel">
      <div className="panel__eyebrow">替代动作</div>
      <h2 className="panel__title">没烟瘾的时候，也先把这些动作练熟</h2>
      <p className="panel__copy">等烟瘾真的上来时，越熟悉的动作越容易立刻接上。</p>
      <div className="timer-card">
        <div
          className={remainingSeconds > 0 ? "timer-ring is-running" : "timer-ring"}
          style={{
            background: `conic-gradient(var(--accent) ${progress}deg, rgba(30, 111, 92, 0.1) 0deg)`
          }}
        >
          <div className={remainingSeconds > 0 ? "timer-ring__inner is-running" : "timer-ring__inner"}>
            <span className="timer-ring__label">{remainingSeconds > 0 ? "进行中" : "呼吸计时"}</span>
            <strong className="timer-ring__time">{remainingSeconds > 0 ? timerLabel : `${timerMinutes} 分钟`}</strong>
          </div>
        </div>
        <div className="timer-actions">
          <button
            type="button"
            className={timerMinutes === 3 ? "secondary-button secondary-button--compact is-selected" : "secondary-button secondary-button--compact"}
            onClick={() => setTimerMinutes(3)}
          >
            3 分钟
          </button>
          <button
            type="button"
            className={timerMinutes === 5 ? "secondary-button secondary-button--compact is-selected" : "secondary-button secondary-button--compact"}
            onClick={() => setTimerMinutes(5)}
          >
            5 分钟
          </button>
          <button
            type="button"
            className="primary-button primary-button--dark"
            onClick={() => setRemainingSeconds(timerMinutes * 60)}
          >
            {remainingSeconds > 0 ? "重新开始" : "开始倒计时"}
          </button>
        </div>
      </div>
      <div className="support-grid">
        {ACTIONS.map((action) => (
          <button
            key={action.title}
            type="button"
            className="support-card"
            disabled={isPending}
            onClick={() => logSupportAction(action.title)}
          >
            <strong className="support-card__title">{action.title}</strong>
            <span className="support-card__desc">{action.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
