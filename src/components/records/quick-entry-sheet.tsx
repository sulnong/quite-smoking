"use client";

import { useTransition } from "react";

export function QuickEntrySheet() {
  const [isPending, startTransition] = useTransition();

  function addMoodEntry(formData: FormData) {
    startTransition(async () => {
      await fetch("/api/record-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "mood",
          occurredAt: new Date().toISOString(),
          severity: Number(formData.get("severity")),
          note: formData.get("note")
        })
      });

      window.location.reload();
    });
  }

  return (
    <section className="panel panel--hero">
      <div className="panel__eyebrow">快速补记</div>
      <h2 className="panel__title">把这一刻留档</h2>
      <p className="panel__copy">除了抽烟数量，也把心情、烦躁感或者想抽的诱因记下来。</p>
      <form className="stack-form" action={addMoodEntry}>
        <label className="field field--plain">
          <span className="field__label">当前强度</span>
          <input name="severity" type="range" min="1" max="10" defaultValue="5" />
        </label>
        <label className="field field--plain">
          <span className="field__label">一句备注</span>
          <input name="note" placeholder="比如：下午开会前特别烦躁" />
        </label>
        <button className="secondary-button" type="submit" disabled={isPending}>
          {isPending ? "保存中..." : "保存记录"}
        </button>
      </form>
    </section>
  );
}
