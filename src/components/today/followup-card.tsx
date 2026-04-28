"use client";

import { useTransition } from "react";

export function FollowupCard({ followupId }: { followupId: string }) {
  const [isPending, startTransition] = useTransition();

  function complete(outcome: "passed" | "still-craving") {
    startTransition(async () => {
      await fetch(`/api/craving-followups/${followupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome })
      });

      window.location.reload();
    });
  }

  return (
    <section className="panel">
      <div className="panel__eyebrow">10 分钟回访</div>
      <h2 className="panel__title">这次扛过去了吗？</h2>
      <p className="panel__copy">如果还在想抽，也没关系，先把这次状态记下来，再继续下一轮动作。</p>
      <div className="split-actions">
        <button className="secondary-button" type="button" disabled={isPending} onClick={() => complete("passed")}>
          扛过去了
        </button>
        <button className="secondary-button" type="button" disabled={isPending} onClick={() => complete("still-craving")}>
          还想抽
        </button>
      </div>
    </section>
  );
}
