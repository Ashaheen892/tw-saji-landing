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
function injectStyles(id, css2) {
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id, style.textContent = css2, document.head.appendChild(style);
}
__name(injectStyles, "injectStyles");
const LIGHT = "--rw-surface:#f5f6f8; --rw-surface-2:#e8ebef; --rw-card:#ffffff; --rw-soft:#eef1f4; --rw-text:var(--color-text, #1a1d21); --rw-muted:#5c6570; --rw-border:#e1e5ea;", DARK = "--rw-surface:#121417; --rw-surface-2:#1c2026; --rw-card:#1e2329; --rw-soft:#262c33; --rw-text:#f4f6f8; --rw-muted:#b7c0c9; --rw-border:rgb(255 255 255 / 14%);", baseCss = `
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
.rw-tone { position: absolute; z-index: 2; top: .85rem; inset-inline-end: .85rem; min-height: 2.4rem; padding: .35rem .8rem; border: 1px solid var(--rw-border); border-radius: 999px; background: color-mix(in srgb, var(--rw-card) 88%, transparent); color: var(--rw-text); cursor: pointer; }
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
function sectionTitle(cfg) {
  const title = localizedString(cfg.title), subtitle = localizedString(cfg.subtitle);
  if (!title && !subtitle) return nothing;
  const style = String(unwrapValue(cfg.title_style) || "hairline");
  return html`<div class="rw-ts rw-ts--${style}">
    ${title ? html`<h2>${title}</h2>` : nothing}
    ${subtitle ? html`<p>${subtitle}</p>` : nothing}
    <span class="rw-ts__mark"></span>
  </div>`;
}
__name(sectionTitle, "sectionTitle");
const titleCss = `
.rw-ts { margin-bottom: 1.6rem; text-align: center; }
.rw-ts h2 { font-size: clamp(1.55rem, 3vw, 2.35rem); line-height: 1.25; font-weight: 700; }
.rw-ts p { max-width: 36rem; margin: .7rem auto 0; color: var(--rw-muted); line-height: 1.8; }
.rw-ts__mark { display: block; margin: .85rem auto 0; }
.rw-ts--plain .rw-ts__mark { display: none; }
.rw-ts--hairline .rw-ts__mark { width: 3.2rem; height: 2px; border-radius: 99px; background: var(--color-primary, #1a1d21); }
.rw-ts--brackets h2 { display: inline-block; padding-inline: .8rem; }
.rw-ts--brackets .rw-ts__mark { display: none; }
.rw-ts--brackets h2::before, .rw-ts--brackets h2::after { content: ""; display: inline-block; width: .55rem; height: .7em; border-block: 2px solid var(--color-primary, #1a1d21); vertical-align: .05em; }
.rw-ts--brackets h2::before { border-inline-start: 2px solid var(--color-primary, #1a1d21); margin-inline-end: .45rem; }
.rw-ts--brackets h2::after { border-inline-end: 2px solid var(--color-primary, #1a1d21); margin-inline-start: .45rem; }
.rw-ts--ticket h2 { display: inline-block; padding: .15rem .7rem; border: 1px dashed var(--color-primary, #1a1d21); }
.rw-ts--ticket .rw-ts__mark { width: .45rem; height: .45rem; border: 1px solid var(--color-primary, #1a1d21); transform: rotate(45deg); }
`;
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
.rw-thread { width: min(40rem, 100%); margin-inline: auto; display: grid; gap: 0; }
.rw-thread__step { display: grid; grid-template-columns: 2.4rem 1fr; gap: .8rem; }
.rw-thread__rail { display: flex; flex-direction: column; align-items: center; }
.rw-thread__rail i { width: .7rem; height: .7rem; margin-top: .35rem; border-radius: 99px; background: var(--color-primary, #1a1d21); }
.rw-thread__rail b { flex: 1; width: 1px; background: var(--rw-border); }
.rw-thread__step:last-child .rw-thread__rail b { display: none; }
.rw-thread__body { padding-bottom: 1.2rem; }
.rw-thread__body strong { display: block; font-size: 1.05rem; }
.rw-thread__body p { margin-top: .3rem; color: var(--rw-muted); line-height: 1.75; }
`, _CareThread = class _CareThread extends LitElement {
  constructor() {
    super(...arguments), this.stop = () => {
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-title", titleCss), injectStyles("rw-care-thread", css), this.stop = watchLocale(this);
  }
  disconnectedCallback() {
    this.stop(), super.disconnectedCallback();
  }
  render() {
    const cfg = getConfig(this.config), steps = getCollectionItems(cfg.items, "items").map((item) => ({ title: localizedString(item.title), text: localizedString(item.text) })).filter((item) => item.title);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "care"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        ${steps.length ? html`<ol class="rw-thread">${steps.map((step) => html`<li class="rw-thread__step">
              <span class="rw-thread__rail"><i></i><b></b></span>
              <div class="rw-thread__body"><strong>${step.title}</strong>${step.text ? html`<p>${step.text}</p>` : ""}</div>
            </li>`)}</ol>` : emptyCopy()}
      </div>
    </section>`;
  }
};
__name(_CareThread, "CareThread");
let CareThread = _CareThread;
__decorateClass([
  property({ type: Object })
], CareThread.prototype, "config");
typeof CareThread < "u" && CareThread.registerSallaComponent("salla-care-thread");
export {
  CareThread as default
};
