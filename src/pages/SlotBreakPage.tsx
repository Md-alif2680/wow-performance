import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ShieldAlert, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { SlotBreakRow, WeekConfig } from "../data/hubData";
import { Card, CardHeader, CHART_COLORS, DeltaBadge, KpiCard, PageHeader, Table, td, th, tooltipStyle } from "../components/ui";
import { cn } from "../utils/cn";

export default function SlotBreakPage({ rows, weeks }: { rows: SlotBreakRow[]; weeks: WeekConfig }) {
  const wA = weeks.weekA, wB = weeks.weekB;
  const brkA = rows.reduce((s, h) => s + h.totalBreak.a, 0);
  const brkB = rows.reduce((s, h) => s + h.totalBreak.b, 0);
  const clean = rows.filter((h) => h.totalBreak.b === 0).length;
  const worst = [...rows].sort((a, b) => b.totalBreak.b - a.totalBreak.b)[0];
  const improved = rows.filter((h) => h.totalBreak.b < h.totalBreak.a).length;

  const bars = rows.map((h) => ({ hub: h.hub, [`Break ${wA}`]: h.totalBreak.a, [`Break ${wB}`]: h.totalBreak.b }));
  const variance = rows.map((h) => ({ hub: h.hub, variance: h.totalBreak.b - h.totalBreak.a })).sort((a, b) => b.variance - a.variance);

  return (
    <div className="space-y-6">
      <PageHeader title="Slot Break Analysis" subtitle={`IB slot SOP break compliance violations — ${wA} vs ${wB}`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        <KpiCard label={`Total Breaks ${wA}`} value={String(brkA)} icon={<ShieldAlert className="h-4 w-4" />} tone="blue" />
        <KpiCard label={`Total Breaks ${wB}`} value={String(brkB)} icon={<ShieldAlert className="h-4 w-4" />}
          tone={brkB <= brkA ? "green" : "red"} delta={brkA > 0 ? ((brkB - brkA) / brkA) * 100 : 0} deltaLabel={`vs ${wA}`} />
        <KpiCard label={`Worst Hub (${wB})`} value={worst?.hub ?? "—"} icon={<ShieldAlert className="h-4 w-4" />} tone="amber" />
        <KpiCard label="Zero-Break Hubs" value={`${clean} / ${rows.length}`} icon={<ShieldCheck className="h-4 w-4" />} tone="green" />
        <KpiCard label="Hubs Improved" value={`${improved} / ${rows.length}`} icon={<TrendingDown className="h-4 w-4" />} tone="cyan" />
      </div>

      <Card>
        <CardHeader title="SOP Breaks by Hub" subtitle={`${wA} vs ${wB}`} />
        <div className="h-80 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 5, right: 8, left: -22, bottom: 42 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            <Bar dataKey={`Break ${wA}`} fill="#475569" radius={[3, 3, 0, 0]} maxBarSize={13} />
            <Bar dataKey={`Break ${wB}`} fill={CHART_COLORS.pink} radius={[3, 3, 0, 0]} maxBarSize={13} />
          </BarChart>
        </ResponsiveContainer></div>
      </Card>

      <Card>
        <CardHeader title={`Variance (${wB} − ${wA})`} subtitle="Positive = more breaks · Negative = improvement" />
        <div className="h-72 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
          <BarChart data={variance} margin={{ top: 5, right: 8, left: -22, bottom: 42 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="variance" name="Variance" radius={[3, 3, 0, 0]} maxBarSize={20}>
              {variance.map((d) => <Cell key={d.hub} fill={d.variance > 0 ? CHART_COLORS.red : d.variance < 0 ? CHART_COLORS.green : "#475569"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer></div>
      </Card>

      <Card>
        <CardHeader title="IB Slot SOP Break — Full Data" subtitle="All hubs with variance" />
        <Table head={<>
          <th className={th}>Hub Name</th>
          <th className={th}>{wA} Total Break</th>
          <th className={th}>{wB} Total Break</th>
          <th className={th}>Variance</th>
        </>}>
          {[...rows].sort((a, b) => b.totalBreak.b - a.totalBreak.b).map((h) => {
            const v = h.totalBreak.b - h.totalBreak.a;
            return (
              <tr key={h.hub} className="hover:bg-slate-800/30 transition-colors">
                <td className={`${td} font-semibold text-slate-100`}>{h.hub}</td>
                <td className={td}>{h.totalBreak.a}</td>
                <td className={td}>
                  <span className={cn(
                    "inline-flex min-w-6 items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold",
                    h.totalBreak.b > h.totalBreak.a ? "bg-rose-500/15 text-rose-400"
                      : h.totalBreak.b < h.totalBreak.a ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-700/40 text-slate-400"
                  )}>{h.totalBreak.b}</span>
                </td>
                <td className={td}>
                  {v === 0 ? <span className="text-slate-500 text-[11px] font-bold">—</span> : (
                    <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-bold", v > 0 ? "text-rose-400" : "text-emerald-400")}>
                      {v > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <DeltaBadge value={v} digits={0} suffix="" invert />
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
