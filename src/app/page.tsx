import { AppShell } from "@/components/app-shell";

export default function Page() {
  return (
    <AppShell pathname="/">
      <h1 style={{ margin: 0, fontSize: 18 }}>今日</h1>
      <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.55 }}>
        这里将展示今天的目标和快速记录入口。
      </p>
    </AppShell>
  );
}

