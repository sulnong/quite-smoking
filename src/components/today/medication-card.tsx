"use client";

import { format } from "date-fns";
import { useState, useTransition } from "react";

type MedicationCardProps = {
  treatmentDay: number;
  planSummary: string;
  planDescription: string;
  slots: {
    label: "早" | "晚";
    time: string;
    doseMg: 0.5 | 1;
  }[];
  scheduledForDate: string;
  completedLogs: {
    scheduledSlot: string;
    takenAt: string | null;
    doseMg: number | null;
  }[];
};

export function MedicationCard(props: MedicationCardProps) {
  const [isPending, startTransition] = useTransition();
  const defaultCurrentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const [draftTimes, setDraftTimes] = useState<Record<string, string>>(
    Object.fromEntries(props.slots.map((slot) => [slot.time, defaultCurrentTime]))
  );
  const [draftDoses, setDraftDoses] = useState<Record<string, string>>(
    Object.fromEntries(props.slots.map((slot) => [slot.time, String(slot.doseMg)]))
  );

  function markTaken(slotTime: string) {
    startTransition(async () => {
      const localDate = props.scheduledForDate.slice(0, 10);
      const actualTime = draftTimes[slotTime] ?? slotTime;
      const actualDose = Number(draftDoses[slotTime] ?? "0.5");

      await fetch("/api/medication-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledForDate: props.scheduledForDate,
          scheduledSlot: slotTime,
          doseMg: actualDose,
          takenAt: new Date(`${localDate}T${actualTime}:00`).toISOString()
        })
      });

      window.location.reload();
    });
  }

  return (
    <section className="panel panel--hero">
      <div className="panel__eyebrow">治疗节奏</div>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">今日服药安排</h2>
          <p className="panel__copy">
            疗程第 {props.treatmentDay} 天，{props.planSummary}。{props.planDescription}
          </p>
        </div>
        <div className="pill pill--soft">{props.completedLogs.length}/{props.slots.length}</div>
      </div>
      <div className="slot-grid">
        {props.slots.map((slot) => {
          const completedLog = props.completedLogs.find((log) => log.scheduledSlot === slot.time);
          const done = Boolean(completedLog);

          return (
            <div key={`${slot.label}-${slot.time}`} className={done ? "slot-card is-done" : "slot-card"}>
              <span className="slot-card__time">
                {slot.label} {slot.time}
              </span>
              <span className="slot-card__dose">推荐 {slot.doseMg}mg</span>
              <label className="slot-card__field">
                <span>实际剂量</span>
                <select
                  value={draftDoses[slot.time] ?? String(slot.doseMg)}
                  disabled={done || isPending}
                  onChange={(event) =>
                    setDraftDoses((current) => ({ ...current, [slot.time]: event.target.value }))
                  }
                >
                  <option value="0.5">0.5mg</option>
                  <option value="1">1mg</option>
                </select>
              </label>
              <label className="slot-card__field">
                <span>实际时间</span>
                <input
                  type="time"
                  value={draftTimes[slot.time] ?? slot.time}
                  disabled={done || isPending}
                  onChange={(event) =>
                    setDraftTimes((current) => ({ ...current, [slot.time]: event.target.value }))
                  }
                />
              </label>
              <span className="slot-card__label">
                {done && completedLog?.takenAt
                  ? `已记录 ${completedLog.doseMg ?? slot.doseMg}mg / ${format(new Date(completedLog.takenAt), "HH:mm")}`
                  : "填写后保存实际服药情况"}
              </span>
              <button
                type="button"
                className="secondary-button secondary-button--compact"
                disabled={done || isPending}
                onClick={() => markTaken(slot.time)}
              >
                {done ? "已记录" : "保存服药记录"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
