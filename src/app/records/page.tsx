import { AppShell } from "@/components/app-shell";

export default function Page() {
  return (
    <AppShell pathname="/records">
      <h1 style={{ margin: 0, fontSize: 18 }}>记录</h1>
      <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.55 }}>
        这里将展示吸烟记录列表和新增记录入口。
      </p>
    </AppShell>
  );
}

