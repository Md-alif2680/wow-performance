import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Clock, Moon, Timer } from "lucide-react";
import { ProcessRow, WeekConfig, WP } from "../data/hubData";
import { Card, CardHeader, CHART_COLORS, DeltaBadge, KpiCard, PageHeader, pctFmt, Table, td, th, tooltipStyle } from "../components/ui";

const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

export default function ProcessPage({ rows, weeks }: { rows: ProcessRow[]; weeks: WeekConfig }) {
  const wA = weeks.weekA, wB = weeks.weekB;
  const stats = [
    { key: "before9pm" as const, label: "Before 9:00 PM", icon: <Timer className="h-4 w-4" />, tone: "cyan" as const, color: CHART_COLORS.cyan, get: (r: ProcessRow) => r.before9pm },
    { key: "before11pm" as const, label: "Before 11:00 PM", icon: <Clock className="h-4 w-4" />, tone: "blue" as const, color: CHART_COLORS.blue, get: (r: ProcessRow) => r.before11pm },
    { key: "before1am" as const, label: "Before 1:00 AM", icon: <BarChart3 className="h-4 w-4" />, tone: "amber" as const, color: CHART_COLORS.amber, get: (r: ProcessRow) => r.before1am },
    { key: "after1am" as const, label: "After 1:00 AM", icon: <Moon className="h-4 w-4" />, tone: "red" as const, color: CHART_COLORS.red, get: (r: ProcessRow) => r.after1am },
  ];

  const stackData = rows.map((h) => {
    const o: Record<string, string | number> = { hub: h.hub };
    stats.forEach((s) => { o[s.label] = s.get(h).b; });
    return o;
  });

  const b11Compare = rows.map((h) => ({ hub: h.hub, [wA]: h.before11pm.a, [wB]: h.before11pm.b }));

  return (
    <div className="space-y-6">
      <PageHeader title="Process" subtitle={`Processing throughput across operation windows — ${wA} vs ${wB}`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => {
          const aB = avg(rows.map((r) => s.get(r).b));
          const aA = avg(rows.map((r) => s.get(r).a));
          return <KpiCard key={s.key} label={`Avg ${s.label}`} value={`${aB.toFixed(2)}%`} icon={s.icon} tone={s.tone} delta={aB - aA} deltaLabel="pts" />;
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title={`Process Distribution (${wB})`} subtitle="Stacked time-slot share per hub" />
          <div className="h-80 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackData} margin={{ top: 5, right: 8, left: -18, bottom: 42 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={pctFmt} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                {stats.map((s, i) => (
                  <Bar key={s.key} dataKey={s.label} stackId="a" fill={s.color} maxBarSize={24}
                    radius={i === stats.length - 1 ? [3, 3, 0, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={`Before 11:00 PM (${wA} vs ${wB})`} subtitle="Process rate comparison" />
          <div className="h-80 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={b11Compare} margin={{ top: 5, right: 8, left: -14, bottom: 42 }}>
                <defs>
                  <linearGradient id="pGa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} /><stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0} /></linearGradient>
                  <linearGradient id="pGb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CHART_COLORS.cyan} stopOpacity={0.35} /><stop offset="100%" stopColor={CHART_COLORS.cyan} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
                <YAxis domain={[0, 70]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={pctFmt} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                <Area type="monotone" dataKey={wA} stroke={CHART_COLORS.blue} strokeWidth={2} fill="url(#pGa)" />
                <Area type="monotone" dataKey={wB} stroke={CHART_COLORS.cyan} strokeWidth={2.5} fill="url(#pGb)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="PROCESS — Full Data " subtitle={`${wA} vs ${wB} for every time slot`} />
        <Table head={<>
         
          {stats.map((s) => <th key={s.key} className={`${th} text-center`} style={{ color: s.color }} colSpan={3}>{s.label}</th>)}
        </>}>
         
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
            <td className={th}>Hub Name</td>
            {stats.map((s) => (
              <>
            
              <td key={s.key+"a"} className={th}>{wA}</td>
              <td key={s.key+"b"} className={th}>{wB}</td>
              <td key={s.key+"r"} className={th}>Results </td>
              </>
            ))}
          </tr>
          {rows.map((h) => (
            
            <tr key={h.hub} className="hover:bg-slate-800/30 transition-colors">
          
              <td className={`${td} font-semibold text-slate-100 sticky left-0 bg-slate-900/90 z-[1]`}>{h.hub}</td>
              {stats.map((s) => <PairCells key={s.key} pair={s.get(h)} />)}
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

function PairCells({ pair }: { pair: WP }) {
  return (<>
    <td className={td}>{pair.a.toFixed(2)}%</td>
    <td className={`${td} font-medium text-slate-100`}>{pair.b.toFixed(2)}%</td>
    <td className={td}><DeltaBadge value={pair.b - pair.a} /></td>
  </>);
}
