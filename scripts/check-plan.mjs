import fs from "node:fs";
const plan = fs.readFileSync("content/editorial/plan.csv", "utf8").replace(/\r/g, "").trim().split("\n");
const published = new Set(
  fs.readdirSync("content/blog").filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""))
);
function parse(line) {
  const out = []; let cur = "", q = false;
  for (const c of line) {
    if (c === '"') q = !q;
    else if (c === "," && !q) { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}
let afaire = 0; const collide = []; const todo = [];
for (let i = 1; i < plan.length; i++) {
  const c = parse(plan[i]);
  const slug = c[2], st = c[6];
  if (st === "a_faire") {
    afaire++;
    if (published.has(slug)) collide.push(slug);
    todo.push({ ordre: c[0], slug, fmt: c[3], preuves: c[5] });
  }
}
console.log("a_faire total:", afaire);
console.log("collisions slug avec articles publiés:", collide.length, collide);
console.log("3 premiers a_faire:", JSON.stringify(todo.slice(0, 3), null, 1));
