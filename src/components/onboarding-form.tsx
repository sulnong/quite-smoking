"use client";

import { useState } from "react";

export function OnboardingForm() {
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);

    await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        treatmentStartDate: formData.get("treatmentStartDate"),
        baselineCigarettesPerDay: Number(formData.get("baselineCigarettesPerDay")),
        cigarettePricePerPack: Number(formData.get("cigarettePricePerPack")),
        cigarettesPerPack: Number(formData.get("cigarettesPerPack")),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        medicationName: "酒石酸伐尼克兰",
        medicationSchedule: [formData.get("morningTime"), formData.get("eveningTime")].filter(
          Boolean
        )
      })
    });

    window.location.reload();
  }

  return (
    <section className="panel panel--hero">
      <div className="panel__eyebrow">首次设置</div>
      <h1 className="panel__title">先把疗程和基线定清楚</h1>
      <p className="panel__copy">
        基线按你最近 7 天平均每天抽多少支来计算，后面的减烟趋势和节省金额都会基于这个数字。
      </p>
      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field field--plain">
          <span className="field__label">开始服药日期</span>
          <input name="treatmentStartDate" type="date" defaultValue={today} required />
        </label>
        <label className="field field--plain">
          <span className="field__label">近 7 天日均支数（基线）</span>
          <input name="baselineCigarettesPerDay" type="number" min="1" defaultValue="15" required />
        </label>
        <label className="field field--plain">
          <span className="field__label">每包价格</span>
          <input name="cigarettePricePerPack" type="number" min="1" step="0.01" defaultValue="25" required />
        </label>
        <label className="field field--plain">
          <span className="field__label">每包支数</span>
          <input name="cigarettesPerPack" type="number" min="1" defaultValue="20" required />
        </label>
        <label className="field field--plain">
          <span className="field__label">推荐晨间时间</span>
          <input name="morningTime" type="time" defaultValue="08:00" required />
        </label>
        <label className="field field--plain">
          <span className="field__label">推荐晚间时间</span>
          <input name="eveningTime" type="time" defaultValue="20:00" required />
        </label>
        <p className="helper-copy helper-copy--plain">
          用药节奏：前 3 天 `0.5mg 每日 1 次`，接下来 4 天 `0.5mg 每日 2 次`，第 8 天起
          `1mg 每日 2 次`。
        </p>
        <button className="primary-button primary-button--dark" disabled={submitting} type="submit">
          {submitting ? "保存中..." : "开始记录"}
        </button>
      </form>
    </section>
  );
}
