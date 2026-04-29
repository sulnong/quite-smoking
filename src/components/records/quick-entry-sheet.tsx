"use client";

import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";

export function QuickEntrySheet() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const defaultDateTime = useMemo(() => formatDateTimeLocal(new Date()), []);

  function addSmokingEntry(formData: FormData) {
    startTransition(async () => {
      const smokedAt = String(formData.get("smokedAt") || "").trim();
      const urgeDelayMinutes = String(formData.get("urgeDelayMinutes") || "").trim();

      await fetch("/api/smoking-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smokedAt: smokedAt || new Date().toISOString(),
          count: Number(formData.get("count") || 1),
          contextTag: String(formData.get("contextTag") || "").trim() || null,
          triggerTag: urgeDelayMinutes ? `${urgeDelayMinutes} 分钟` : null,
          note: formData.get("note")
        })
      });

      router.refresh();
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addSmokingEntry(new FormData(event.currentTarget));
  }

  return (
    <section className="panel panel--hero">
      <div className="panel__eyebrow">抽烟记录</div>
      <h2 className="panel__title">把这一支怎么抽的，完整记下来</h2>
      <p className="panel__copy">这里是真正记录抽烟的地方。时间、状态和拖了多久才点烟，都会一起记进时间线。</p>
      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field field--plain">
          <span className="field__label">抽烟时间</span>
          <input name="smokedAt" type="datetime-local" defaultValue={defaultDateTime} />
        </label>
        <label className="field field--plain">
          <span className="field__label">抽了几支</span>
          <input name="count" type="number" min="1" defaultValue="1" required />
        </label>
        <label className="field field--plain">
          <span className="field__label">抽烟时的状态</span>
          <select name="contextTag" defaultValue="烦躁">
            <option value="烦躁">烦躁</option>
            <option value="压力大">压力大</option>
            <option value="社交场景">社交场景</option>
            <option value="饭后">饭后</option>
            <option value="提神">提神</option>
            <option value="习惯性点烟">习惯性点烟</option>
          </select>
        </label>
        <label className="field field--plain">
          <span className="field__label">从烟瘾来到点烟，隔了多久（分钟）</span>
          <input name="urgeDelayMinutes" type="number" min="0" step="1" placeholder="不填就按当下立刻抽" />
        </label>
        <label className="field field--plain">
          <span className="field__label">一句备注</span>
          <input name="note" placeholder="比如：开会前扛了十几分钟还是点了" />
        </label>
        <button className="secondary-button" type="submit" disabled={isPending}>
          {isPending ? "保存中..." : "保存记录"}
        </button>
      </form>
    </section>
  );
}

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
