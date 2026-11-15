import test from "node:test";
import assert from "node:assert/strict";
import { config, example, analyze } from "../src/domain.mjs";
import { validateState } from "../src/lib.mjs";
test("Documented sample results match independently specified expectations", () => {
  const report = analyze(example.records, example.settings, config.asOf);
  for (const [label, value] of [
    ["Scenarios", 2],
    ["Positive period returns", 1],
    ["Period (months)", 12],
  ])
    assert.equal(
      report.metrics.find((m) => m.label === label).value,
      value,
      label,
    );
});
test("Business edge cases", () => {
  (function edge(records, s, analyze) {
    let row = analyze([records[0]], s).rows[0];
    assert.equal(row["ROI (%)"], 150);
    assert.equal(row["Payback (months)"], 3);
    row = analyze([{ ...records[0], setupCost: 0, monthlyCost: 0 }], s).rows[0];
    assert.equal(row["ROI (%)"], "N/A (zero cost)");
  })(example.records, example.settings, analyze, validateState);
});
