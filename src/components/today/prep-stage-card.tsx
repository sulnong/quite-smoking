"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type PrepStageCardProps = {
  treatmentDay: number;
  baselinePerDay: number;
  smokedToday: number;
  fewerCigarettes: number;
  daysUntilQuit: number | null;
  reductionRate: number;
  targetQuitDate: string | null;
  quitWindow: {
    earliest: string;
    latest: string;
  };
};

export function PrepStageCard(props: PrepStageCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateQuitDate(formData: FormData) {
    startTransition(async () => {
      await fetch("/api/quit-date", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetQuitDate: formData.get("targetQuitDate")
        })
      });

      router.refresh();
    });
  }

  function handleQuitDateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuitDate(new FormData(event.currentTarget));
  }

  return (
    <section className="panel panel--accent">
      <div className="panel__eyebrow">预备期</div>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">今天先稳住节奏</h2>
          <p className="panel__copy">前 7 天继续服药并正常记录抽烟情况。你当前处于疗程第 {props.treatmentDay} 天。</p>
        </div>
      </div>
      <div className="baseline-note">
        基线按建档时填写的最近 7 天日均 <strong>{props.baselinePerDay} 支/天</strong> 计算。
      </div>
      <div className="metric-strip">
        <div className="metric-chip">
          <span className="metric-chip__label">今日已抽</span>
          <strong className="metric-chip__value">{props.smokedToday} 支</strong>
        </div>
        <div className="metric-chip">
          <span className="metric-chip__label">比基线少抽</span>
          <strong className="metric-chip__value">{props.fewerCigarettes} 支</strong>
        </div>
        <div className="metric-chip">
          <span className="metric-chip__label">减少比例</span>
          <strong className="metric-chip__value">{Math.round(props.reductionRate * 100)}%</strong>
        </div>
      </div>
      <div className="countdown-card">
        <span className="countdown-card__label">
          {props.daysUntilQuit === null ? "还没有设置戒烟日" : "距离戒烟日"}
        </span>
        <strong className="countdown-card__value">
          {props.daysUntilQuit === null ? "尽快设定" : `${props.daysUntilQuit} 天`}
        </strong>
      </div>
      <form className="stack-form" onSubmit={handleQuitDateSubmit}>
        <label className="field">
          <span className="field__label">正式戒烟日</span>
          <input
            name="targetQuitDate"
            type="date"
            min={props.quitWindow.earliest}
            max={props.quitWindow.latest}
            defaultValue={props.targetQuitDate ?? props.quitWindow.earliest}
            disabled={isPending}
            required
          />
        </label>
        <p className="helper-copy">
          默认正式戒烟日是第 8 天，即 {props.quitWindow.earliest}。你也可以改到更靠后的日期，范围到
          {props.quitWindow.latest}。
        </p>
        <button className="secondary-button" type="submit" disabled={isPending}>
          {props.targetQuitDate ? "更新正式戒烟日" : "设置正式戒烟日"}
        </button>
      </form>
    </section>
  );
}
