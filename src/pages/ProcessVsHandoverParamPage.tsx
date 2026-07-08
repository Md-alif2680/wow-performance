import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Gauge, Target, XCircle } from "lucide-react";
import { HandoverParamRow, WeekConfig } from "../data/hubData";
import { Card, CardHeader, CHART_COLORS, DeltaBadge, KpiCard, PageHeader, pctFmt, StatusPill, Table, td, th, tooltipStyle } from "../components/ui";

const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

export default function ProcessVsHandoverParamPage({ rows, weeks }: { rows: HandoverParamRow[]; weeks: WeekConfig }) {
  const wA = weeks.weekA, wB = weeks.weekB;
  const achA = rows.filter((h) => h.statusA === "Achieved").length;
  const achB = rows.filter((h) => h.statusB === "Achieved").length;
  const failB = rows.length - achB;
  const avgB12B = avg(rows.map((h) => h.before12amProcessed.b));
  const avgB12A = avg(rows.map((h) => h.before12amProcessed.a));
  const avg4B = avg(rows.map((h) => h.fourthSlotRatio.b));
  const avg4A = avg(rows.map((h) => h.fourthSlotRatio.a));

  const donutA = [{ name: "Achieved", value: achA, color: CHART_COLORS.green }, { name: "Std. Fail", value: rows.length - achA, color: CHART_COLORS.red }];
  const donutB = [{ name: "Achieved", value: achB, color: CHART_COLORS.green }, { name: "Std. Fail", value: failB, color: CHART_COLORS.red }];

  const b12 = rows.map((h) => ({ hub: h.hub, [wA]: h.before12amProcessed.a, [wB]: h.before12amProcessed.b }));
  const gap = rows.map((h) => ({ hub: h.hub, gap: h.before12amProcessed.b - h.before12amProcessed.a })).sort((a, b) => b.gap - a.gap);
  const ratio = rows.map((h) => ({ hub: h.hub, [`${wA} 4th Slot`]: h.fourthSlotRatio.a, [`${wB} 4th Slot`]: h.fourthSlotRatio.b }));

  return (
    <div className="space-y-6">
      <PageHeader title="Process Vs Handover Parameter" subtitle={`Before-12AM processed & 4th-slot handover — ${wA} vs ${wB}`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard label={`${wB} Achieved`} value={`${achB} / ${rows.length}`} icon={<CheckCircle2 className="h-4 w-4" />} tone="green" delta={achB - achA} deltaLabel={`vs ${wA}`} />
        <KpiCard label={`${wB} Std. Fail`} value={String(failB)} icon={<XCircle className="h-4 w-4" />} tone="red" />
        <KpiCard label="Avg B12AM Processed" value={`${avgB12B.toFixed(2)}%`} icon={<Gauge className="h-4 w-4" />} tone="cyan" delta={avgB12B - avgB12A} deltaLabel="pts" />
        <KpiCard label="Avg 4th Slot Ratio" value={`${avg4B.toFixed(2)}%`} icon={<Target className="h-4 w-4" />} tone="purple" delta={avg4B - avg4A} deltaLabel="pts" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader title={`${wA} Status`} subtitle="Achieved vs Standard Fail" />
          <div className="h-52 px-2 pb-4"><ResponsiveContainer width="100%" height="100%"><PieChart>
            <Pie data={donutA} dataKey="value" innerRadius="50%" outerRadius="78%" paddingAngle={4} strokeWidth={0}>{donutA.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie>
            <Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
          </PieChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <CardHeader title={`${wB} Status`} subtitle="Achieved vs Standard Fail" />
          <div className="h-52 px-2 pb-4"><ResponsiveContainer width="100%" height="100%"><PieChart>
            <Pie data={donutB} dataKey="value" innerRadius="50%" outerRadius="78%" paddingAngle={4} strokeWidth={0}>{donutB.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie>
            <Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
          </PieChart></ResponsiveContainer></div>
        </Card>
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader title="Week Gap (B12AM)" subtitle={`${wB} − ${wA} improvement`} />
          <div className="h-52 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={gap.slice(0, 10)} layout="vertical" margin={{ top: 2, right: 16, left: 16, bottom: 2 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis type="category" dataKey="hub" width={78} tick={{ fontSize: 9, fill: "#94a3b8" }} interval={0} />
              <Tooltip contentStyle={tooltipStyle} formatter={pctFmt} />
              <ReferenceLine x={0} stroke="#475569" />
              <Bar dataKey="gap" name="Gap" radius={[0, 3, 3, 0]} maxBarSize={10}>{gap.slice(0, 10).map((d) => <Cell key={d.hub} fill={d.gap >= 0 ? CHART_COLORS.green : CHART_COLORS.red} />)}</Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Before 12AM Processed Ratio" subtitle={`${wA} vs ${wB} with 85% benchmark`} />
        <div className="h-80 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
          <BarChart data={b12} margin={{ top: 5, right: 8, left: -14, bottom: 42 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={pctFmt} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            <ReferenceLine y={85} stroke={CHART_COLORS.amber} strokeDasharray="6 4" label={{ value: "85%", fill: CHART_COLORS.amber, fontSize: 10, position: "insideTopRight" }} />
            <Bar dataKey={wA} fill="#475569" radius={[3, 3, 0, 0]} maxBarSize={13} />
            <Bar dataKey={wB} fill={CHART_COLORS.cyan} radius={[3, 3, 0, 0]} maxBarSize={13} />
          </BarChart>
        </ResponsiveContainer></div>
      </Card>

      <Card>
        <CardHeader title="4th Slot Handover Ratio" subtitle={`${wA} vs ${wB}`} />
        <div className="h-72 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
          <BarChart data={ratio} margin={{ top: 5, right: 8, left: -14, bottom: 42 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={pctFmt} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            <Bar dataKey={`${wA} 4th Slot`} fill={CHART_COLORS.purple} radius={[3, 3, 0, 0]} maxBarSize={13} />
            <Bar dataKey={`${wB} 4th Slot`} fill={CHART_COLORS.pink} radius={[3, 3, 0, 0]} maxBarSize={13} />
          </BarChart>
        </ResponsiveContainer></div>
      </Card>

      <Card>
        <CardHeader title="Process Vs Handover Parameter — Full Data" />
        <Table head={<>
          <th className={`${th} text-center text-cyan-400`} colSpan={4}>{wA}</th>
          <th className={`${th} text-center text-emerald-400`} colSpan={4}>{wB}</th>
          <th className={`${th} text-center text-violet-400`} colSpan={3}>4th Slot Ratio</th>
        </>}>
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
            <td className={th}>Hub Name</td>

            <td className={th}>B12AM</td><td className={th}>4th HO</td><td className={th}>Status</td><td className={th}>Results</td>
            <td className={th}>B12AM</td><td className={th}>4th HO</td><td className={th}>Status</td><td className={th}>Gap</td>
            <td className={th}>{wA}</td><td className={th}>{wB}</td><td className={th}>Results</td>
          </tr>
          {rows.map((h) => {
            const db = h.before12amProcessed.b - h.before12amProcessed.a;
            const d4 = h.fourthSlotRatio.b - h.fourthSlotRatio.a;
            return (
              <tr key={h.hub} className="hover:bg-slate-800/30 transition-colors">
                <td className={`${td} font-semibold text-slate-100 sticky left-0 bg-slate-900/90 z-[1]`}>{h.hub}</td>
                <td className={td}>{h.before12amProcessed.a.toFixed(2)}%</td>
                <td className={td}>{h.fourthSlotHandover.a.toFixed(2)}%</td>
                <td className={td}><StatusPill status={h.statusA} /></td>
                <td className={td}><DeltaBadge value={-db} /></td>
                <td className={`${td} font-medium text-slate-100`}>{h.before12amProcessed.b.toFixed(2)}%</td>
                <td className={`${td} font-medium text-slate-100`}>{h.fourthSlotHandover.b.toFixed(2)}%</td>
                <td className={td}><StatusPill status={h.statusB} /></td>
                <td className={td}><DeltaBadge value={db} /></td>
                <td className={td}>{h.fourthSlotRatio.a.toFixed(2)}%</td>
                <td className={`${td} font-medium text-slate-100`}>{h.fourthSlotRatio.b.toFixed(2)}%</td>
                <td className={td}><DeltaBadge value={d4} /></td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
