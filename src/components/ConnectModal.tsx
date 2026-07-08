import { useState } from "react";
import { Check, Copy, ExternalLink, Link2, X } from "lucide-react";
import { APPS_SCRIPT_CODE, SHEET_URL } from "../lib/sheetSync";

export default function ConnectModal({
  open,
  onClose,
  currentUrl,
  onConnect,
  error,
}: {
  open: boolean;
  onClose: () => void;
  currentUrl: string;
  onConnect: (url: string) => void;
  error: string;
}) {
  const [url, setUrl] = useState(currentUrl);
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Link2 className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">Connect Google Sheet</h2>
              <p className="text-xs text-slate-400">Live sync via Apps Script Web App</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <ol className="space-y-2 text-xs leading-relaxed text-slate-300">
            <li>
              <b className="text-white">1.</b> Open your{" "}
              <a
                href={SHEET_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:underline"
              >
                Google Sheet <ExternalLink className="h-3 w-3" />
              </a>{" "}
              → <b className="text-white">Extensions → Apps Script</b>.
            </li>
            <li>
              <b className="text-white">2.</b> Paste the script below (adjust column indices to your layout) and save.
            </li>
            <li>
              <b className="text-white">3.</b> <b className="text-white">Deploy → New deployment → Web app</b>, execute as{" "}
              <i>Me</i>, access: <i>Anyone</i>. Copy the <code className="rounded bg-slate-800 px-1">/exec</code> URL.
            </li>
            <li>
              <b className="text-white">4.</b> Paste the URL below and hit <b className="text-white">Connect</b>. The
              dashboard auto-refreshes every 5 minutes.
            </li>
          </ol>

          <div className="relative">
            <button
              onClick={copy}
              className="absolute right-2 top-2 z-10 flex items-center gap-1.5 rounded-lg bg-slate-700/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-600"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy script"}
            </button>
            <pre className="max-h-56 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-[10.5px] leading-relaxed text-slate-400">
              {APPS_SCRIPT_CODE}
            </pre>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Apps Script Web App URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfy.../exec"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {error && <p className="mt-2 text-xs text-rose-400">⚠ {error} — showing last known data.</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
          {currentUrl && (
            <button
              onClick={() => {
                onConnect("");
                onClose();
              }}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400"
            >
              Disconnect
            </button>
          )}
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
            Cancel
          </button>
          <button
            onClick={() => {
              onConnect(url);
              onClose();
            }}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-violet-500"
          >
            Connect & Sync
          </button>
        </div>
      </div>
    </div>
  );
}
