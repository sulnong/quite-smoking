"use client";

import { useRouter } from "next/navigation";
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

const BODY_MILESTONES = [
  {
    label: "20 分钟",
    description: "心率和血压开始回落，身体从第一刻就知道你停下来了。"
  },
  {
    label: "2 小时",
    description: "尼古丁开始明显下降，手痒和嘴馋会更活跃，替代动作开始派上用场。"
  },
  {
    label: "24 小时",
    description: "一氧化碳水平明显下降，身体开始把氧气运得更顺。"
  },
  {
    label: "3 天",
    description: "体内尼古丁基本代谢完，烟瘾波动会比较明显，但也最值得扛过去。"
  },
  {
    label: "5 天",
    description: "味觉和嗅觉会继续回弹，日常触发点开始慢慢松动。"
  }
];

export function SupportActionsCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [timerMinutes, setTimerMinutes] = useState<3 | 5>(3);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  const timerTotalSeconds = timerMinutes * 60;
  const progress = useMemo(() => {
    if (remainingSeconds === 0) {
      return 0;
    }

    return ((timerTotalSeconds - remainingSeconds) / timerTotalSeconds) * 100;
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

      router.refresh();
    });
  }

  function startTimer() {
    setRemainingSeconds(timerMinutes * 60);
    setIsRunning(true);
  }

  function toggleTimer() {
    setIsRunning((current) => !current);
  }

  function resetTimer() {
    setIsRunning(false);
    setRemainingSeconds(0);
  }

  return (
    <section className="panel">
      <div className="panel__eyebrow">替代动作</div>
      <h2 className="panel__title">没烟瘾的时候，也先把这些动作练熟</h2>
      <p className="panel__copy">等烟瘾真的上来时，越熟悉的动作越容易立刻接上。</p>
      <div className="timer-card">
        <div className={isRunning ? "timer-ring is-running" : "timer-ring"}>
          <svg className="timer-ring__svg" viewBox="0 0 180 180" aria-hidden="true">
            <circle className="timer-ring__track" cx="90" cy="90" r="74" pathLength="100" />
            <circle
              className="timer-ring__progress"
              cx="90"
              cy="90"
              r="74"
              pathLength="100"
              style={{ strokeDasharray: `${progress} 100` }}
            />
          </svg>
          <div className={isRunning ? "timer-ring__inner is-running" : "timer-ring__inner"}>
            <span className="timer-ring__label">{remainingSeconds > 0 ? "呼吸计时" : "准备开始"}</span>
            <strong className="timer-ring__time">{remainingSeconds > 0 ? timerLabel : `${timerMinutes} 分钟`}</strong>
            <span className="timer-ring__hint">
              {isRunning ? "跟着呼吸起伏，慢慢把这一波顶过去。" : "点一下开始，先练熟 3 分钟或 5 分钟的缓冲。"}
            </span>
          </div>
        </div>
        <div className="timer-actions">
          <button
            type="button"
            className={timerMinutes === 3 ? "secondary-button secondary-button--compact is-selected" : "secondary-button secondary-button--compact"}
            disabled={remainingSeconds > 0}
            onClick={() => setTimerMinutes(3)}
          >
            3 分钟
          </button>
          <button
            type="button"
            className={timerMinutes === 5 ? "secondary-button secondary-button--compact is-selected" : "secondary-button secondary-button--compact"}
            disabled={remainingSeconds > 0}
            onClick={() => setTimerMinutes(5)}
          >
            5 分钟
          </button>
        </div>
        <div className="timer-controls">
          {remainingSeconds === 0 ? (
            <button type="button" className="primary-button primary-button--dark" onClick={startTimer}>
              开始倒计时
            </button>
          ) : (
            <>
              <button type="button" className="primary-button primary-button--dark" onClick={toggleTimer}>
                {isRunning ? "暂停" : "继续"}
              </button>
              <button type="button" className="secondary-button" onClick={resetTimer}>
                重置
              </button>
            </>
          )}
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
      <div className="milestone-board">
        <div className="panel__eyebrow">身体状态变化</div>
        <div className="milestone-list">
          {BODY_MILESTONES.map((milestone) => (
            <article key={milestone.label} className="milestone-card">
              <strong className="milestone-card__time">{milestone.label}</strong>
              <p className="milestone-card__copy">{milestone.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
