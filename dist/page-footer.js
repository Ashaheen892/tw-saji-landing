var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: !0 });
import { LitElement, nothing, html } from "lit";
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
function linkHref(value) {
  if (value == null || value === "") return "";
  if (typeof value == "string") return value.trim();
  if (Array.isArray(value)) return linkHref(value[0]);
  if (typeof value == "object") {
    const obj = value;
    if (obj.url) return linkHref(obj.url);
    if ("value" in obj) return linkHref(obj.value);
    if (obj.href) return linkHref(obj.href);
  }
  return "";
}
__name(linkHref, "linkHref");
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
function currentTone() {
  return document.documentElement.classList.contains("rw-mode-dark") ? "dark" : "light";
}
__name(currentTone, "currentTone");
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
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-foot.rw-section { padding-block: 1.6rem 1.15rem; }
.rw-foot { border-top: 1px solid var(--rw-border); background: var(--rw-surface-2); }
.rw-foot__top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem 2rem; }
.rw-foot__brand { display: inline-flex; align-items: center; color: inherit; text-decoration: none; }
.rw-foot__logo { display: block; height: 2.25rem; width: auto; max-width: 42vw; object-fit: contain; }
.rw-foot__logo--dark { display: none; }
.rw-foot.is-invert .rw-foot__logo--light.has-alt { display: none; }
.rw-foot.is-invert .rw-foot__logo--dark { display: block; }
.rw-foot__name { font-size: 1.05rem; font-weight: 800; }
.rw-foot__note { max-width: 34rem; color: var(--rw-muted); line-height: 1.7; }
.rw-foot__links { display: flex; flex-wrap: wrap; gap: .45rem 1.15rem; margin-top: 1.05rem; }
.rw-foot__links a { color: inherit; font-weight: 700; text-decoration: none; }
.rw-foot__links a:hover { text-decoration: underline; text-underline-offset: .16rem; }
.rw-foot__links a:focus-visible, .rw-foot__brand:focus-visible, .rw-foot__badges a:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 3px; }
.rw-foot__badges { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.05rem; align-items: center; }
.rw-foot__badges a { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 3.2rem; padding: .4rem .7rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: #fff; color: #16324f; font-weight: 800; font-size: .84rem; text-decoration: none; }
.rw-foot__badges img { display: block; height: 2.4rem; width: auto; max-width: 9.5rem; object-fit: contain; }
.rw-foot__base { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .35rem 1rem; margin-top: 1.05rem; padding-top: .85rem; border-top: 1px solid var(--rw-border); color: var(--rw-muted); font-size: .9rem; }
`, _PageFoot = class _PageFoot extends LitElement {
  constructor() {
    super(...arguments), this.store = { logo: "", name: "", url: "" }, this.dark = !1, this.stop = () => {
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    var _a;
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-page-footer", css);
    const onTone = /* @__PURE__ */ __name(() => {
      this.dark = currentTone() === "dark";
    }, "onTone");
    onTone(), window.addEventListener("rw-tone", onTone);
    const stopLocale = watchLocale(this);
    this.stop = () => {
      window.removeEventListener("rw-tone", onTone), stopLocale();
    }, this.readStore();
    const api = window.Salla;
    (_a = api == null ? void 0 : api.onReady) == null || _a.call(api).then(() => this.readStore());
  }
  readStore() {
    var _a, _b, _c;
    const api = window.Salla;
    try {
      this.store = {
        logo: ((_a = api == null ? void 0 : api.config) == null ? void 0 : _a.get("store.logo")) || "",
        name: ((_b = api == null ? void 0 : api.config) == null ? void 0 : _b.get("store.name")) || "",
        url: ((_c = api == null ? void 0 : api.config) == null ? void 0 : _c.get("store.url")) || ""
      };
    } catch {
    }
  }
  disconnectedCallback() {
    this.stop(), super.disconnectedCallback();
  }
  render() {
    const cfg = getConfig(this.config), name = this.store.name || t({ ar: "المتجر", en: "Store" }), logo = String(cfg.logo || this.store.logo || ""), darkLogo = String(cfg.logo_dark || ""), invert = this.dark || schemeOf(cfg) === "rw-dark", note = localizedString(cfg.note), legal = localizedString(cfg.legal), storeUrl = String(this.store.url || "").trim(), links = getCollectionItems(cfg.links, "links").map((item) => {
      const own = linkHref(item.url);
      return { label: localizedString(item.label), url: own && own !== "#" ? own : storeUrl };
    }).filter((item) => item.label && item.url), badges = getCollectionItems(cfg.badges, "badges").map((item) => ({ image: String(item.image || "").trim(), alt: localizedString(item.alt), url: linkHref(item.url) })).filter((item) => (item.image || item.alt) && item.url && item.url !== "#");
    flag(cfg.show_store) && this.store.url && links.unshift({ label: localizedString(cfg.store_label) || t({ ar: "المتجر", en: "Store" }), url: this.store.url });
    const mark = logo ? html`<img class="rw-foot__logo rw-foot__logo--light${darkLogo ? " has-alt" : ""}" src=${logo} alt=${name} />
          ${darkLogo ? html`<img class="rw-foot__logo rw-foot__logo--dark" src=${darkLogo} alt="" />` : nothing}` : html`<span class="rw-foot__name">${name}</span>`, brand = this.store.url ? html`<a class="rw-foot__brand" href=${this.store.url}>${mark}</a>` : html`<span class="rw-foot__brand">${mark}</span>`, year = (/* @__PURE__ */ new Date()).getFullYear();
    return html`<footer class="rw-block rw-section rw-foot ${schemeOf(cfg)} ${invert ? "is-invert" : ""}" style=${sectionStyle(cfg)} aria-label=${t({ ar: "ذيل الصفحة", en: "Page footer" })}>
      <div class="rw-container">
        <div class="rw-foot__top">
          ${brand}
          ${note ? html`<p class="rw-foot__note">${note}</p>` : nothing}
        </div>
        ${links.length ? html`<nav class="rw-foot__links" aria-label=${t({ ar: "روابط", en: "Links" })}>
          ${links.map((item) => html`<a href=${item.url}>${item.label}</a>`)}
        </nav>` : nothing}
        ${badges.length ? html`<div class="rw-foot__badges">
          ${badges.map((item) => html`<a href=${item.url} target="_blank" rel="noopener noreferrer">
            ${item.image ? html`<img src=${item.image} alt=${item.alt || ""} />` : nothing}
            ${item.alt ? html`<span>${item.alt}</span>` : nothing}
          </a>`)}
        </div>` : nothing}
        <div class="rw-foot__base">
          <span>© ${year} ${name}</span>
          ${legal ? html`<span>${legal}</span>` : nothing}
        </div>
      </div>
    </footer>`;
  }
};
__name(_PageFoot, "PageFoot");
let PageFoot = _PageFoot;
__decorateClass([
  property({ type: Object })
], PageFoot.prototype, "config");
__decorateClass([
  state()
], PageFoot.prototype, "store");
__decorateClass([
  state()
], PageFoot.prototype, "dark");
typeof PageFoot < "u" && PageFoot.registerSallaComponent("salla-page-footer");
export {
  PageFoot as default
};
