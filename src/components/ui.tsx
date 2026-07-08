import { ReactNode } from "react";
import { cn } from "../utils/cn";
import { TrendingDown, TrendingUp } from "lucide-react";

export const CHART_COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  purple: "#8b5cf6",
  red: "#ef4444",
  amber: "#f59e0b",
  cyan: "#06b6d4",
  pink: "#ec4899",
};

export const pctFmt = (v: unknown) => `${Number(v ?? 0).toFixed(2)}%`;
export const numFmt = (v: unknown) => Number(v ?? 0).toLocaleString();

export const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "0.75rem",
  fontSize: "12px",
  color: "#e2e8f0",
  boxShadow: "0 10px 30px rgba(0,0,0,.5)",
};

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur",
        "shadow-[0_4px_24px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-2">
      <div>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

const kpiGradients: Record<string, string> = {
  blue: "from-blue-600/25 to-blue-500/5 border-blue-500/30",
  green: "from-emerald-600/25 to-emerald-500/5 border-emerald-500/30",
  red: "from-rose-600/25 to-rose-500/5 border-rose-500/30",
  purple: "from-violet-600/25 to-violet-500/5 border-violet-500/30",
  cyan: "from-cyan-600/25 to-cyan-500/5 border-cyan-500/30",
  amber: "from-amber-600/25 to-amber-500/5 border-amber-500/30",
};

const kpiIconBg: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-400",
  green: "bg-emerald-500/20 text-emerald-400",
  red: "bg-rose-500/20 text-rose-400",
  purple: "bg-violet-500/20 text-violet-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  amber: "bg-amber-500/20 text-amber-400",
};

export function KpiCard({
  label,
  value,
  icon,
  tone = "blue",
  delta,
  deltaLabel,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: keyof typeof kpiGradients;
  delta?: number;
  deltaLabel?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 sm:p-5",
        kpiGradients[tone]
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            kpiIconBg[tone]
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-1 text-2xl font-bold text-white sm:text-[26px]">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-medium",
            delta >= 0 ? "text-emerald-400" : "text-rose-400"
          )}
        >
          {delta >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {Math.abs(delta).toFixed(2)}%{deltaLabel ? ` ${deltaLabel}` : ""}
        </p>
      )}
    </div>
  );
}

export function DeltaBadge({
  value,
  digits = 2,
  suffix = "%",
  invert = false,
}: {
  value: number;
  digits?: number;
  suffix?: string;
  invert?: boolean;
}) {
  const up = value >= 0;
  const good = invert ? value <= 0 : value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
        good ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(digits)}
      {suffix}
    </span>
  );
}

export function StatusPill({ status }: { status: "Achieved" | "Standard Fail" }) {
  const ok = status === "Achieved";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        ok
          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
          : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-emerald-400" : "bg-rose-400")} />
      {ok ? "Achieved" : "Std. Fail"}
    </span>
  );
}

export function Table({
  head,
  children,
}: {
  head: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto px-2 pb-3">
      <table className="w-full min-w-[700px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
            {head}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">{children}</tbody>
      </table>
    </div>
  );
}

export const th = "px-3 py-2.5 font-semibold whitespace-nowrap";
export const td = "px-3 py-2.5 tabular-nums text-slate-300 whitespace-nowrap";
