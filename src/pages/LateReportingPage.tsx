import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlarmClock, TrendingDown, TrendingUp, Users } from "lucide-react";
import { LateRow, WeekConfig } from "../data/hubData";
import { Card, CardHeader, CHART_COLORS, KpiCard, PageHeader, Table, td, th, tooltipStyle } from "../components/ui";
import { cn } from "../utils/cn";

export default function LateReportingPage({ rows, weeks }: { rows: LateRow[]; weeks: WeekConfig }) {
  const wA = weeks.weekA, wB = weeks.weekB;
  const lateA = rows.reduce((s, h) => s + h.totalLate.a, 0);
  const lateB = rows.reduce((s, h) => s + h.totalLate.b, 0);
  const improved = rows.filter((h) => h.totalLate.b < h.totalLate.a).length;
  const worst = [...rows].sort((a, b) => b.totalLate.b - a.totalLate.b)[0];
  const ranked = [...rows].sort((a, b) => b.totalLate.b - a.totalLate.b);

  const bars = rows.map((h) => ({ hub: h.hub, [`Late ${wA}`]: h.totalLate.a, [`Late ${wB}`]: h.totalLate.b }));

  return (
    <div className="space-y-6">
      <PageHeader title="Resources Late Reporting" subtitle={`Late reporting incidents — ${wA} vs ${wB}`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard label={`Total Late ${wA}`} value={String(lateA)} icon={<AlarmClock className="h-4 w-4" />} tone="blue" />
        <KpiCard label={`Total Late ${wB}`} value={String(lateB)} icon={<AlarmClock className="h-4 w-4" />}
          tone={lateB <= lateA ? "green" : "red"} delta={lateA > 0 ? ((lateB - lateA) / lateA) * 100 : 0} deltaLabel={`vs ${wA}`} />
        <KpiCard label={`Worst Hub (${wB})`} value={worst?.hub ?? "—"} icon={<Users className="h-4 w-4" />} tone="amber" />
        <KpiCard label="Hubs Improved" value={`${improved} / ${rows.length}`} icon={<Users className="h-4 w-4" />} tone="cyan" />
      </div>

      <Card>
        <CardHeader title="Late Incidents by Hub" subtitle={`${wA} vs ${wB}`} />
        <div className="h-80 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 5, right: 8, left: -22, bottom: 42 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            <Bar dataKey={`Late ${wA}`} fill="#475569" radius={[3, 3, 0, 0]} maxBarSize={13} />
            <Bar dataKey={`Late ${wB}`} fill={CHART_COLORS.amber} radius={[3, 3, 0, 0]} maxBarSize={13} />
          </BarChart>
        </ResponsiveContainer></div>
      </Card>

      <Card>
        <CardHeader title="Late Reporting Leaderboard" subtitle={`Ranked by ${wB} total late — with ratio`} />
        <Table head={<>
          <th className={th}>Rank</th>
          <th className={th}>Hub Name</th>
          <th className={th}>{wA} Total Late</th>
          <th className={th}>{wA} Late Ratio</th>
          <th className={th}>{wB} Total Late</th>
          <th className={th}>{wB} Late Ratio</th>
          <th className={th}>Results</th>
        </>}>
          {ranked.map((h, i) => {
            const diff = h.totalLate.b - h.totalLate.a;
            return (
              <tr key={h.hub} className="hover:bg-slate-800/30 transition-colors">
                <td className={td}>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">{i + 1}</span>
                </td>
                <td className={`${td} font-semibold text-slate-100`}>{h.hub}</td>
                <td className={td}>{h.totalLate.a}</td>
                <td className={td}>{h.lateRatio.a.toFixed(2)}%</td>
                <td className={`${td} font-medium text-slate-100`}>{h.totalLate.b}</td>
                <td className={`${td} font-medium text-slate-100`}>{h.lateRatio.b.toFixed(2)}%</td>
                <td className={td}>
                  <ResultArrow diff={diff} />
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

function ResultArrow({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-slate-500 text-[11px] font-bold">—</span>;
  const up = diff > 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-bold", up ? "text-rose-400" : "text-emerald-400")}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "▲" : "▼"}
    </span>
  );
}
