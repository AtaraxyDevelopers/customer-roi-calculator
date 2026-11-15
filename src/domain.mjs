import { round, sum, ratio, days, money, metric, notice } from "./lib.mjs";
export const config = {
  slug: "customer-roi-calculator",
  title: "Customer ROI Calculator",
  description:
    "Explain the potential savings and payback of a proposed solution.",
  scope:
    "Scenario calculator with a standalone embeddable HTML calculator. Results depend on inputs and do not guarantee savings or revenue.",
  method:
    "Monthly benefit = hours saved × hourly cost + additional gross profit. Net benefit subtracts recurring cost. ROI compares total benefits against implementation plus recurring costs. Payback needs positive monthly net benefit.",
  port: 4417,
  asOf: "2026-11-15",
  fields: [
    {
      key: "name",
      label: "Customer / business name",
      type: "text",
    },
    {
      key: "hoursSaved",
      label: "Hours saved per month",
      type: "number",
      min: 0,
      max: 100000000,
    },
    {
      key: "hourlyCost",
      label: "Cost per hour",
      type: "number",
      min: 0,
      max: 100000000,
    },
    {
      key: "extraProfit",
      label: "Additional gross profit per month",
      type: "number",
      min: 0,
      max: 100000000,
    },
    {
      key: "monthlyCost",
      label: "Solution cost per month",
      type: "number",
      min: 0,
      max: 100000000,
    },
    {
      key: "setupCost",
      label: "One-time implementation cost",
      type: "number",
      min: 0,
      max: 100000000,
    },
  ],
  settings: [
    {
      key: "currency",
      label: "Currency code (one currency per workspace)",
      type: "text",
      maxLength: 3,
    },
    {
      key: "months",
      label: "Evaluation period (months)",
      type: "number",
      min: 1,
      max: 120,
      integer: true,
    },
  ],
  actions: [],
  document: false,
};

export const example = {
  schemaVersion: 1,
  project: "customer-roi-calculator",
  settings: {
    currency: "USD",
    months: 12,
  },
  records: [
    {
      id: "scenario-1",
      name: "Maple Studio",
      hoursSaved: 20,
      hourlyCost: 30,
      extraProfit: 400,
      monthlyCost: 200,
      setupCost: 2400,
    },
    {
      id: "scenario-2",
      name: "River Foods",
      hoursSaved: 2,
      hourlyCost: 25,
      extraProfit: 0,
      monthlyCost: 100,
      setupCost: 500,
    },
  ],
};
export function analyze(records, s) {
  const rows = records.map((r) => {
    const benefit = r.hoursSaved * r.hourlyCost + r.extraProfit,
      net = benefit - r.monthlyCost,
      cost = r.setupCost + r.monthlyCost * s.months;
    return {
      id: r.id,
      Customer: r.name,
      "Monthly net benefit": money(net),
      "Period net benefit": money(net * s.months - r.setupCost),
      "ROI (%)": ratio(benefit * s.months - cost, cost) ?? "N/A (zero cost)",
      "Payback (months)":
        net > 0 ? round(r.setupCost / net) : "No positive payback",
    };
  });
  return {
    metrics: [
      metric("Scenarios", records.length),
      metric(
        "Positive period returns",
        rows.filter((r) => Number(r["Period net benefit"]) > 0).length,
      ),
      metric("Period (months)", s.months),
    ],
    notices: [],
    columns: [
      "Customer",
      "Monthly net benefit",
      "Period net benefit",
      "ROI (%)",
      "Payback (months)",
    ],
    rows,
  };
}
