import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Building2, CheckCircle2, Package, Trophy, XCircle } from "lucide-react";
import { DashboardData, WP } from "../data/hubData";
import { Card, CardHeader, CHART_COLORS, DeltaBadge, KpiCard, PageHeader, pctFmt, StatusPill, Table, td, th, tooltipStyle } from "../components/ui";

const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
const d = (p: WP) => p.b - p.a;

export default function Overview({ data }: { data: DashboardData }) {
  const { weeks: w, arrival, handoverParam: hp, processVsHandover: pvh, late, slotBreak: sb } = data;
  const wA = w.weekA, wB = w.weekB;

  const achieved = hp.filter((h) => h.statusB === "Achieved");
  const failed = hp.filter((h) => h.statusB !== "Achieved");
  const procB = pvh.reduce((s, h) => s + h.processed.b, 0);
  const procA = pvh.reduce((s, h) => s + h.processed.a, 0);
  const avgHO = avg(hp.map((h) => h.before12amProcessed.b));
  const avgHOPrev = avg(hp.map((h) => h.before12amProcessed.a));
  const avg4 = avg(hp.map((h) => h.fourthSlotHandover.b));
  const avg4Prev = avg(hp.map((h) => h.fourthSlotHandover.a));

  const donut = [
    { name: "Achieved", value: achieved.length, color: CHART_COLORS.green },
    { name: "Std. Fail", value: failed.length, color: CHART_COLORS.red },
  ];

  const arrStack = arrival.map((h) => ({
    hub: h.hub,
    "Before 7PM": h.before7pm.b, "Before 9PM": h.before9pm.b,
    "Before 11PM": h.before11pm.b, "After 11PM": h.after11pm.b,
  }));

  const hoBars = hp.map((h) => ({
    hub: h.hub, [`${wA} Handover`]: h.before12amProcessed.a, [`${wB} Handover`]: h.before12amProcessed.b,
  }));

  const top5 = [...hp].sort((a, b) => b.fourthSlotHandover.b - a.fourthSlotHandover.b).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle={`${wB} performance summary — all ${arrival.length} Dhaka hubs`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Hubs" value={String(arrival.length)} icon={<Building2 className="h-4 w-4" />} tone="blue" />
        <KpiCard label={`${wB} Achieved`} value={String(achieved.length)} icon={<CheckCircle2 className="h-4 w-4" />} tone="green" />
        <KpiCard label={`${wB} Std. Fail`} value={String(failed.length)} icon={<XCircle className="h-4 w-4" />} tone="red" />
        <KpiCard label={`${wB} Processed`} value={procB.toLocaleString()} icon={<Package className="h-4 w-4" />} tone="purple"
          delta={procA > 0 ? ((procB - procA) / procA) * 100 : 0} deltaLabel={`vs ${wA}`} />
        <KpiCard label={`${wB} Avg Handover`} value={`${avgHO.toFixed(1)}%`} icon={<Activity className="h-4 w-4" />} tone="cyan"
          delta={avgHO - avgHOPrev} deltaLabel="pts" />
        <KpiCard label={`${wB} Before 12AM`} value={`${avg4.toFixed(1)}%`} icon={<Trophy className="h-4 w-4" />} tone="amber"
          delta={avg4 - avg4Prev} deltaLabel="pts" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title={`Handover Status (${wB})`} subtitle="Achieved vs Standard Fail" />
          <div className="flex items-center justify-center h-64 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius="55%" outerRadius="80%" paddingAngle={4} strokeWidth={0}>
                  {donut.map((x) => <Cell key={x.name} fill={x.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title={`Arrival Slots (${wB})`} subtitle="Distribution by time slot" />
          <div className="h-64 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={arrStack} stackOffset="expand" margin={{ top: 5, right: 8, left: -18, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hub" angle={-48} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
                <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={pctFmt} />
                <Bar dataKey="Before 7PM" stackId="a" fill={CHART_COLORS.blue} />
                <Bar dataKey="Before 9PM" stackId="a" fill={CHART_COLORS.purple} />
                <Bar dataKey="Before 11PM" stackId="a" fill={CHART_COLORS.green} />
                <Bar dataKey="After 11PM" stackId="a" fill={CHART_COLORS.red} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={`Handover Ratio (${wA} vs ${wB})`} subtitle="Before 12AM processed comparison" />
          <div className="h-72 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoBars} margin={{ top: 5, right: 8, left: -14, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hub" angle={-48} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={pctFmt} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey={`${wA} Handover`} fill={CHART_COLORS.blue} radius={[3, 3, 0, 0]} maxBarSize={13} />
                <Bar dataKey={`${wB} Handover`} fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} maxBarSize={13} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={`Top 5 — ${wB} Handover`} subtitle="Best performing hubs" />
          <div className="space-y-2.5 px-5 pb-5 pt-2">
            {top5.map((h, i) => (
              <div key={h.hub} className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-3.5 py-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  i === 0 ? "bg-amber-500/20 text-amber-400" : i === 1 ? "bg-slate-400/20 text-slate-300"
                    : i === 2 ? "bg-orange-700/25 text-orange-400" : "bg-slate-700/40 text-slate-400"
                }`}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-200">{h.hub}</p>
                  <StatusPill status={h.statusB} />
                </div>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">{h.fourthSlotHandover.b.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title={`All Hubs — ${wB} vs ${wA}`} />
        <Table head={<>
          <th className={th}>Hub</th>
          <th className={th}>{wB} Status</th>
          <th className={th}>{wA} B11PM</th>
          <th className={th}>{wB} B11PM</th>
          <th className={th}>Diff</th>
          <th className={th}>Processed {wB}</th>
          <th className={th}>Late {wB}</th>
          <th className={th}>Breaks {wB}</th>
        </>}>
          {arrival.map((ar) => {
            const hpRow = hp.find((x) => x.hub === ar.hub);
            const pvhRow = pvh.find((x) => x.hub === ar.hub);
            const lRow = late.find((x) => x.hub === ar.hub);
            const sRow = sb.find((x) => x.hub === ar.hub);
            return (
              <tr key={ar.hub} className="hover:bg-slate-800/30 transition-colors">
                <td className={`${td} font-semibold text-slate-100`}>{ar.hub}</td>
                <td className={td}>{hpRow && <StatusPill status={hpRow.statusB} />}</td>
                <td className={td}>{ar.before11pm.a.toFixed(2)}%</td>
                <td className={`${td} font-semibold text-slate-100`}>{ar.before11pm.b.toFixed(2)}%</td>
                <td className={td}><DeltaBadge value={d(ar.before11pm)} /></td>
                <td className={td}>{pvhRow?.processed.b.toLocaleString() ?? "—"}</td>
                <td className={td}>{lRow?.totalLate.b ?? "—"}</td>
                <td className={td}>{sRow?.totalBreak.b ?? "—"}</td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
