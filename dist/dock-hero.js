var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: !0 });
import { nothing, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
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
function watchLocale(host) {
  const update = /* @__PURE__ */ __name(() => host.requestUpdate(), "update");
  return window.addEventListener("language-changed", update), () => window.removeEventListener("language-changed", update);
}
__name(watchLocale, "watchLocale");
function salla() {
  return window.Salla;
}
__name(salla, "salla");
function landingSettings() {
  var _a, _b;
  return ((_b = (_a = salla()) == null ? void 0 : _a.config) == null ? void 0 : _b.get("theme.settings")) || {};
}
__name(landingSettings, "landingSettings");
function isLandingPage() {
  var _a, _b;
  return ((_b = (_a = salla()) == null ? void 0 : _a.config) == null ? void 0 : _b.get("page.is_landing_page")) === !0;
}
__name(isLandingPage, "isLandingPage");
function pageMode() {
  var _a;
  const value = landingSettings().page_for_product;
  return typeof value == "boolean" || value == null ? value === !1 ? "promotion" : "product" : typeof value == "string" ? value === "promotion" ? "promotion" : "product" : Array.isArray(value) && ((_a = value[0]) == null ? void 0 : _a.value) === "promotion" ? "promotion" : "product";
}
__name(pageMode, "pageMode");
function landingProductId() {
  var _a, _b;
  if (!isLandingPage() || pageMode() !== "product") return null;
  const id = (_b = (_a = landingSettings().product) == null ? void 0 : _a.value) == null ? void 0 : _b[0];
  return id ? String(id) : null;
}
__name(landingProductId, "landingProductId");
function mainButton() {
  const settings = landingSettings();
  return { text: String(settings.main_btn_text || ""), url: String(settings.main_btn_url || "") };
}
__name(mainButton, "mainButton");
function openCheckout() {
  const checkout = document.querySelector(".s-block--fast-checkout"), layout = checkout == null ? void 0 : checkout.getAttribute("data-layout");
  if (window.innerWidth < 1024 || layout === "side-drawer" || !checkout) {
    window.dispatchEvent(new CustomEvent("open-checkout-drawer"));
    return;
  }
  checkout.scrollIntoView({ behavior: "smooth", block: "center" });
}
__name(openCheckout, "openCheckout");
function renderCta(labelValue, fallbackUrl = "", ghost = !1) {
  const label = localizedString(labelValue).trim();
  if (!label) return nothing;
  const cls = ghost ? "rw-btn rw-btn--ghost" : "rw-btn", productPage = !!landingProductId(), demo = !isLandingPage();
  if (productPage || demo && !fallbackUrl)
    return html`<button type="button" class=${cls} @click=${() => openCheckout()}>${label}</button>`;
  const href = (isLandingPage() && pageMode() === "promotion" ? mainButton().url : "") || fallbackUrl;
  return href ? html`<a class=${cls} href=${href}>${label}</a>` : html`<button type="button" class=${cls} @click=${() => openCheckout()}>${label}</button>`;
}
__name(renderCta, "renderCta");
let toneReady = !1;
function applyTone(mode) {
  document.documentElement.classList.remove("rw-mode-light", "rw-mode-dark"), document.documentElement.classList.add(mode === "dark" ? "rw-mode-dark" : "rw-mode-light");
  try {
    localStorage.setItem("rw-landing-tone", mode);
  } catch {
  }
  window.dispatchEvent(new CustomEvent("rw-tone"));
}
__name(applyTone, "applyTone");
function rememberTone() {
  if (!toneReady) {
    toneReady = !0;
    try {
      const saved = localStorage.getItem("rw-landing-tone");
      (saved === "dark" || saved === "light") && applyTone(saved);
    } catch {
    }
  }
}
__name(rememberTone, "rememberTone");
function currentTone() {
  return document.documentElement.classList.contains("rw-mode-dark") ? "dark" : "light";
}
__name(currentTone, "currentTone");
function renderTone(enabled, dark, onToggle) {
  if (!flag(enabled)) return nothing;
  const next = t(dark ? { ar: "الوضع الفاتح", en: "Light mode" } : { ar: "الوضع الداكن", en: "Dark mode" });
  return html`<button type="button" class="rw-tone" aria-pressed=${dark ? "true" : "false"} @click=${onToggle}>${next}</button>`;
}
__name(renderTone, "renderTone");
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
const DARK = "--rw-surface:#16130f; --rw-surface-2:#221c16; --rw-card:#241f19; --rw-soft:#2c261f; --rw-text:#f6f1e8; --rw-muted:#cbbfae; --rw-border:rgb(246 241 232 / 14%);", baseCss = `
.rw-host { display: block; width: 100%; min-width: 0; container-type: inline-size; color: inherit; }
.component-card:has(> .rw-host:not(:empty)) { min-height: 0; }
.rw-block { --rw-surface:#f7f3ec; --rw-surface-2:#efe7da; --rw-card:#fffdf8; --rw-soft:#f3ecdf; --rw-text:#1c1712; --rw-muted:#6f6458; --rw-border:#e4d8c6;
  display: block; width: 100%; box-sizing: border-box; font-family: var(--font-main, inherit); color: var(--rw-text); background: var(--rw-section-bg, var(--rw-surface)); }
.rw-block.rw-dark, html.rw-mode-dark .rw-block.rw-auto { ${DARK} }
.rw-block.rw-light { --rw-surface:#f7f3ec; --rw-surface-2:#efe7da; --rw-card:#fffdf8; --rw-soft:#f3ecdf; --rw-text:#1c1712; --rw-muted:#6f6458; --rw-border:#e4d8c6; }
@media (prefers-color-scheme: dark) { html:not(.rw-mode-light) .rw-block.rw-auto { ${DARK} } }
.rw-block *, .rw-block *::before, .rw-block *::after { box-sizing: border-box; }
.rw-block img { display: block; max-width: 100%; }
.rw-block h2, .rw-block h3, .rw-block p, .rw-block ul { margin: 0; padding: 0; }
.rw-block ul { list-style: none; }
.rw-block button, .rw-block a { font: inherit; }
.rw-section { position: relative; padding-block: 2.75rem; }
@container (min-width: 800px) { .rw-section { padding-block: 4.25rem; } }
.rw-container { width: min(1120px, calc(100% - 2rem)); margin-inline: auto; }
.rw-kicker { margin-bottom: .7rem; font-size: .78rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--color-primary, #8a5a32); }
.rw-display { font-size: clamp(1.85rem, 4vw, 3.15rem); line-height: 1.2; font-weight: 700; letter-spacing: -.03em; }
.rw-title { font-size: clamp(1.55rem, 3vw, 2.35rem); line-height: 1.25; font-weight: 700; }
.rw-lead { margin-top: .85rem; max-width: 40rem; font-size: 1.05rem; line-height: 1.85; color: var(--rw-muted); }
.rw-head { margin-bottom: 1.75rem; max-width: 40rem; }
.rw-head--center { margin-inline: auto; text-align: center; }
.rw-head--center .rw-lead { margin-inline: auto; }
.rw-rule { width: 2.6rem; height: 2px; margin-top: .9rem; border-radius: 99px; background: var(--color-primary, #8a5a32); }
.rw-head--center .rw-rule { margin-inline: auto; }
.rw-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.4rem; }
.rw-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: .75rem 1.4rem; border: 1px solid transparent; border-radius: 999px; background: var(--color-primary, #8a5a32); color: var(--color-primary-reverse, #fff); font-weight: 700; text-decoration: none; cursor: pointer; transition: transform .18s ease, opacity .18s ease; }
.rw-btn:hover { transform: translateY(-1px); }
.rw-btn:focus-visible { outline: 2px solid var(--color-primary, #8a5a32); outline-offset: 3px; }
.rw-btn--ghost { background: transparent; color: var(--rw-text); border-color: var(--rw-border); }
.rw-tone { position: absolute; z-index: 2; top: .85rem; inset-inline-end: .85rem; min-height: 2.4rem; padding: .35rem .8rem; border: 1px solid var(--rw-border); border-radius: 999px; background: color-mix(in srgb, var(--rw-card) 88%, transparent); color: var(--rw-text); cursor: pointer; }
.rw-ph { display: grid; place-items: center; width: 100%; height: 100%; min-height: 16rem; padding: 1rem; text-align: center; color: var(--rw-muted); background:
  radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--color-primary, #8a5a32) 28%, transparent), transparent 42%),
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
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-dock { position: relative; display: flex; align-items: flex-end; min-height: 78vh; overflow: hidden; color: #f7f3ec; }
.rw-dock__media, .rw-dock__shade, .rw-dock__fallback { position: absolute; inset: 0; width: 100%; height: 100%; }
.rw-dock__media { object-fit: cover; }
.rw-dock__fallback { background:
  radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--color-primary, #0f6e6a) 55%, transparent), transparent 36%),
  linear-gradient(165deg, #10211f, #1b1410 70%); }
.rw-dock__shade { background: linear-gradient(180deg, rgb(0 0 0 / 10%) 10%, rgb(0 0 0 / 74%)); }
.rw-dock__body { position: relative; z-index: 1; width: min(1120px, calc(100% - 2rem)); margin: 0 auto 1.4rem; }
.rw-dock .rw-lead { color: rgb(247 243 236 / 84%); }
.rw-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 1.4rem; border: 1px solid rgb(255 255 255 / 18%); border-radius: 1.1rem; background: rgb(255 255 255 / 10%); backdrop-filter: blur(12px); }
.rw-fact { padding: .95rem .8rem; }
.rw-fact + .rw-fact { border-inline-start: 1px solid rgb(255 255 255 / 16%); }
.rw-fact strong { display: block; font-size: clamp(1.2rem, 2vw, 1.7rem); }
.rw-fact span { color: rgb(247 243 236 / 76%); font-size: .85rem; }
`, _DockHero = class _DockHero extends LitElement {
  constructor() {
    super(...arguments), this.dark = !1, this.stop = () => {
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-dock-hero", css), rememberTone(), this.dark = currentTone() === "dark";
    const onTone = /* @__PURE__ */ __name(() => {
      this.dark = currentTone() === "dark";
    }, "onTone");
    window.addEventListener("rw-tone", onTone);
    const stopLocale = watchLocale(this);
    this.stop = () => {
      window.removeEventListener("rw-tone", onTone), stopLocale();
    };
  }
  disconnectedCallback() {
    this.stop(), super.disconnectedCallback();
  }
  render() {
    const cfg = getConfig(this.config), title = localizedString(cfg.title), facts = [1, 2, 3].map((n) => ({ value: localizedString(cfg[`fact_${n}_value`]), label: localizedString(cfg[`fact_${n}_label`]) })).filter((fact) => fact.value || fact.label);
    return html`<section class="rw-block ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || t({ ar: "واجهة الرصيف", en: "Dock hero" })}>
      ${renderTone(flag(cfg.show_tone), this.dark, () => applyTone(this.dark ? "light" : "dark"))}
      <div class="rw-dock">
        ${cfg.image ? html`<img class="rw-dock__media" src=${cfg.image} alt=${localizedString(cfg.image_alt)} />` : html`<div class="rw-dock__fallback"></div>`}
        <div class="rw-dock__shade"></div>
        <div class="rw-dock__body">
          ${localizedString(cfg.kicker) ? html`<p class="rw-kicker">${localizedString(cfg.kicker)}</p>` : nothing}
          ${title ? html`<h2 class="rw-display">${title}</h2>` : nothing}
          ${localizedString(cfg.text) ? html`<p class="rw-lead">${localizedString(cfg.text)}</p>` : nothing}
          <div class="rw-actions">${renderCta(cfg.button_label, cfg.button_url || "")}</div>
          ${facts.length ? html`<div class="rw-facts">${facts.map((fact) => html`<div class="rw-fact"><strong>${fact.value}</strong><span>${fact.label}</span></div>`)}</div>` : nothing}
        </div>
      </div>
    </section>`;
  }
};
__name(_DockHero, "DockHero");
let DockHero = _DockHero;
__decorateClass([
  property({ type: Object })
], DockHero.prototype, "config");
__decorateClass([
  state()
], DockHero.prototype, "dark");
typeof DockHero < "u" && DockHero.registerSallaComponent("salla-dock-hero");
export {
  DockHero as default
};
