import type { ReportsData } from "../types/reports.types";

export const MOCK_REPORTS: ReportsData = {
  kpis: [
    { label: "Total Revenue (YTD)", value: "₹284.3k", delta: "+31.2%", deltaUp: true,  stripe: "blue"   },
    { label: "Total Patients",      value: "1,842",    delta: "+18.5%", deltaUp: true,  stripe: "teal"   },
    { label: "Avg Monthly Revenue", value: "₹23.7k",   delta: "+8.4%",  deltaUp: true,  stripe: "amber"  },
    { label: "Avg / Patient",       value: "₹154",     delta: "+10.7%", deltaUp: true,  stripe: "purple" },
  ],

  monthlyRev: [
    { mo: "Jan", rev: 18200, patients: 120 },
    { mo: "Feb", rev: 21500, patients: 138 },
    { mo: "Mar", rev: 19800, patients: 125 },
    { mo: "Apr", rev: 23400, patients: 152 },
    { mo: "May", rev: 25600, patients: 160 },
    { mo: "Jun", rev: 22100, patients: 145 },
    { mo: "Jul", rev: 24700, patients: 158 },
    { mo: "Aug", rev: 26900, patients: 171 },
    { mo: "Sep", rev: 23800, patients: 150 },
    { mo: "Oct", rev: 28500, patients: 182 },
    { mo: "Nov", rev: 31200, patients: 198 },
    { mo: "Dec", rev: 18600, patients: 123 },
  ],

  visitTypeRev: [
    { name: "New Consultation", value: 112000, pct: 100 },
    { name: "Follow-Up",        value: 94000,  pct: 84  },
    { name: "Emergency",        value: 48000,  pct: 43  },
    { name: "Tele-consultation", value: 30300, pct: 27  },
  ],

  bubbleData: [
    { x: 160, y: 112, r: 28, color: "#2563eb",  label: "MDD",    tooltip: { Revenue: "₹82k",  Cases: 160 } },
    { x: 120, y: 85,  r: 22, color: "#7c3aed",  label: "Anxiety",tooltip: { Revenue: "₹61k",  Cases: 120 } },
    { x: 80,  y: 70,  r: 18, color: "#0ea5a0",  label: "Insomnia",tooltip: { Revenue: "₹44k", Cases: 80  } },
    { x: 55,  y: 95,  r: 15, color: "#f59e0b",  label: "PTSD",   tooltip: { Revenue: "₹32k",  Cases: 55  } },
    { x: 40,  y: 50,  r: 12, color: "#10b981",  label: "OCD",    tooltip: { Revenue: "₹22k",  Cases: 40  } },
    { x: 30,  y: 40,  r: 10, color: "#ef4444",  label: "Bipolar",tooltip: { Revenue: "₹18k",  Cases: 30  } },
  ],

  heatmap: [
    { mo: "Jan", v0: 18200, v1: 120 },
    { mo: "Feb", v0: 21500, v1: 138 },
    { mo: "Mar", v0: 19800, v1: 125 },
    { mo: "Apr", v0: 23400, v1: 152 },
    { mo: "May", v0: 25600, v1: 160 },
    { mo: "Jun", v0: 22100, v1: 145 },
    { mo: "Jul", v0: 24700, v1: 158 },
    { mo: "Aug", v0: 26900, v1: 171 },
    { mo: "Sep", v0: 23800, v1: 150 },
    { mo: "Oct", v0: 28500, v1: 182 },
    { mo: "Nov", v0: 31200, v1: 198 },
    { mo: "Dec", v0: 18600, v1: 123 },
  ],

  topDrugs: [
    { name: "Lithium 300mg",      value: 312, pct: 100 },
    { name: "Sertraline 50mg",    value: 278, pct: 89  },
    { name: "Escitalopram 10mg",  value: 241, pct: 77  },
    { name: "Clonazepam 0.5mg",   value: 198, pct: 63  },
    { name: "Quetiapine 25mg",    value: 167, pct: 54  },
  ],

  insights: [
    {
      icon: "trendUp",
      color: "var(--ins-secondary, #1c84c6)",
      bg: "#dbeafe",
      title: "Revenue Trend",
      body: "Revenue grew 31% YoY. Q4 shows peak season with Nov at highest.",
    },
    {
      icon: "pieChart",
      color: "#7c3aed",
      bg: "#f5f3ff",
      title: "Top Diagnosis",
      body: "MDD accounts for 34% of all consultations this year.",
    },
    {
      icon: "info",
      color: "var(--ins-primary, #1ab394)",
      bg: "var(--ins-primary-bg-subtle, #e8f7f4)",
      title: "Patient Load",
      body: "Peak consultation days are Tuesday, Wednesday and Thursday.",
    },
    {
      icon: "arrowUp",
      color: "var(--ins-success, #0acf97)",
      bg: "#dcfce7",
      title: "Best Drug",
      body: "Lithium 300mg yields highest per-unit revenue across all prescriptions.",
    },
  ],
};