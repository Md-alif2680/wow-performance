import { useCallback, useEffect, useState } from "react";
import { DashboardData, sampleData } from "../data/hubData";

const LS_KEY = "isd_dashboard_script_url";
export const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Sh3KfmGUVmVmiU-ernVRg0dxWgM3RGV7mKvIY9oRd2c/edit?gid=0#gid=0";

export function getSavedScriptUrl(): string {
  try { return localStorage.getItem(LS_KEY) ?? ""; } catch { return ""; }
}
export function saveScriptUrl(url: string) {
  try { localStorage.setItem(LS_KEY, url.trim()); } catch { /* */ }
}

/* ── Payload parser ────────────────────────────────────────── */

const num = (v: unknown): number => {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[%,\s▲▼]/g, ""));
    return isFinite(n) ? n : 0;
  }
  return 0;
};
const pair = (v: any) => ({ a: num(v?.a), b: num(v?.b) });
const st = (v: any): "Achieved" | "Standard Fail" =>
  String(v ?? "").toLowerCase().includes("achiev") ? "Achieved" : "Standard Fail";

function parsePayload(json: unknown): DashboardData | null {
  const d = json as any;
  if (!d) return null;
  try {
    const weeks = {
      weekA: String(d.weeks?.weekA ?? "Week A"),
      weekB: String(d.weeks?.weekB ?? "Week B"),
    };
    const arr = (key: string) => (Array.isArray(d[key]) ? d[key] : []);

    if (!arr("arrival").length && !arr("process").length && !arr("handoverParam").length) return null;

    return {
      weeks,
      arrival: arr("arrival").filter((r: any) => r?.hub).map((r: any) => ({
        hub: String(r.hub).trim(),
        before7pm: pair(r.before7pm), before9pm: pair(r.before9pm),
        before11pm: pair(r.before11pm), after11pm: pair(r.after11pm),
      })),
      process: arr("process").filter((r: any) => r?.hub).map((r: any) => ({
        hub: String(r.hub).trim(),
        before9pm: pair(r.before9pm), before11pm: pair(r.before11pm),
        before1am: pair(r.before1am), after1am: pair(r.after1am),
      })),
      handoverParam: arr("handoverParam").filter((r: any) => r?.hub).map((r: any) => ({
        hub: String(r.hub).trim(),
        before12amProcessed: pair(r.before12amProcessed),
        fourthSlotHandover: pair(r.fourthSlotHandover),
        fourthSlotRatio: pair(r.fourthSlotRatio),
        statusA: st(r.statusA), statusB: st(r.statusB),
      })),
      processVsHandover: arr("processVsHandover").filter((r: any) => r?.hub).map((r: any) => ({
        hub: String(r.hub).trim(),
        processed: pair(r.processed), handoverQty: pair(r.handoverQty), mismatch: pair(r.mismatch),
      })),
      late: arr("late").filter((r: any) => r?.hub).map((r: any) => ({
        hub: String(r.hub).trim(),
        totalLate: pair(r.totalLate), lateRatio: pair(r.lateRatio),
      })),
      slotBreak: arr("slotBreak").filter((r: any) => r?.hub).map((r: any) => ({
        hub: String(r.hub).trim(), totalBreak: pair(r.totalBreak),
      })),
    };
  } catch { return null; }
}

/* ── Hook ──────────────────────────────────────────────────── */

export type SyncStatus = "sample" | "loading" | "live" | "error";

export function useSheetData() {
  const [data, setData] = useState<DashboardData>(sampleData);
  const [status, setStatus] = useState<SyncStatus>("sample");
  const [scriptUrl, setScriptUrl] = useState(getSavedScriptUrl());
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(
    async (urlOverride?: string) => {
      const url = (urlOverride ?? scriptUrl).trim();
      if (!url) { setStatus("sample"); setData(sampleData); return; }
      setStatus("loading"); setError("");
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const parsed = parsePayload(json);
        if (!parsed) throw new Error("Unexpected payload shape");
        setData(parsed);
        setStatus("live");
        setLastSync(new Date());
      } catch (e: any) {
        setError(e?.message ?? "Fetch failed");
        setStatus("error");
        setData((prev) => (prev.arrival.length ? prev : sampleData));
      }
    },
    [scriptUrl]
  );

  const connect = useCallback((url: string) => {
    saveScriptUrl(url); setScriptUrl(url.trim());
    if (url.trim()) refresh(url); else { setStatus("sample"); setData(sampleData); }
  }, [refresh]);

  useEffect(() => { if (scriptUrl) refresh(); }, []);
  useEffect(() => {
    if (!scriptUrl) return;
    const id = setInterval(() => refresh(), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [scriptUrl, refresh]);

  return { data, status, scriptUrl, lastSync, error, refresh, connect };
}

/* ── Apps Script Template ──────────────────────────────────── */

export const APPS_SCRIPT_CODE = `/**
 * Pathao ISD Hub Dashboard — Google Apps Script
 * Reads week labels from A1 (weekA) and A3 (weekB) of each tab.
 * Returns topic-separated JSON.
 *
 * Deploy → New deployment → Web app
 *   Execute as: Me  |  Who has access: Anyone
 */
function doGet() {
  var ss = SpreadsheetApp.openById('1Sh3KfmGUVmVmiU-ernVRg0dxWgM3RGV7mKvIY9oRd2c');

  var pct = function(v) {
    if (typeof v === 'number') return v >= -1 && v <= 1 ? v * 100 : v;
    var n = parseFloat(String(v).replace(/[%,\\\\s▲▼]/g, ''));
    return isNaN(n) ? 0 : n;
  };
  var num = function(v) {
    var n = parseFloat(String(v).replace(/[,\\\\s]/g, ''));
    return isNaN(n) ? 0 : n;
  };
  // a = col index for weekA value, b = a+1 for weekB value
  // skip = columns to skip (Results column etc)
  var wp = function(row, i, isPct) {
    return { a: isPct ? pct(row[i]) : num(row[i]),
             b: isPct ? pct(row[i+1]) : num(row[i+1]) };
  };

  // Read week labels from A1 and A3 of any sheet
  function getWeeks(sh) {
    var a1 = sh.getRange('A1').getValue();
    var a3 = sh.getRange('A3').getValue();
    return {
      weekA: String(a1).trim() || 'Week A',
      weekB: String(a3).trim() || 'Week B'
    };
  }

  function readRows(name, mapper) {
    try {
      var sh = ss.getSheetByName(name);
      if (!sh) return [];
      var vals = sh.getDataRange().getValues();
      var out = [];
      // Data starts at row 4 (index 3)
      for (var r = 3; r < vals.length; r++) {
        var row = vals[r];
        if (!row[0] || String(row[0]).trim() === '') continue;
        var obj = mapper(row);
        obj.hub = String(row[0]).trim();
        out.push(obj);
      }
      return out;
    } catch(e) { return []; }
  }

  // Get weeks from the Arrival tab (or first available)
  var weekSh = ss.getSheetByName('Arrival') || ss.getSheets()[0];
  var weeks = getWeeks(weekSh);

  var result = {
    weeks: weeks,

    // ARRIVAL tab: B=weekA B7PM, C=weekB B7PM, D=Results,
    //   E=weekA B9PM, F=weekB B9PM, G=Results,
    //   H=weekA B11PM, I=weekB B11PM, J=Results,
    //   K=weekA A11PM, L=weekB A11PM, M=Results
    arrival: readRows('Arrival', function(r) {
      return {
        before7pm:  { a: pct(r[1]), b: pct(r[2]) },
        before9pm:  { a: pct(r[4]), b: pct(r[5]) },
        before11pm: { a: pct(r[7]), b: pct(r[8]) },
        after11pm:  { a: pct(r[10]),b: pct(r[11]) }
      };
    }),

    // PROCESS tab: same column pattern
    process: readRows('PROCESS', function(r) {
      return {
        before9pm:  { a: pct(r[1]), b: pct(r[2]) },
        before11pm: { a: pct(r[4]), b: pct(r[5]) },
        before1am:  { a: pct(r[7]), b: pct(r[8]) },
        after1am:   { a: pct(r[10]),b: pct(r[11]) }
      };
    }),

    handoverParam: readRows('Process Vs Handover Parameter', function(r) {
      return {
        before12amProcessed: { a: pct(r[1]), b: pct(r[6]) },
        fourthSlotHandover:  { a: pct(r[2]), b: pct(r[7]) },
        statusA: String(r[3]),
        statusB: String(r[8]),
        fourthSlotRatio:     { a: pct(r[10]), b: pct(r[11]) }
      };
    }),

    processVsHandover: readRows('Process VS Handover', function(r) {
      return {
        processed:   { a: num(r[1]), b: num(r[4]) },
        handoverQty: { a: num(r[2]), b: num(r[5]) },
        mismatch:    { a: num(r[3]), b: num(r[6]) }
      };
    }),

    late: readRows('Resources Late Reporting', function(r) {
      return {
        totalLate: { a: num(r[1]), b: num(r[3]) },
        lateRatio: { a: pct(r[2]), b: pct(r[4]) }
      };
    }),

    slotBreak: readRows('IB Slot SOP Break', function(r) {
      return { totalBreak: { a: num(r[1]), b: num(r[2]) } };
    })
  };

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}`;
