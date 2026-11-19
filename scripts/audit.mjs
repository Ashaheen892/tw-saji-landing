import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const bundle = JSON.parse(fs.readFileSync(new URL("../twilight-bundle.json", import.meta.url), "utf8"));
const errors = [];
const names = bundle.components.map((item) => item.name);
if (!bundle.features?.includes("landing-page-templates")) errors.push("missing landing-page-templates");
if (names.length !== 18) errors.push(`expected 18 sections, found ${names.length}`);
for (const template of bundle.templates || []) {
  const file = template.path.replace("templates.", "");
  const page = JSON.parse(fs.readFileSync(new URL(`../templates/${file}.json`, import.meta.url), "utf8"));
  if (page.components.length !== 6) errors.push(`${file} should have 6 sections`);
  for (const component of page.components) {
    const dist = path.join(root, "dist", `${component.name}.js`);
    if (!fs.existsSync(dist)) errors.push(`missing dist/${component.name}.js`);
  }
}
const pages = bundle.templates.map((item) => item.path);
const used = new Set();
for (const template of bundle.templates) {
  const file = template.path.replace("templates.", "");
  const page = JSON.parse(fs.readFileSync(new URL(`../templates/${file}.json`, import.meta.url), "utf8"));
  for (const component of page.components) {
    if (used.has(component.name)) errors.push(`section repeated across pages: ${component.name}`);
    used.add(component.name);
  }
}
const banned = ["selia", "سيليا", "eslamoo"];
const scan = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git"].includes(entry.name) || entry.name === "audit.mjs") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(full);
    else if (/\.(json|ts|mjs|md|py)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8").toLowerCase();
      for (const word of banned) if (text.includes(word)) errors.push(`${full} mentions ${word}`);
    }
  }
};
scan(root);
if (new Set(pages).size !== 3) errors.push("expected three templates");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("audit ok");
