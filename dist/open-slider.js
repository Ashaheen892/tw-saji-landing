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
function emptyCopy() {
  return html`<p class="rw-empty">${t({ ar: "أضف عناصر هذا القسم من الإعدادات", en: "Add this section's items in the settings" })}</p>`;
}
__name(emptyCopy, "emptyCopy");
function media(src, alt, className = "") {
  return src ? html`<img class=${className} src=${src} alt=${alt} loading="lazy" />` : html`<div class="rw-ph ${className}">${t({ ar: "أضف الصورة من إعدادات القسم. المقاس المقترح مذكور بجانب الحقل.", en: "Add an image in the section settings. The suggested size is next to the field." })}</div>`;
}
__name(media, "media");
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-opener { display: grid; background: var(--rw-card); }
.rw-opener__media { order: -1; min-height: 16rem; background: var(--rw-soft); }
.rw-opener__media img, .rw-opener__media .rw-ph { width: 100%; height: 100%; min-height: 16rem; object-fit: cover; }
@container (min-width: 860px) {
  .rw-opener { grid-template-columns: minmax(18rem, .78fr) minmax(0, 1.22fr); min-height: 36rem; }
  .rw-opener__media { order: 0; min-height: 0; }
  .rw-opener__media img, .rw-opener__media .rw-ph { min-height: 100%; }
}
.rw-opener__copy { display: flex; flex-direction: column; justify-content: space-between; gap: 1.4rem; padding: 1.4rem 1.25rem 1.2rem; }
@container (min-width: 860px) { .rw-opener__copy { padding: 2.2rem 2rem; } }
.rw-opener__copy h2 { font-size: clamp(1.7rem, 3.4vw, 2.8rem); line-height: 1.2; font-weight: 700; }
.rw-opener__copy p { max-width: 36rem; color: var(--rw-muted); line-height: 1.8; }
.rw-opener__jumps { display: grid; }
.rw-opener__jumps button { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .7rem; align-items: baseline; width: 100%; padding: .7rem 0; border: 0; border-top: 1px solid var(--rw-border); background: transparent; color: var(--rw-muted); text-align: start; cursor: pointer; }
.rw-opener__jumps button:last-child { border-bottom: 1px solid var(--rw-border); }
.rw-opener__jumps button[aria-current="true"] { color: var(--rw-text); font-weight: 700; }
.rw-opener__jumps b { color: var(--color-primary, #1a1d21); font-size: .85rem; font-weight: 700; }
.rw-opener__jumps button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
`, _OpenSlider = class _OpenSlider extends LitElement {
  constructor() {
    super(...arguments), this.index = 0, this.stop = () => {
    }, this.timer = 0, this.count = 1, this.paused = !1, this.reduced = !1, this.hold = () => {
      this.paused = !0;
    }, this.release = () => {
      this.paused = !1;
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-open-slider", css), this.stop = watchLocale(this), this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches, this.reduced || (this.timer = window.setInterval(() => {
      this.paused || this.step(1);
    }, 7e3)), this.addEventListener("pointerenter", this.hold), this.addEventListener("pointerleave", this.release), this.addEventListener("focusin", this.hold), this.addEventListener("focusout", this.release);
  }
  disconnectedCallback() {
    window.clearInterval(this.timer), this.removeEventListener("pointerenter", this.hold), this.removeEventListener("pointerleave", this.release), this.removeEventListener("focusin", this.hold), this.removeEventListener("focusout", this.release), this.stop(), super.disconnectedCallback();
  }
  step(dir) {
    this.count < 2 || (this.index = (this.index + dir + this.count) % this.count);
  }
  render() {
    const cfg = getConfig(this.config), slides = getCollectionItems(cfg.items, "items").map((item) => ({
      image: String(item.image || ""),
      alt: localizedString(item.alt),
      title: localizedString(item.title),
      text: localizedString(item.text),
      button: localizedString(item.button),
      url: String(item.url || "")
    })).filter((item) => item.title);
    this.count = slides.length;
    const slide = slides[this.index] || slides[0], label = localizedString(cfg.title) || t({ ar: "سلايدر", en: "Slider" });
    return html`<section class="rw-block ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-roledescription="carousel" aria-label=${label}>
      ${slide ? html`<div class="rw-opener">
            <div class="rw-opener__copy">
              <div>
                <h2>${slide.title}</h2>
                ${slide.text ? html`<p>${slide.text}</p>` : nothing}
                <div class="rw-actions">${renderCta(slide.button, slide.url)}</div>
              </div>
              ${slides.length > 1 ? html`<div class="rw-opener__jumps">${slides.map((item, index) => html`<button type="button" aria-current=${index === this.index ? "true" : nothing} @click=${() => {
      this.index = index;
    }}>
                    <b>${String(index + 1).padStart(2, "0")}</b>
                    <span>${item.title}</span>
                  </button>`)}</div>` : nothing}
            </div>
            <div class="rw-opener__media">${media(slide.image, slide.alt || slide.title)}</div>
          </div>` : html`<div class="rw-section"><div class="rw-container">${emptyCopy()}</div></div>`}
    </section>`;
  }
};
__name(_OpenSlider, "OpenSlider");
let OpenSlider = _OpenSlider;
__decorateClass([
  property({ type: Object })
], OpenSlider.prototype, "config");
__decorateClass([
  state()
], OpenSlider.prototype, "index");
typeof OpenSlider < "u" && OpenSlider.registerSallaComponent("salla-open-slider");
export {
  OpenSlider as default
};
