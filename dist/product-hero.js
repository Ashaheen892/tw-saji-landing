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
function pickedId(value) {
  const first = Array.isArray(value) ? value[0] : value;
  if (first == null || first === "") return null;
  if (typeof first == "object") {
    const id = first.value ?? first.id;
    return id ? String(id) : null;
  }
  return String(first);
}
__name(pickedId, "pickedId");
async function fetchProduct(id) {
  var _a, _b, _c, _d;
  const api = window.Salla;
  if (!id || !((_b = (_a = api == null ? void 0 : api.product) == null ? void 0 : _a.api) != null && _b.getDetails)) return null;
  try {
    await ((_c = api.onReady) == null ? void 0 : _c.call(api));
    const res = await api.product.api.getDetails(id, ["images", "rating"]);
    return (_d = res == null ? void 0 : res.data) != null && _d.id ? res.data : null;
  } catch {
    return null;
  }
}
__name(fetchProduct, "fetchProduct");
function money(amount) {
  const api = window.Salla;
  return api != null && api.money ? api.money(amount) : String(amount);
}
__name(money, "money");
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
.rw-stage { display: grid; gap: 1.4rem; align-items: center; }
@container (min-width: 900px) { .rw-stage { grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr); align-items: start; } }
.rw-stage__photo { aspect-ratio: 1; overflow: hidden; border-radius: 1.1rem; background: var(--rw-soft); }
.rw-stage__photo img, .rw-stage__photo .rw-ph { width: 100%; height: 100%; object-fit: cover; }
.rw-stage__views { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .7rem; }
.rw-stage__views button { display: flex; flex-direction: column; align-items: center; gap: .25rem; min-height: 2.5rem; padding: .3rem .75rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: var(--rw-card); color: var(--rw-text); cursor: pointer; }
.rw-stage__thumb { padding: .25rem; overflow: hidden; }
.rw-stage__thumb img { width: 4.4rem; height: 4.4rem; object-fit: cover; border-radius: .45rem; }
.rw-stage__cap { font-size: .75rem; line-height: 1.2; }
.rw-stage__options { margin-top: 1rem; }
.rw-stage__options .s-product-options-option { margin-top: .85rem; }
.rw-stage__options .s-product-options-colors-wrapper,
.rw-stage__options .s-product-options-thumbnails-wrapper { display: flex; flex-wrap: wrap; gap: .55rem; margin: .35rem 0 0; padding: 0; border: 0; }
.rw-stage__options .s-product-options-colors-item input,
.rw-stage__options .s-product-options-thumbnails-wrapper input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.rw-stage__options .s-product-options-colors-item label { display: flex; flex-direction: column; align-items: center; gap: .25rem; cursor: pointer; font-size: .75rem; }
.rw-stage__options .s-product-options-colors-item span { width: 1.7rem; height: 1.7rem; border-radius: 999px; display: block; border: 1px solid var(--rw-border); }
.rw-stage__options .s-product-options-colors-item input:checked + label span,
.rw-stage__options .s-product-options-thumbnails-wrapper input:checked + label img,
.rw-stage__options .s-product-options-colors-item input:focus-visible + label span,
.rw-stage__options .s-product-options-thumbnails-wrapper input:focus-visible + label img { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-stage__options .s-product-options-thumbnails-wrapper > div { font-size: .75rem; text-align: center; }
.rw-stage__options .s-product-options-thumbnails-wrapper p { margin: .25rem 0 0; }
.rw-stage__options .s-product-options-thumbnails-wrapper label { position: relative; display: inline-block; cursor: pointer; }
.rw-stage__options .s-product-options-thumbnails-icon { display: none; position: absolute; inset-inline-end: .2rem; top: .2rem; width: 1.1rem; height: 1.1rem; border-radius: 999px; background: var(--color-primary, #1a1d21); color: #fff; align-items: center; justify-content: center; }
.rw-stage__options .s-product-options-thumbnails-icon svg { width: .7rem; height: .7rem; fill: currentColor; }
.rw-stage__options .s-product-options-thumbnails-wrapper input:checked + label .s-product-options-thumbnails-icon { display: flex; }
.rw-block .rw-stage__options img { width: 4.2rem; height: 4.2rem; max-width: 4.2rem; object-fit: cover; border-radius: .55rem; }
.rw-stage__options select { width: 100%; max-width: 18rem; min-height: 2.6rem; margin-top: .35rem; padding: 0 .7rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: var(--rw-card); color: var(--rw-text); }
.rw-stage__views button[aria-pressed="true"] { border-color: var(--color-primary, #1a1d21); outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 1px; }
.rw-stage__views button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-stage__copy h2 { font-size: clamp(1.7rem, 3vw, 2.6rem); line-height: 1.2; }
.rw-stage__copy p { margin-top: .7rem; max-width: 36rem; color: var(--rw-muted); line-height: 1.8; }
.rw-stage__price { display: flex; align-items: baseline; gap: .65rem; margin-top: 1.1rem; font-size: 1.7rem; font-weight: 700; }
.rw-stage__price s { color: var(--rw-muted); font-size: 1rem; font-weight: 500; }
.rw-stage__stock { margin-top: .4rem; color: var(--rw-muted); }
`;
function productPhotos(product) {
  var _a;
  if (!product) return [];
  const views = (Array.isArray(product.images) ? product.images : []).map((image, index) => {
    var _a2;
    return {
      image: String((image == null ? void 0 : image.url) || ((_a2 = image == null ? void 0 : image.image) == null ? void 0 : _a2.url) || ""),
      alt: String((image == null ? void 0 : image.alt) || product.name || ""),
      label: String(index + 1)
    };
  }).filter((item) => item.image), single = ((_a = product.image) == null ? void 0 : _a.url) || product.thumbnail;
  return !views.length && single && views.push({ image: String(single), alt: String(product.name || ""), label: "1" }), views;
}
__name(productPhotos, "productPhotos");
function composeViews(product, merchant) {
  const photos = productPhotos(product);
  if (!merchant.length) return photos;
  if (!photos.length) return merchant;
  let photoIndex = 0;
  const merged = merchant.map((view) => {
    if (view.image) return view;
    const photo = photos[photoIndex];
    return photo ? (photoIndex += 1, { ...view, image: photo.image, alt: view.alt || photo.alt }) : view;
  });
  return photos.slice(photoIndex).forEach((photo) => merged.push(photo)), merged;
}
__name(composeViews, "composeViews");
function caption(view) {
  return view.label && !/^\d+$/.test(view.label) ? view.label : "";
}
__name(caption, "caption");
const _ProductHero = class _ProductHero extends LitElement {
  constructor() {
    super(...arguments), this.index = 0, this.product = null, this.stop = () => {
    }, this.requested = "";
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-product-hero", css), this.stop = watchLocale(this);
  }
  disconnectedCallback() {
    this.stop(), super.disconnectedCallback();
  }
  updated() {
    const id = landingProductId() || pickedId(getConfig(this.config).product);
    !id || id === this.requested || (this.requested = id, this.index = 0, fetchProduct(id).then((product) => {
      this.requested === id && (this.product = product);
    }));
  }
  render() {
    var _a, _b, _c;
    const cfg = getConfig(this.config), merchant = getCollectionItems(cfg.views, "views").map((item) => ({ image: String(item.image || ""), alt: localizedString(item.alt), label: localizedString(item.label) })).filter((item) => item.label || item.image), views = composeViews(this.product, merchant), current = views[Math.min(this.index, Math.max(views.length - 1, 0))], title = ((_a = this.product) == null ? void 0 : _a.name) || localizedString(cfg.title), text = localizedString(cfg.text), sale = this.product ? Number(this.product.sale_price ?? this.product.price ?? 0) : 0, regular = this.product ? Number(this.product.regular_price ?? this.product.price ?? 0) : 0, price = this.product ? sale ? money(sale) : "" : localizedString(cfg.price_text), was = this.product ? sale && regular > sale ? money(regular) : "" : localizedString(cfg.compare_text), stock = this.product ? this.product.is_available === !1 || this.product.quantity === 0 ? t({ ar: "نفدت الكمية", en: "Out of stock" }) : t({ ar: "متوفر للطلب", en: "Available to order" }) : "", buyUrl = String(cfg.button_url || ((_b = this.product) == null ? void 0 : _b.url) || "");
    return html`<section id="rw-product" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "product"}>
      <div class="rw-container rw-stage">
        <div>
          <div class="rw-stage__photo">${media((current == null ? void 0 : current.image) || "", (current == null ? void 0 : current.alt) || title)}</div>
          ${views.length > 1 ? html`<div class="rw-stage__views">${views.map((view, index) => {
      const name = caption(view);
      return html`<button type="button" class=${view.image ? "rw-stage__thumb" : ""} aria-pressed=${index === this.index ? "true" : "false"} aria-label=${name || view.alt || String(index + 1)} @click=${() => {
        this.index = index;
      }}>
                ${view.image ? html`<img src=${view.image} alt="" />` : name || index + 1}
                ${view.image && name ? html`<span class="rw-stage__cap">${name}</span>` : nothing}
              </button>`;
    })}</div>` : nothing}
        </div>
        <div class="rw-stage__copy">
          ${title ? html`<h2>${title}</h2>` : nothing}
          ${text ? html`<p>${text}</p>` : nothing}
          ${price ? html`<div class="rw-stage__price"><span>${price}</span>${was ? html`<s>${was}</s>` : nothing}</div>` : nothing}
          ${stock ? html`<p class="rw-stage__stock">${stock}</p>` : nothing}
          ${(_c = this.product) != null && _c.id ? html`<div class="rw-stage__options"><salla-product-options product-id=${String(this.product.id)}></salla-product-options></div>` : nothing}
          <div class="rw-actions">${renderCta(cfg.button_label, buyUrl)}</div>
        </div>
      </div>
    </section>`;
  }
};
__name(_ProductHero, "ProductHero");
let ProductHero = _ProductHero;
__decorateClass([
  property({ type: Object })
], ProductHero.prototype, "config");
__decorateClass([
  state()
], ProductHero.prototype, "index");
__decorateClass([
  state()
], ProductHero.prototype, "product");
typeof ProductHero < "u" && ProductHero.registerSallaComponent("salla-product-hero");
export {
  ProductHero as default
};
