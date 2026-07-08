import { useState } from "react";
import { Link2, Menu, RefreshCw, Settings } from "lucide-react";
import Sidebar, { NAV_ITEMS, PageKey } from "./components/Sidebar";
import ConnectModal from "./components/ConnectModal";
import { useSheetData } from "./lib/sheetSync";
import { cn } from "./utils/cn";
import Overview from "./pages/Overview";
import ArrivalPage from "./pages/ArrivalPage";
import ProcessPage from "./pages/ProcessPage";
import ProcessVsHandoverParamPage from "./pages/ProcessVsHandoverParamPage";
import ProcessVsHandoverPage from "./pages/ProcessVsHandoverPage";
import LateReportingPage from "./pages/LateReportingPage";
import SlotBreakPage from "./pages/SlotBreakPage";

export default function App() {
  const [page, setPage] = useState<PageKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { data, status, scriptUrl, lastSync, error, refresh, connect } = useSheetData();

  const { weeks } = data;
  const weekLabel = `${weeks.weekA} vs ${weeks.weekB}`;
  const current = NAV_ITEMS.find((n) => n.key === page)!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-[100px]" />
        <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <Sidebar page={page} onNavigate={setPage} open={sidebarOpen}
        onClose={() => setSidebarOpen(false)} status={status} weekLabel={weekLabel} />

      <div className="relative lg:pl-[272px]">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
            <button onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <p className="truncate text-sm font-bold text-white sm:text-base">{current.label}</p>
                {/* Dynamic Week Badge — reads from sheet A1 & A3 */}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[11px] font-bold text-slate-300">
                  <span className="text-blue-400">{weeks.weekA}</span>
                  <span className="text-slate-600">vs</span>
                  <span className="text-emerald-400">{weeks.weekB}</span>
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                Pathao ISD · Hub Dashboard
                {lastSync && ` · Updated: ${lastSync.toLocaleTimeString()}`}
              </p>
            </div>

            {/* Status pill */}
            <span className={cn(
              "hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold sm:inline-flex",
              status === "live" ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                : status === "loading" ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                : status === "error" ? "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
                : "bg-slate-700/30 text-slate-400 ring-1 ring-slate-600/40"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full",
                status === "live" ? "bg-emerald-400 animate-pulse"
                  : status === "loading" ? "bg-amber-400 animate-pulse"
                  : status === "error" ? "bg-rose-400" : "bg-slate-500"
              )} />
              {status === "live" ? "LIVE" : status === "loading" ? "SYNCING" : status === "error" ? "ERROR" : "SAMPLE"}
            </span>

            <button onClick={() => refresh()} disabled={!scriptUrl || status === "loading"}
              className="rounded-xl border border-slate-700 p-2 text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              title="Refresh data">
              <RefreshCw className={cn("h-4 w-4", status === "loading" && "animate-spin")} />
            </button>

            <button onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-violet-500 sm:px-4">
              <Link2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{scriptUrl ? "Sheet Connected" : "Connect Sheet"}</span>
              <span className="sm:hidden">Sheet</span>
            </button>

            <button onClick={() => setModalOpen(true)}
              className="rounded-xl border border-slate-700 p-2 text-slate-400 hover:bg-slate-800 hidden sm:flex" title="Settings">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Each page gets ONLY its own topic data + week labels */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {page === "overview" && <Overview data={data} />}
          {page === "arrival" && <ArrivalPage rows={data.arrival} weeks={weeks} />}
          {page === "process" && <ProcessPage rows={data.process} weeks={weeks} />}
          {page === "processVsHandoverParam" && <ProcessVsHandoverParamPage rows={data.handoverParam} weeks={weeks} />}
          {page === "processVsHandover" && <ProcessVsHandoverPage rows={data.processVsHandover} weeks={weeks} />}
          {page === "lateReporting" && <LateReportingPage rows={data.late} weeks={weeks} />}
          {page === "slotBreak" && <SlotBreakPage rows={data.slotBreak} weeks={weeks} />}

          <footer className="mt-12 border-t border-slate-800/60 pt-6 pb-4 text-center">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
                  <span className="text-[10px] font-black text-white">ISD</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500">ISD Team</span>
              </div>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[11px] text-slate-500">
                {weekLabel} · {status === "live" ? "Live from Google Sheet" : "Sample data — connect your sheet"}
              </span>
            </div>
          </footer>
        </main>
      </div>

      <ConnectModal open={modalOpen} onClose={() => setModalOpen(false)}
        currentUrl={scriptUrl} onConnect={connect} error={error} />
    </div>
  );
}
