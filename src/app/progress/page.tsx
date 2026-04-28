import { AppShell } from "@/components/app-shell";

export default function Page() {
  return (
    <AppShell pathname="/progress">
      <h1 style={{ margin: 0, fontSize: 18 }}>进展</h1>
      <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.55 }}>
        这里将展示趋势、里程碑和连续天数等。
      </p>
    </AppShell>
  );
}

