import {
  Activity,
  BarChart3,
  Boxes,
  Clock,
  FileWarning,
  LayoutDashboard,
  MapPin,
  Scale,
  ShieldAlert,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";
import { SyncStatus } from "../lib/sheetSync";

export type PageKey =
  | "overview"
  | "arrival"
  | "process"
  | "processVsHandoverParam"
  | "processVsHandover"
  | "lateReporting"
  | "slotBreak";

export const NAV_ITEMS: { key: PageKey; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "arrival", label: "Arrival", icon: Clock },
  { key: "process", label: "Process", icon: BarChart3 },
  { key: "processVsHandoverParam", label: "Process Vs Handover Parameter", icon: Activity },
  { key: "processVsHandover", label: "Process VS Handover", icon: Boxes },
  { key: "lateReporting", label: "Resources Late Reporting", icon: FileWarning },
  { key: "slotBreak", label: "Slot Break Analysis", icon: ShieldAlert },
];

export default function Sidebar({
  page,
  onNavigate,
  open,
  onClose,
  status,
  weekLabel,
}: {
  page: PageKey;
  onNavigate: (p: PageKey) => void;
  open: boolean;
  onClose: () => void;
  status: SyncStatus;
  weekLabel: string;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
              <Scale className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-bold leading-tight text-white tracking-wide">WOW</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Performance Dashboard
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-5 mb-4 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
          <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <span className="text-[11px] text-slate-400 truncate">Pathao ISD · Hub Dashboard</span>
        </div>

        <p className="px-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Topics</p>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { onNavigate(key); onClose(); }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                page === key
                  ? "bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/30 shadow-sm shadow-blue-500/10"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5">
            <span className={cn(
              "h-2 w-2 rounded-full shrink-0",
              status === "live" ? "bg-emerald-400 animate-pulse"
                : status === "loading" ? "bg-amber-400 animate-pulse"
                : status === "error" ? "bg-rose-400" : "bg-slate-500"
            )} />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-300 truncate">
                {status === "live" ? "Live — Google Sheet"
                  : status === "loading" ? "Syncing…"
                  : status === "error" ? "Sync error" : "Sample Data"}
              </p>
              <p className="text-[10px] text-slate-500">{weekLabel}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
