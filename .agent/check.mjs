#!/usr/bin/env node
import fs from "fs";
import path from "path";
const ROOT = process.cwd();
const P = p => path.join(ROOT, p);
const exists = p => fs.existsSync(P(p));
const fail = m => { console.error(`FAIL ${m}`); process.exit(1); };
const ok = m => console.log(`OK ${m}`);
const readJson = p => { try { return JSON.parse(fs.readFileSync(P(p), "utf8")); } catch (e) { fail(`JSON_INVALID ${p}: ${e.message}`); } };
function walk(dir) {
  if (!exists(dir)) return [];
  const out = [];
  const rec = d => fs.readdirSync(d).forEach(n => {
    const p = path.join(d, n), rel = path.relative(ROOT, p).replace(/\\/g, "/");
    fs.statSync(p).isDirectory() ? rec(p) : out.push(rel);
  });
  rec(P(dir));
  return out;
}
function routeData() {
  const ctx = readJson(".agent/context.json");
  const routes = {};
  for (const pack of ctx.route_packs || []) Object.assign(routes, readJson(pack).routes || {});
  return { ctx, routes };
}
function baseRef(ref) { return ref.includes(":") ? ref.split(":")[0] : ref; }
function isVirtual(ref, ctx) { return (ctx.virtual_refs || []).includes(ref) || (ref.includes(":") && (ctx.virtual_refs || []).includes(ref.split(":")[0])); }
function refsValid() {
  const { ctx, routes } = routeData();
  for (const [name, route] of Object.entries(routes)) {
    for (const key of ["read", "final", "refresh"]) for (const raw of route[key] || []) {
      const ref = baseRef(raw);
      if (!isVirtual(ref, ctx) && !exists(ref)) fail(`MISSING_REF route=${name} ref=${raw}`);
    }
  }
  ok("route references");
}
function clean() {
  for (const rel of walk(".")) {
    if (rel.startsWith("node_modules/")) continue;
    if (/(scratch|pressure_work|test_process|delivery-contract-test)/i.test(rel)) fail(`FORBIDDEN_TEMP_FILE ${rel}`);
    if (/\.(md|json|js|mjs|txt|yml|yaml)$/i.test(rel) && fs.readFileSync(P(rel), "utf8").includes("\uFFFD")) fail(`BAD_ENCODING_MARK ${rel}`);
  }
}
function validate() {
  const required = ["AGENTS.md", ".agent/context.json", ".agent/state.json", ".agent/lifecycle.json", ".agent/policy.json", ".agent/output-contract.json", ".agent/test-tasks.json", ".agent/routes/core.json", "README.md", "CODEX_CONTINUE_PROMPT.md"];
  required.forEach(p => { if (!exists(p)) fail(`MISSING ${p}`); });
  [".agent/context.json", ".agent/state.json", ".agent/lifecycle.json", ".agent/policy.json", ".agent/output-contract.json", ".agent/test-tasks.json", ".agent/routes/core.json"].forEach(readJson);
  const state = readJson(".agent/state.json");
  if (!Array.isArray(state.budget?.default_entry_files)) fail("STATE default_entry_files missing");
  if (state.budget.default_entry_files.length > state.budget.max_default_files) fail("STATE default entry exceeds budget");
  const policy = readJson(".agent/policy.json");
  if (!policy.destructive_operations || !policy.subagent) fail("POLICY missing hard constraints");
  if (policy.subagent.required_doc && !exists(policy.subagent.required_doc)) fail(`POLICY subagent required_doc missing: ${policy.subagent.required_doc}`);
  const contract = readJson(".agent/output-contract.json");
  ["## 修改摘要", "## 修改文件", "## 验证结果", "## 变更审查", "## 风险与遗留问题"].forEach(s => {
    if (!(contract.required_sections || []).includes(s)) fail(`CONTRACT missing ${s}`);
  });
  refsValid(); clean(); ok("core validation");
}
function showRoute(name) {
  const { routes } = routeData();
  const route = routes[name] || routes.unknown_task;
  console.log(JSON.stringify({ route: routes[name] ? name : "unknown_task", ...route }, null, 2));
}
function listRoutes() { console.log(Object.keys(routeData().routes).sort().join("\n")); }
function learn(sig = "unknown", candidate = null) {
  const p = ".agent/state.json", state = readJson(p);
  state.route_learning_queue ||= [];
  const item = state.route_learning_queue.find(x => x.sig === sig);
  item ? (item.count++, item.last_seen = new Date().toISOString().slice(0, 10), candidate && (item.candidate_route = candidate)) : state.route_learning_queue.push({ sig, count: 1, last_seen: new Date().toISOString().slice(0, 10), candidate_route: candidate });
  const max = state.route_gc?.max_queue || 20;
  state.route_learning_queue = state.route_learning_queue.slice(-max);
  fs.writeFileSync(P(p), JSON.stringify(state, null, 2) + "\n", "utf8"); ok("learn");
}
function gc() { const p = ".agent/state.json", s = readJson(p), max = s.route_gc?.max_queue || 20; if (Array.isArray(s.route_learning_queue)) s.route_learning_queue = s.route_learning_queue.slice(-max); fs.writeFileSync(P(p), JSON.stringify(s, null, 2) + "\n", "utf8"); ok("gc"); }
function test() { validate(); const tasks = readJson(".agent/test-tasks.json").tasks || []; tasks.forEach(t => { if (!t.id) fail("TEST_TASK missing id"); }); ok(`test tasks ${tasks.length}`); }
function stress() { const { routes } = routeData(); const names = Object.keys(routes); let max = 0, total = 0; for (let i = 0; i < 10000; i++) { const r = routes[names[i % names.length]]; const refs = new Set([...(r.read || []), ...(r.final || []), ...(r.refresh || [])]); max = Math.max(max, refs.size); total += refs.size; if (refs.size > 30) fail(`ROUTE_EXPLOSION refs=${refs.size}`); } ok(`stress max_refs=${max} avg_refs=${(total / 10000).toFixed(2)}`); }
function delivery(file) {
  if (!file || !exists(file)) fail("DELIVERY file missing");
  const text = fs.readFileSync(P(file), "utf8"), c = readJson(".agent/output-contract.json");
  for (const s of c.required_sections || []) if (!text.includes(s)) fail(`DELIVERY missing ${s}`);
  for (const [section, words] of Object.entries(c.section_requirements || {})) for (const w of words || []) if (!text.includes(w)) fail(`DELIVERY missing keyword ${section} -> ${w}`);
  ok("delivery contract");
}
const a = process.argv.slice(2);
if (a[0] === "routes") listRoutes();
else if (a[0] === "route") showRoute(a[1] || "unknown_task");
else if (a[0] === "learn") learn(a[1], a[2] || null);
else if (a[0] === "gc") gc();
else if (a[0] === "test") test();
else if (a[0] === "stress") stress();
else if (a[0] === "state") console.log(JSON.stringify(readJson(".agent/state.json"), null, 2));
else if (a[0] === "--delivery") delivery(a[1]);
else validate();
