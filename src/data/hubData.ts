// ─────────────────────────────────────────────────────────────
// Dynamic week-based, topic-separated data model
// Week labels read from Google Sheet cells A1 & A3
// ─────────────────────────────────────────────────────────────

/** Value pair: a = older week, b = newer week */
export interface WP { a: number; b: number; }

/** Week labels read from the sheet */
export interface WeekConfig {
  weekA: string;  // e.g. "Week 27" — from cell A1
  weekB: string;  // e.g. "Week 28" — from cell A3
}

// ── Topic-specific row types ───────────────────────────────

export interface ArrivalRow {
  hub: string;
  before7pm: WP; before9pm: WP; before11pm: WP; after11pm: WP;
}

export interface ProcessRow {
  hub: string;
  before9pm: WP; before11pm: WP; before1am: WP; after1am: WP;
}

export interface HandoverParamRow {
  hub: string;
  before12amProcessed: WP; fourthSlotHandover: WP; fourthSlotRatio: WP;
  statusA: "Achieved" | "Standard Fail";
  statusB: "Achieved" | "Standard Fail";
}

export interface ProcessVsHandoverRow {
  hub: string;
  processed: WP; handoverQty: WP; mismatch: WP;
}

export interface LateRow {
  hub: string;
  totalLate: WP; lateRatio: WP;
}

export interface SlotBreakRow {
  hub: string;
  totalBreak: WP;
}

// ── Full dashboard payload ─────────────────────────────────

export interface DashboardData {
  weeks: WeekConfig;
  arrival: ArrivalRow[];
  process: ProcessRow[];
  handoverParam: HandoverParamRow[];
  processVsHandover: ProcessVsHandoverRow[];
  late: LateRow[];
  slotBreak: SlotBreakRow[];
}

// ── Sample data (Week 27 vs 28 — from actual sheet) ────────

const w = (a: number, b: number): WP => ({ a, b });
const A = "Achieved" as const;
const F = "Standard Fail" as const;

export const sampleData: DashboardData = {
  weeks: { weekA: "Week 27", weekB: "Week 28" },

  // Exact data from the Arrival sheet screenshot (W27 vs W28)
  arrival: [
    { hub:"Mohammadpur",  before7pm:w(10.63,8.63),  before9pm:w(22.09,24.63), before11pm:w(43.16,39.15), after11pm:w(24.11,27.59) },
    { hub:"Pallabi",      before7pm:w(17.29,14.72), before9pm:w(26.22,29.91), before11pm:w(45.75,41.81), after11pm:w(10.75,13.56) },
    { hub:"Banani",       before7pm:w(16.76,16.45), before9pm:w(40.40,46.23), before11pm:w(38.20,32.14), after11pm:w(4.64,5.18) },
    { hub:"Lalbagh",      before7pm:w(3.90,5.57),   before9pm:w(19.82,17.51), before11pm:w(47.57,52.18), after11pm:w(28.70,24.74) },
    { hub:"Uttara",       before7pm:w(12.28,11.00), before9pm:w(21.20,21.59), before11pm:w(42.86,40.29), after11pm:w(23.66,27.11) },
    { hub:"Shewrapara",   before7pm:w(19.37,15.83), before9pm:w(35.32,35.22), before11pm:w(37.29,40.73), after11pm:w(8.02,8.22) },
    { hub:"Diabari",      before7pm:w(27.36,29.52), before9pm:w(19.54,24.29), before11pm:w(41.90,42.17), after11pm:w(11.20,4.03) },
    { hub:"Farmgate",     before7pm:w(15.53,17.55), before9pm:w(34.46,28.17), before11pm:w(37.81,43.77), after11pm:w(12.21,10.51) },
    { hub:"Mirpur-1",     before7pm:w(13.42,10.16), before9pm:w(42.13,40.30), before11pm:w(34.25,39.18), after11pm:w(10.20,10.35) },
    { hub:"Bashundhara",  before7pm:w(16.50,16.68), before9pm:w(25.52,28.89), before11pm:w(38.80,40.19), after11pm:w(19.19,14.24) },
    { hub:"Malibagh",     before7pm:w(19.88,12.90), before9pm:w(37.32,39.94), before11pm:w(38.56,43.36), after11pm:w(4.24,3.81) },
    { hub:"Motijheel",    before7pm:w(12.75,7.94),  before9pm:w(21.72,39.15), before11pm:w(56.27,45.02), after11pm:w(9.27,7.90) },
    { hub:"Bashabo",      before7pm:w(15.56,11.39), before9pm:w(31.19,24.57), before11pm:w(50.66,52.79), after11pm:w(2.59,11.25) },
    { hub:"Narayanganj",  before7pm:w(33.67,34.47), before9pm:w(23.56,31.91), before11pm:w(42.76,33.62), after11pm:w(0.00,0.00) },
    { hub:"Demra",        before7pm:w(25.89,29.55), before9pm:w(35.90,36.44), before11pm:w(33.06,28.97), after11pm:w(5.15,5.04) },
    { hub:"Siddhirganj",  before7pm:w(35.26,34.01), before9pm:w(39.39,42.68), before11pm:w(22.42,20.26), after11pm:w(2.93,3.05) },
    { hub:"Rayerbag",     before7pm:w(21.36,22.21), before9pm:w(25.78,25.59), before11pm:w(38.23,41.53), after11pm:w(14.63,10.67) },
    { hub:"Badda",        before7pm:w(24.99,17.83), before9pm:w(29.79,31.91), before11pm:w(45.22,50.19), after11pm:w(0.01,0.07) },
    { hub:"Kamrangirchar",before7pm:w(11.59,9.24),  before9pm:w(25.76,23.84), before11pm:w(46.50,50.37), after11pm:w(16.15,16.55) },
  ],

  process: [
    { hub:"Mohammadpur",  before9pm:w(28.56,28.45), before11pm:w(41.08,41.18), before1am:w(29.60,28.34), after1am:w(0.76,2.03) },
    { hub:"Pallabi",      before9pm:w(30.02,32.89), before11pm:w(36.30,36.68), before1am:w(32.58,30.27), after1am:w(1.10,0.16) },
    { hub:"Banani",       before9pm:w(36.07,42.83), before11pm:w(43.60,41.23), before1am:w(20.33,15.94), after1am:w(0.00,0.00) },
    { hub:"Lalbagh",      before9pm:w(19.86,15.60), before11pm:w(37.48,39.46), before1am:w(35.65,36.23), after1am:w(7.01,8.71) },
    { hub:"Uttara",       before9pm:w(26.58,23.82), before11pm:w(32.72,32.07), before1am:w(37.92,37.13), after1am:w(2.78,6.98) },
    { hub:"Shewrapara",   before9pm:w(35.22,39.82), before11pm:w(38.20,40.59), before1am:w(25.39,19.59), after1am:w(1.18,0.00) },
    { hub:"Diabari",      before9pm:w(32.26,33.19), before11pm:w(41.17,45.40), before1am:w(23.06,21.20), after1am:w(3.51,0.21) },
    { hub:"Farmgate",     before9pm:w(34.27,35.01), before11pm:w(39.94,39.89), before1am:w(24.94,21.29), after1am:w(0.85,3.81) },
    { hub:"Mirpur-1",     before9pm:w(27.68,33.42), before11pm:w(48.70,46.17), before1am:w(23.61,20.38), after1am:w(0.01,0.03) },
    { hub:"Bashundhara",  before9pm:w(39.08,38.90), before11pm:w(43.33,34.80), before1am:w(16.86,24.32), after1am:w(0.73,1.99) },
    { hub:"Malibagh",     before9pm:w(37.08,44.73), before11pm:w(41.91,41.55), before1am:w(19.89,13.67), after1am:w(1.12,0.05) },
    { hub:"Motijheel",    before9pm:w(25.78,27.50), before11pm:w(40.83,46.10), before1am:w(26.89,24.56), after1am:w(6.50,1.84) },
    { hub:"Bashabo",      before9pm:w(26.32,30.39), before11pm:w(42.96,45.47), before1am:w(30.25,24.14), after1am:w(0.46,0.00) },
    { hub:"Narayanganj",  before9pm:w(45.97,44.71), before11pm:w(42.74,50.68), before1am:w(11.29,4.62),  after1am:w(0.00,0.00) },
    { hub:"Demra",        before9pm:w(44.69,42.52), before11pm:w(41.72,39.78), before1am:w(13.59,14.77), after1am:w(0.00,2.93) },
    { hub:"Siddhirganj",  before9pm:w(48.22,43.70), before11pm:w(38.82,36.18), before1am:w(12.96,19.80), after1am:w(0.00,0.32) },
    { hub:"Rayerbag",     before9pm:w(36.00,34.33), before11pm:w(34.76,37.51), before1am:w(29.04,27.17), after1am:w(0.21,1.00) },
    { hub:"Badda",        before9pm:w(32.44,36.87), before11pm:w(55.52,57.82), before1am:w(12.04,5.31),  after1am:w(0.00,0.00) },
    { hub:"Kamrangirchar",before9pm:w(28.05,27.29), before11pm:w(45.77,43.54), before1am:w(25.76,26.00), after1am:w(0.43,3.17) },
  ],

  handoverParam: [
    { hub:"Mohammadpur",  before12amProcessed:w(82.58,84.20), fourthSlotHandover:w(78.85,86.92), fourthSlotRatio:w(78.85,86.92), statusA:F, statusB:A },
    { hub:"Pallabi",      before12amProcessed:w(78.31,81.74), fourthSlotHandover:w(75.82,82.27), fourthSlotRatio:w(76.00,82.27), statusA:F, statusB:F },
    { hub:"Banani",       before12amProcessed:w(93.61,94.30), fourthSlotHandover:w(93.42,94.11), fourthSlotRatio:w(93.42,94.11), statusA:A, statusB:A },
    { hub:"Lalbagh",      before12amProcessed:w(72.51,70.32), fourthSlotHandover:w(57.75,55.36), fourthSlotRatio:w(57.75,55.36), statusA:F, statusB:F },
    { hub:"Uttara",       before12amProcessed:w(72.06,75.26), fourthSlotHandover:w(72.48,72.48), fourthSlotRatio:w(72.48,72.48), statusA:F, statusB:F },
    { hub:"Shewrapara",   before12amProcessed:w(90.58,97.94), fourthSlotHandover:w(83.00,90.31), fourthSlotRatio:w(83.00,90.31), statusA:F, statusB:A },
    { hub:"Diabari",      before12amProcessed:w(79.19,88.35), fourthSlotHandover:w(69.33,72.60), fourthSlotRatio:w(69.33,72.60), statusA:F, statusB:F },
    { hub:"Farmgate",     before12amProcessed:w(86.88,84.59), fourthSlotHandover:w(89.06,88.01), fourthSlotRatio:w(89.06,88.01), statusA:A, statusB:A },
    { hub:"Mirpur-1",     before12amProcessed:w(92.74,93.76), fourthSlotHandover:w(86.25,86.76), fourthSlotRatio:w(86.25,86.76), statusA:A, statusB:A },
    { hub:"Bashundhara",  before12amProcessed:w(93.44,86.80), fourthSlotHandover:w(92.55,87.47), fourthSlotRatio:w(92.55,87.47), statusA:A, statusB:A },
    { hub:"Malibagh",     before12amProcessed:w(91.54,98.29), fourthSlotHandover:w(92.70,100.0), fourthSlotRatio:w(92.70,100.0), statusA:A, statusB:A },
    { hub:"Motijheel",    before12amProcessed:w(82.98,90.41), fourthSlotHandover:w(77.56,88.40), fourthSlotRatio:w(77.56,88.40), statusA:F, statusB:A },
    { hub:"Bashabo",      before12amProcessed:w(83.41,88.90), fourthSlotHandover:w(88.92,87.16), fourthSlotRatio:w(88.92,87.16), statusA:A, statusB:A },
    { hub:"Narayanganj",  before12amProcessed:w(99.48,99.98), fourthSlotHandover:w(100.0,100.0), fourthSlotRatio:w(100.0,100.0), statusA:A, statusB:A },
    { hub:"Demra",        before12amProcessed:w(98.59,94.65), fourthSlotHandover:w(100.0,96.09), fourthSlotRatio:w(100.0,96.09), statusA:A, statusB:A },
    { hub:"Siddhirganj",  before12amProcessed:w(95.51,90.46), fourthSlotHandover:w(100.0,87.27), fourthSlotRatio:w(100.0,87.27), statusA:A, statusB:A },
    { hub:"Rayerbag",     before12amProcessed:w(87.07,85.42), fourthSlotHandover:w(95.14,96.15), fourthSlotRatio:w(95.14,96.15), statusA:A, statusB:A },
    { hub:"Badda",        before12amProcessed:w(97.97,99.47), fourthSlotHandover:w(98.55,100.0), fourthSlotRatio:w(98.55,100.0), statusA:A, statusB:A },
    { hub:"Kamrangirchar",before12amProcessed:w(90.44,84.17), fourthSlotHandover:w(100.0,92.99), fourthSlotRatio:w(100.0,92.99), statusA:A, statusB:A },
  ],

  processVsHandover: [
    { hub:"Mohammadpur",  processed:w(13612,12917), handoverQty:w(13612,12917), mismatch:w(0,0) },
    { hub:"Pallabi",      processed:w(17940,17573), handoverQty:w(17940,17573), mismatch:w(0,0) },
    { hub:"Banani",       processed:w(6807,7976),   handoverQty:w(6807,7976),   mismatch:w(0,0) },
    { hub:"Lalbagh",      processed:w(12929,11665), handoverQty:w(12927,11665), mismatch:w(3,0) },
    { hub:"Uttara",       processed:w(7856,9177),   handoverQty:w(7856,9177),   mismatch:w(0,0) },
    { hub:"Shewrapara",   processed:w(19772,18417), handoverQty:w(19772,18417), mismatch:w(0,0) },
    { hub:"Diabari",      processed:w(5204,4629),   handoverQty:w(5204,4629),   mismatch:w(0,0) },
    { hub:"Farmgate",     processed:w(15190,15206), handoverQty:w(15190,15206), mismatch:w(0,0) },
    { hub:"Mirpur-1",     processed:w(10150,9583),  handoverQty:w(10150,9583),  mismatch:w(0,0) },
    { hub:"Bashundhara",  processed:w(4450,4375),   handoverQty:w(4450,4375),   mismatch:w(0,0) },
    { hub:"Malibagh",     processed:w(4702,4260),   handoverQty:w(4702,4260),   mismatch:w(0,0) },
    { hub:"Motijheel",    processed:w(5748,5358),   handoverQty:w(5748,5358),   mismatch:w(0,0) },
    { hub:"Bashabo",      processed:w(7000,6645),   handoverQty:w(7000,6645),   mismatch:w(0,0) },
    { hub:"Narayanganj",  processed:w(1322,1304),   handoverQty:w(1322,1304),   mismatch:w(0,0) },
    { hub:"Demra",        processed:w(4566,4513),   handoverQty:w(4566,4513),   mismatch:w(0,0) },
    { hub:"Siddhirganj",  processed:w(6365,6179),   handoverQty:w(6365,6179),   mismatch:w(0,0) },
    { hub:"Rayerbag",     processed:w(5781,5534),   handoverQty:w(5781,5534),   mismatch:w(0,0) },
    { hub:"Badda",        processed:w(3112,2833),   handoverQty:w(3112,2833),   mismatch:w(0,0) },
    { hub:"Kamrangirchar",processed:w(7840,8334),   handoverQty:w(7837,8334),   mismatch:w(3,0) },
  ],

  late: [
    { hub:"Mohammadpur",  totalLate:w(14,8),  lateRatio:w(17.28,9.88) },
    { hub:"Pallabi",      totalLate:w(15,7),  lateRatio:w(18.52,8.64) },
    { hub:"Banani",       totalLate:w(3,4),   lateRatio:w(3.70,4.94) },
    { hub:"Lalbagh",      totalLate:w(8,3),   lateRatio:w(9.88,3.70) },
    { hub:"Uttara",       totalLate:w(3,0),   lateRatio:w(3.70,0.00) },
    { hub:"Shewrapara",   totalLate:w(3,8),   lateRatio:w(3.70,9.88) },
    { hub:"Diabari",      totalLate:w(7,12),  lateRatio:w(8.64,14.81) },
    { hub:"Farmgate",     totalLate:w(4,6),   lateRatio:w(4.94,7.41) },
    { hub:"Mirpur-1",     totalLate:w(6,10),  lateRatio:w(7.41,12.35) },
    { hub:"Bashundhara",  totalLate:w(1,2),   lateRatio:w(1.23,2.47) },
    { hub:"Malibagh",     totalLate:w(2,1),   lateRatio:w(2.47,1.23) },
    { hub:"Motijheel",    totalLate:w(4,7),   lateRatio:w(4.94,8.64) },
    { hub:"Bashabo",      totalLate:w(5,7),   lateRatio:w(6.17,8.64) },
    { hub:"Narayanganj",  totalLate:w(0,0),   lateRatio:w(0.00,0.00) },
    { hub:"Demra",        totalLate:w(3,3),   lateRatio:w(3.70,3.70) },
    { hub:"Siddhirganj",  totalLate:w(2,3),   lateRatio:w(2.47,3.70) },
    { hub:"Rayerbag",     totalLate:w(0,7),   lateRatio:w(0.00,8.64) },
    { hub:"Badda",        totalLate:w(0,1),   lateRatio:w(0.00,1.23) },
    { hub:"Kamrangirchar",totalLate:w(1,5),   lateRatio:w(1.23,6.17) },
  ],

  slotBreak: [
    { hub:"Mohammadpur",  totalBreak:w(1,3) },
    { hub:"Pallabi",      totalBreak:w(3,0) },
    { hub:"Banani",       totalBreak:w(0,3) },
    { hub:"Lalbagh",      totalBreak:w(4,2) },
    { hub:"Uttara",       totalBreak:w(0,3) },
    { hub:"Shewrapara",   totalBreak:w(1,0) },
    { hub:"Diabari",      totalBreak:w(7,5) },
    { hub:"Farmgate",     totalBreak:w(6,2) },
    { hub:"Mirpur-1",     totalBreak:w(1,1) },
    { hub:"Bashundhara",  totalBreak:w(1,2) },
    { hub:"Malibagh",     totalBreak:w(4,2) },
    { hub:"Motijheel",    totalBreak:w(3,3) },
    { hub:"Bashabo",      totalBreak:w(0,1) },
    { hub:"Narayanganj",  totalBreak:w(1,1) },
    { hub:"Demra",        totalBreak:w(4,5) },
    { hub:"Siddhirganj",  totalBreak:w(4,4) },
    { hub:"Rayerbag",     totalBreak:w(9,12) },
    { hub:"Badda",        totalBreak:w(2,0) },
    { hub:"Kamrangirchar",totalBreak:w(1,3) },
  ],
};
