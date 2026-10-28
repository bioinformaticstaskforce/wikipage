// Sanity checks for src/data.ts — run with `npm run check:data`.
import assert from 'node:assert/strict';
import { STEPS, STATIONS, TOOLS, LINES, recommendLine } from '../src/data.ts';

const stepOmics = new Map(STEPS.map((s) => [s.id, s.omics]));
const stationIds = new Set(STATIONS.map((s) => s.id));

for (const st of STATIONS) {
  assert.ok(TOOLS[st.toolId], `station ${st.id}: unknown tool ${st.toolId}`);
  assert.ok(stepOmics.has(st.stepId), `station ${st.id}: unknown step ${st.stepId}`);
}
assert.equal(stationIds.size, STATIONS.length, 'duplicate station id');

for (const step of STEPS) {
  const hubs = STATIONS.filter((s) => s.stepId === step.id && (s.type === 'hub' || s.type === 'file'));
  assert.ok(hubs.length <= 1, `step ${step.id}: ${hubs.length} hubs would overlap on the centre row`);
  const rows = STATIONS.filter((s) => s.stepId === step.id && s.row !== undefined).map((s) => s.row);
  assert.equal(new Set(rows).size, rows.length, `step ${step.id}: two stations share a row`);
  assert.ok(rows.every((r) => r !== 0 && Math.abs(r!) <= 2), `step ${step.id}: rows must be ±1 or ±2`);
}

for (const line of LINES) {
  for (const stop of line.stops) {
    assert.ok(stationIds.has(stop), `line ${line.id}: unknown stop ${stop}`);
    const st = STATIONS.find((s) => s.id === stop)!;
    assert.equal(stepOmics.get(st.stepId), line.omicsCategory, `line ${line.id}: stop ${stop} is not ${line.omicsCategory}`);
  }
}

for (const [goal, material] of [['somatic', 'fresh'], ['somatic', 'cfdna'], ['germline', 'ffpe'], ['comprehensive', 'ffpe']]) {
  assert.ok(LINES.some((l) => l.id === recommendLine(goal, material)), `no line for ${goal}/${material}`);
}

console.log(`data OK: ${LINES.length} lines, ${STATIONS.length} stations, ${Object.keys(TOOLS).length} tools`);
