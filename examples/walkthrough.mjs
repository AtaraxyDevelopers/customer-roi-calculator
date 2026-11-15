import assert from "node:assert/strict";
import { config, example, analyze } from "../src/domain.mjs";
import { validateState } from "../src/lib.mjs";
// Reduce the first scenario's saved hours to zero, leaving its other inputs unchanged.
// This changes a copy of fictional data; no files or external services are changed.
const workspace = structuredClone(example);
Object.assign(workspace.records[0], { hoursSaved: 0 });
const valid = validateState(workspace, config);
const report = analyze(valid.records, valid.settings, config.asOf);
const actual = report.metrics.find(
  (metric) => metric.label === "Positive period returns",
).value;
assert.equal(actual, 0);
console.log("Positive period returns: " + actual);
