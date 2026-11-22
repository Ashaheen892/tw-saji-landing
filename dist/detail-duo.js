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
function media(src, alt, className = "") {
  return src ? html`<img class=${className} src=${src} alt=${alt} loading="lazy" />` : html`<div class="rw-ph ${className}"><span class="rw-hint">${t({ ar: "أضف الصورة من إعدادات القسم. المقاس المقترح مذكور بجانب الحقل.", en: "Add an image in the section settings. The suggested size is next to the field." })}</span></div>`;
}
__name(media, "media");
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-duo { display: grid; gap: 1.15rem; }
@container (min-width: 840px) { .rw-duo { grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); align-items: end; gap: 1.35rem; } }
.rw-shot { display: flex; flex-direction: column; margin: 0; overflow: hidden; border: 1px solid var(--rw-border); border-radius: 1.3rem; background: var(--rw-card); }
.rw-shot__frame { position: relative; aspect-ratio: 4 / 5; max-height: 28rem; overflow: hidden; background: var(--rw-soft); }
@container (min-width: 840px) {
  .rw-shot__frame { max-height: 32rem; }
  .rw-shot--b .rw-shot__frame { aspect-ratio: 1 / 1; max-height: 24rem; }
}
.rw-shot img, .rw-shot .rw-ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.rw-shot figcaption { padding: 1rem 1.1rem 1.15rem; }
.rw-shot h3 { font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; }
.rw-shot h3::after { content: ""; display: block; width: 1.75rem; height: 2px; margin-top: .55rem; border-radius: 99px; background: var(--color-primary, #1a1d21); }
.rw-shot p { margin-top: .55rem; color: var(--rw-muted); line-height: 1.75; }
`;
function shot(image, alt, title, text, extra = "") {
  return html`<figure class="rw-shot ${extra}">
    <div class="rw-shot__frame">${media(image, alt || title)}</div>
    ${title || text ? html`<figcaption>${title ? html`<h3>${title}</h3>` : nothing}${text ? html`<p>${text}</p>` : nothing}</figcaption>` : nothing}
  </figure>`;
}
__name(shot, "shot");
const _DetailDuo = class _DetailDuo extends LitElement {
  constructor() {
    super(...arguments), this.stop = () => {
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-detail-duo", css), this.stop = watchLocale(this);
  }
  disconnectedCallback() {
    this.stop(), super.disconnectedCallback();
  }
  render() {
    const cfg = getConfig(this.config);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "details"}>
      <div class="rw-container">
        ${heading(cfg)}
        <div class="rw-duo">
          ${shot(cfg.image_a || "", localizedString(cfg.alt_a), localizedString(cfg.title_a), localizedString(cfg.text_a))}
          ${shot(cfg.image_b || "", localizedString(cfg.alt_b), localizedString(cfg.title_b), localizedString(cfg.text_b), "rw-shot--b")}
        </div>
      </div>
    </section>`;
  }
};
__name(_DetailDuo, "DetailDuo");
let DetailDuo = _DetailDuo;
__decorateClass([
  property({ type: Object })
], DetailDuo.prototype, "config");
typeof DetailDuo < "u" && DetailDuo.registerSallaComponent("salla-detail-duo");
export {
  DetailDuo as default
};
