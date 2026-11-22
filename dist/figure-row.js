var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: !0 });
import { nothing, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
function getConfig(raw) {
  return raw ? raw.component && typeof raw.component == "object" ? raw.component : raw : {};
}
__name(getConfig, "getConfig");
function getLocale() {
  var _a, _b, _c;
  const lang = ((_c = (_b = (_a = window.Salla) == null ? void 0 : _a.lang) == null ? void 0 : _b.getLocale) == null ? void 0 : _c.call(_b)) || document.documentElement.lang || "ar";
  return String(lang).toLowerCase().startsWith("en") ? "en" : "ar";
}
__name(getLocale, "getLocale");
function localizedString(value) {
  if (value == null || value === "") return "";
  if (typeof value == "string") return value;
  if (typeof value == "object") {
    const obj = value, text = obj[getLocale()] || obj.ar || obj.en;
    return typeof text == "string" ? text : "";
  }
  return String(value);
}
__name(localizedString, "localizedString");
function t(strings) {
  return getLocale() === "ar" ? strings.ar : strings.en;
}
__name(t, "t");
function unwrapValue(value) {
  var _a;
  return Array.isArray(value) ? unwrapValue(((_a = value[0]) == null ? void 0 : _a.value) ?? value[0] ?? "") : value && typeof value == "object" && "value" in value ? value.value : value ?? "";
}
__name(unwrapValue, "unwrapValue");
function flag(value) {
  const raw = unwrapValue(value);
  return raw === !0 || raw === "true" || raw === 1 || raw === "1";
}
__name(flag, "flag");
function getCollectionItems(items, prefix) {
  return Array.isArray(items) ? items.map((item) => {
    if (!item || typeof item != "object") return {};
    const normalized = {};
    for (const [key, val] of Object.entries(item))
      normalized[key.startsWith(`${prefix}.`) ? key.slice(prefix.length + 1) : key] = val;
    return normalized;
  }) : [];
}
__name(getCollectionItems, "getCollectionItems");
function watchLocale(host) {
  const update = /* @__PURE__ */ __name(() => host.requestUpdate(), "update");
  return window.addEventListener("language-changed", update), () => window.removeEventListener("language-changed", update);
}
__name(watchLocale, "watchLocale");
function schemeOf(cfg) {
  const scheme = String(unwrapValue(cfg.color_scheme) || "auto");
  return scheme === "dark" ? "rw-dark" : scheme === "light" ? "rw-light" : "rw-auto";
}
__name(schemeOf, "schemeOf");
const AR = "٠١٢٣٤٥٦٧٨٩", NUM = /[+-]?[\d٠-٩]+(?:[.,٫٬][\d٠-٩]+)*/;
function parse(text) {
  const match = text.match(NUM);
  if (!match || match.index === void 0) return null;
  const raw = match[0], arabic = /[٠-٩]/.test(raw), latin = raw.replace(/[٠-٩]/g, (d) => String(AR.indexOf(d))), decimalMark = /[.٫](\d+)$/.exec(latin), decimals = decimalMark && decimalMark[1].length < 3 ? decimalMark[1].length : 0, grouped = /[,٬]/.test(latin) || !decimals && /[.٫]\d{3}/.test(latin), clean = decimals ? latin.replace(/[,٬]/g, "").replace(/[٫]/, ".") : latin.replace(/[.,٫٬]/g, ""), value = Number(clean);
  return !Number.isFinite(value) || value === 0 ? null : { before: text.slice(0, match.index), after: text.slice(match.index + raw.length), value, decimals, arabic, grouped };
}
__name(parse, "parse");
function format(n, p) {
  let out = p.decimals ? n.toFixed(p.decimals) : String(Math.round(n));
  return p.grouped && (out = out.replace(/\B(?=(\d{3})+(?!\d))/g, p.arabic ? "٬" : ",")), p.arabic && (out = out.replace(/\d/g, (d) => AR[Number(d)]).replace(".", "٫")), p.before + out + p.after;
}
__name(format, "format");
const done = /* @__PURE__ */ new WeakSet();
function countUp(root, selector, duration = 1400) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches, nodes = Array.from(root.querySelectorAll(selector)).filter((el) => !done.has(el));
  if (reduced || !nodes.length || !("IntersectionObserver" in window)) return () => {
  };
  const frames = /* @__PURE__ */ new Set(), io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const final = el.dataset.countFinal || el.textContent || "", parsed = parse(final);
      if (!parsed) return;
      el.dataset.countFinal = final, done.add(el);
      const start = performance.now(), tick = /* @__PURE__ */ __name((now) => {
        const k = Math.min(1, (now - start) / duration), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = k < 1 ? format(parsed.value * eased, parsed) : final, k < 1 && frames.add(requestAnimationFrame(tick));
      }, "tick");
      el.textContent = format(0, parsed), frames.add(requestAnimationFrame(tick));
    });
  }, { threshold: 0.4 });
  return nodes.forEach((el) => io.observe(el)), () => {
    io.disconnect(), frames.forEach((id) => cancelAnimationFrame(id));
  };
}
__name(countUp, "countUp");
function markEditing() {
  var _a, _b;
  const root = document.documentElement, read = /* @__PURE__ */ __name(() => {
    var _a2, _b2;
    let on = !0;
    try {
      const salla = window.Salla;
      on = window.self !== window.top || ((_b2 = (_a2 = salla == null ? void 0 : salla.config) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, "page.is_landing_page")) !== !0;
    } catch {
      on = !0;
    }
    root.dataset.lpEditing = on ? "1" : "0";
  }, "read");
  if (!root.dataset.lpEditing) {
    read();
    try {
      (_b = (_a = window.Salla) == null ? void 0 : _a.onReady) == null || _b.call(_a, read);
    } catch {
    }
  }
}
__name(markEditing, "markEditing");
function injectStyles(id, css2) {
  if (markEditing(), document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id, style.textContent = css2, document.head.appendChild(style);
}
__name(injectStyles, "injectStyles");
const LIGHT = "--rw-surface:#f5f6f8; --rw-surface-2:#e8ebef; --rw-card:#ffffff; --rw-soft:#eef1f4; --rw-text:var(--color-text, #1a1d21); --rw-muted:#5c6570; --rw-border:#e1e5ea;", DARK = "--rw-surface:#121417; --rw-surface-2:#1c2026; --rw-card:#1e2329; --rw-soft:#262c33; --rw-text:#f4f6f8; --rw-muted:#b7c0c9; --rw-border:rgb(255 255 255 / 14%);", baseCss = `
html[data-lp-editing="0"] .rw-empty, html[data-lp-editing="0"] .rw-hint { display: none !important; }
.rw-host { display: block; width: 100%; min-width: 0; container-type: inline-size; color: inherit; }
.component-card:has(> .rw-host:not(:empty)) { min-height: 0; }
.rw-block { ${LIGHT}
  display: block; width: 100%; box-sizing: border-box; font-family: var(--font-main, inherit); color: var(--rw-text); background: var(--rw-section-bg, var(--rw-surface)); }
.rw-block.rw-dark, html.rw-mode-dark .rw-block.rw-auto { ${DARK} }
.rw-block.rw-light { ${LIGHT} }
@media (prefers-color-scheme: dark) { html:not(.rw-mode-light) .rw-block.rw-auto { ${DARK} } }
.rw-block *, .rw-block *::before, .rw-block *::after { box-sizing: border-box; }
.rw-block img { display: block; max-width: 100%; }
.rw-block h2, .rw-block h3, .rw-block p, .rw-block ul { margin: 0; padding: 0; }
.rw-block ul { list-style: none; }
.rw-block button, .rw-block a { font: inherit; }
.rw-section { position: relative; padding-block: 2.75rem; }
@container (min-width: 800px) { .rw-section { padding-block: 4.25rem; } }
.rw-container { width: min(1120px, calc(100% - 2rem)); margin-inline: auto; }
.rw-kicker { margin-bottom: .55rem; font-size: .92rem; font-weight: 700; color: var(--color-primary, #1a1d21); }
.rw-display { font-size: clamp(1.85rem, 4vw, 3.15rem); line-height: 1.2; font-weight: 700; letter-spacing: -.03em; }
.rw-title { font-size: clamp(1.55rem, 3vw, 2.35rem); line-height: 1.25; font-weight: 700; }
.rw-lead { margin-top: .85rem; max-width: 40rem; font-size: 1.05rem; line-height: 1.85; color: var(--rw-muted); }
.rw-head { margin-bottom: 1.75rem; max-width: 40rem; }
.rw-head--center { margin-inline: auto; text-align: center; }
.rw-head--center .rw-lead { margin-inline: auto; }
.rw-rule { width: 2.6rem; height: 2px; margin-top: .9rem; border-radius: 99px; background: var(--color-primary, #1a1d21); }
.rw-head--center .rw-rule { margin-inline: auto; }
.rw-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.4rem; }
.rw-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: .75rem 1.4rem; border: 1px solid transparent; border-radius: .7rem; background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); font-weight: 700; text-decoration: none; cursor: pointer; }
.rw-btn:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 3px; }
.rw-btn--ghost { background: transparent; color: var(--rw-text); border-color: var(--rw-border); }
.rw-ph { display: grid; place-items: center; width: 100%; height: 100%; min-height: 16rem; padding: 1rem; text-align: center; color: var(--rw-muted); background:
  radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--color-primary, #1a1d21) 22%, transparent), transparent 42%),
  linear-gradient(160deg, var(--rw-soft), var(--rw-surface-2)); }
.rw-empty { padding: 1.2rem; border: 1px dashed var(--rw-border); border-radius: 1rem; color: var(--rw-muted); text-align: center; }
@media (prefers-reduced-motion: reduce) {
  .rw-btn, .rw-note, .rw-reason { transition: none !important; }
  .rw-btn:hover { transform: none; }
}
`;
function sectionStyle(cfg) {
  return cfg.bg_color ? `--rw-section-bg:${cfg.bg_color}` : "";
}
__name(sectionStyle, "sectionStyle");
function heading(cfg, center = !1) {
  const kicker = localizedString(cfg.kicker), title = localizedString(cfg.title), subtitle = localizedString(cfg.subtitle);
  return !kicker && !title && !subtitle ? nothing : html`<div class="rw-head ${center ? "rw-head--center" : ""}">
    ${kicker ? html`<p class="rw-kicker">${kicker}</p>` : nothing}
    ${title ? html`<h2 class="rw-title">${title}</h2>` : nothing}
    ${subtitle ? html`<p class="rw-lead">${subtitle}</p>` : nothing}
    ${title ? html`<span class="rw-rule"></span>` : nothing}
  </div>`;
}
__name(heading, "heading");
function emptyCopy() {
  return html`<p class="rw-empty">${t({ ar: "أضف عناصر هذا القسم من الإعدادات", en: "Add this section's items in the settings" })}</p>`;
}
__name(emptyCopy, "emptyCopy");
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-stats { display: grid; }
@container (min-width: 720px) { .rw-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rw-stat { padding: 1.15rem 0; border-block-end: 1px solid var(--rw-border); }
@container (min-width: 720px) {
  .rw-stat { padding: .2rem 1.5rem 0; border-block-end: 0; border-inline-start: 1px solid var(--rw-border); }
  .rw-stat:first-child { padding-inline-start: 0; border-inline-start: 0; }
}
.rw-stat b { display: block; font-size: clamp(2.4rem, 5vw, 3.7rem); font-weight: 800; letter-spacing: -.045em; line-height: .95; font-variant-numeric: tabular-nums; }
.rw-stat span { display: block; margin-top: .55rem; color: var(--rw-muted); max-width: 16ch; }
`, _StatStrip = class _StatStrip extends LitElement {
  constructor() {
    super(...arguments), this.stop = () => {
    }, this.stopCount = () => {
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-stat-strip", css), this.stop = watchLocale(this);
  }
  disconnectedCallback() {
    this.stop(), this.stopCount(), super.disconnectedCallback();
  }
  updated() {
    const cfg = getConfig(this.config);
    (cfg.count_up === void 0 || cfg.count_up === "" || flag(cfg.count_up)) && (this.stopCount(), this.stopCount = countUp(this, ".rw-stat b"));
  }
  render() {
    const cfg = getConfig(this.config), items = getCollectionItems(cfg.items, "items").map((item) => ({ value: localizedString(item.value), label: localizedString(item.label) })).filter((item) => item.value);
    return html`<section id="rw-stats" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "stats"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${items.length ? html`<div class="rw-stats">${items.map((item) => html`<article class="rw-stat"><b .textContent=${item.value}></b>${item.label ? html`<span>${item.label}</span>` : ""}</article>`)}</div>` : emptyCopy()}
      </div>
    </section>`;
  }
};
__name(_StatStrip, "StatStrip");
let StatStrip = _StatStrip;
__decorateClass([
  property({ type: Object })
], StatStrip.prototype, "config");
typeof StatStrip < "u" && StatStrip.registerSallaComponent("salla-figure-row");
export {
  StatStrip as default
};
