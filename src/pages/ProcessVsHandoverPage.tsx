import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowDownUp, Boxes, PackageCheck, TrendingDown, TrendingUp } from "lucide-react";
import { ProcessVsHandoverRow, WeekConfig } from "../data/hubData";
import { Card, CardHeader, CHART_COLORS, KpiCard, numFmt, PageHeader, Table, td, th, tooltipStyle } from "../components/ui";
import { cn } from "../utils/cn";

export default function ProcessVsHandoverPage({ rows, weeks }: { rows: ProcessVsHandoverRow[]; weeks: WeekConfig }) {
  const wA = weeks.weekA, wB = weeks.weekB;
  const procA = rows.reduce((s, h) => s + h.processed.a, 0);
  const procB = rows.reduce((s, h) => s + h.processed.b, 0);
  const hoB = rows.reduce((s, h) => s + h.handoverQty.b, 0);
  const hoA = rows.reduce((s, h) => s + h.handoverQty.a, 0);
  const mmA = rows.reduce((s, h) => s + h.mismatch.a, 0);
  const mmB = rows.reduce((s, h) => s + h.mismatch.b, 0);

  const comp = rows.map((h) => ({ hub: h.hub, [`${wA} Processed`]: h.processed.a, [`${wB} Processed`]: h.processed.b }));
  const pvh = rows.map((h) => ({ hub: h.hub, Processed: h.processed.b, Handover: h.handoverQty.b }));

  const getIcon = (a: number, b: number) => b > a ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> : b < a ? <TrendingDown className="h-3.5 w-3.5 text-rose-400" /> : <span className="text-slate-500">—</span>;

  return (
    <div className="space-y-6">
      <PageHeader title="Process VS Handover" subtitle={`Volume reconciliation — ${wA} vs ${wB}`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-6">
        <KpiCard label={`Processed ${wA}`} value={procA.toLocaleString()} icon={<Boxes className="h-4 w-4" />} tone="blue" />
        <KpiCard label={`Handover ${wA}`} value={hoA.toLocaleString()} icon={<PackageCheck className="h-4 w-4" />} tone="cyan" />
        <KpiCard label={`Mismatch ${wA}`} value={String(mmA)} icon={<AlertTriangle className="h-4 w-4" />} tone={mmA > 0 ? "amber" : "green"} />
        <KpiCard label={`Processed ${wB}`} value={procB.toLocaleString()} icon={<Boxes className="h-4 w-4" />} tone="purple" delta={procA > 0 ? ((procB - procA) / procA) * 100 : 0} deltaLabel={`vs ${wA}`} />
        <KpiCard label={`Handover ${wB}`} value={hoB.toLocaleString()} icon={<PackageCheck className="h-4 w-4" />} tone="green" />
        <KpiCard label={`Mismatch ${wB}`} value={String(mmB)} icon={<AlertTriangle className="h-4 w-4" />} tone={mmB > 0 ? "red" : "green"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Processed Quantity" subtitle={`${wA} vs ${wB}`} />
          <div className="h-80 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={comp} margin={{ top: 5, right: 8, left: 0, bottom: 42 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={numFmt} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              <Bar dataKey={`${wA} Processed`} fill={CHART_COLORS.blue} radius={[3, 3, 0, 0]} maxBarSize={13} />
              <Bar dataKey={`${wB} Processed`} fill={CHART_COLORS.purple} radius={[3, 3, 0, 0]} maxBarSize={13} />
            </BarChart>
          </ResponsiveContainer></div>
        </Card>
        <Card>
          <CardHeader title={`Process vs Handover (${wB})`} subtitle="Paired volume comparison" />
          <div className="h-80 px-2 pb-4"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={pvh} margin={{ top: 5, right: 8, left: 0, bottom: 42 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hub" angle={-50} textAnchor="end" interval={0} tick={{ fontSize: 8.5, fill: "#64748b" }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={numFmt} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              <Bar dataKey="Processed" fill={CHART_COLORS.cyan} radius={[3, 3, 0, 0]} maxBarSize={13} />
              <Bar dataKey="Handover" fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} maxBarSize={13} />
            </BarChart>
          </ResponsiveContainer></div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Process VS Handover — Full Data" />
        <Table head={<>
          <th className={`${th} text-center text-blue-400`} colSpan={3}>{wA}</th>
          <th className={`${th} text-center text-emerald-400`} colSpan={3}>{wB}</th>
        </>}>
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
                       <td className={th}>Hub Name</td>
            <td className={th}>Processed</td>
            <td className={th}>Handover</td>
            <td className={th}>Mismatch</td>
            <td className={th}>Processed</td>
            <td className={th}>Handover</td>
            <td className={th}>Mismatch</td>
                      <th className={th}>Results</th>

          </tr>
          {rows.map((h) => (
            <tr key={h.hub} className="hover:bg-slate-800/30 transition-colors">
              <td className={`${td} font-semibold text-slate-100 sticky left-0 bg-slate-900/90 z-[1]`}>{h.hub}</td>
              <td className={td}>{h.processed.a.toLocaleString()}</td>
              <td className={td}>{h.handoverQty.a.toLocaleString()}</td>
              <MmCell v={h.mismatch.a} />
              <td className={`${td} font-medium text-slate-100`}>{h.processed.b.toLocaleString()}</td>
              <td className={`${td} font-medium text-slate-100`}>{h.handoverQty.b.toLocaleString()}</td>
              <MmCell v={h.mismatch.b} />
              <td className={td}>{getIcon(h.processed.a, h.processed.b)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-slate-700 bg-slate-800/40 font-bold">
            <td className={`${td} text-white sticky left-0 bg-slate-800/90 z-[1]`}>Total</td>
            <td className={`${td} text-white`}>{procA.toLocaleString()}</td>
            <td className={`${td} text-white`}>{hoA.toLocaleString()}</td>
            <MmCell v={mmA} />
            <td className={`${td} text-white`}>{procB.toLocaleString()}</td>
            <td className={`${td} text-white`}>{hoB.toLocaleString()}</td>
            <MmCell v={mmB} />
            <td className={td}><ArrowDownUp className="h-3.5 w-3.5 text-slate-400" /></td>
          </tr>
        </Table>
      </Card>
    </div>
  );
}

function MmCell({ v }: { v: number }) {
  return <td className={td}><span className={cn("inline-flex min-w-6 items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold", v > 0 ? "bg-rose-500/15 text-rose-400" : "bg-emerald-500/10 text-emerald-500")}>{v}</span></td>;
}
