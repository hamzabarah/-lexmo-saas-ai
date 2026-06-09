import fs from "node:fs";
// usage: node scripts/set-statut.mjs publie slug1 slug2 ...
const [, , statut, ...slugs] = process.argv;
const target = new Set(slugs);
const path = "content/editorial/plan.csv";
const raw = fs.readFileSync(path, "utf8");
const eol = raw.includes("\r\n") ? "\r\n" : "\n";
const lines = raw.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
function parse(line) {
  const out = []; let cur = "", q = false;
  for (const c of line) {
    if (c === '"') { q = !q; cur += c; }
    else if (c === "," && !q) { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}
let n = 0;
for (let i = 1; i < lines.length; i++) {
  const c = parse(lines[i]);
  if (target.has(c[2])) {
    c[6] = statut;
    lines[i] = c.join(",");
    n++;
  }
}
fs.writeFileSync(path, lines.join(eol) + eol, "utf8");
console.log(`statut="${statut}" appliqué à ${n}/${slugs.length} slugs`);
