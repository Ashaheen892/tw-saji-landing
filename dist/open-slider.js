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
function isRtl() {
  return (document.documentElement.dir || (getLocale() === "ar" ? "rtl" : "ltr")) === "rtl";
}
__name(isRtl, "isRtl");
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
function markEditing() {
  var _a, _b;
  const root = document.documentElement, read = /* @__PURE__ */ __name(() => {
    var _a2, _b2;
    let on = !0;
    try {
      const salla2 = window.Salla;
      on = window.self !== window.top || ((_b2 = (_a2 = salla2 == null ? void 0 : salla2.config) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, "page.is_landing_page")) !== !0;
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
function emptyCopy() {
  return html`<p class="rw-empty">${t({ ar: "أضف عناصر هذا القسم من الإعدادات", en: "Add this section's items in the settings" })}</p>`;
}
__name(emptyCopy, "emptyCopy");
function media(src, alt, className = "") {
  return html`<div class="rw-ph ${className}"><span class="rw-hint">${t({ ar: "أضف الصورة من إعدادات القسم. المقاس المقترح مذكور بجانب الحقل.", en: "Add an image in the section settings. The suggested size is next to the field." })}</span></div>`;
}
__name(media, "media");
function clipUrl(value) {
  const raw = unwrapValue(value);
  if (typeof raw == "string") return raw.trim();
  if (raw && typeof raw == "object") {
    const url = raw.url ?? raw.src;
    if (typeof url == "string") return url.trim();
  }
  return "";
}
__name(clipUrl, "clipUrl");
function isFileClip(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url);
}
__name(isFileClip, "isFileClip");
function kindOf(url) {
  if (isFileClip(url)) return "file";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "youtu.be" || host.includes("youtube.com") || host.includes("youtube-nocookie.com")) return "youtube";
    if (host.includes("vimeo.com")) return "vimeo";
  } catch {
  }
  return "other";
}
__name(kindOf, "kindOf");
function frameSrc(url, silent, clean = !1) {
  var _a, _b;
  let frame = url;
  const kind = kindOf(url);
  try {
    const parsed = new URL(url);
    if (kind === "youtube") {
      const host = parsed.hostname.replace(/^www\./, "");
      let id = "";
      host === "youtu.be" ? id = parsed.pathname.split("/").filter(Boolean)[0] || "" : parsed.pathname.includes("/embed/") ? id = ((_a = parsed.pathname.split("/embed/")[1]) == null ? void 0 : _a.split("/")[0]) || "" : parsed.pathname.includes("/shorts/") ? id = ((_b = parsed.pathname.split("/shorts/")[1]) == null ? void 0 : _b.split("/")[0]) || "" : id = parsed.searchParams.get("v") || "", id && (frame = `https://www.youtube-nocookie.com/embed/${id}`);
    } else if (kind === "vimeo") {
      const id = parsed.pathname.split("/").filter(Boolean).pop() || "";
      /^\d+$/.test(id) && (frame = `https://player.vimeo.com/video/${id}`);
    }
  } catch {
    frame = url;
  }
  if (kind === "file") return frame;
  const params = new URLSearchParams();
  return params.set("autoplay", "1"), params.set("playsinline", "1"), kind === "youtube" ? (params.set("mute", "1"), params.set("rel", "0"), params.set("enablejsapi", "1"), clean && params.set("controls", "0")) : kind === "vimeo" ? (params.set("muted", "1"), clean && (params.set("controls", "0"), params.set("loop", "1"), params.set("title", "0"), params.set("byline", "0"), params.set("portrait", "0"))) : (params.set("mute", "1"), params.set("muted", "1")), `${frame}${frame.includes("?") ? "&" : "?"}${params.toString()}`;
}
__name(frameSrc, "frameSrc");
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-opener { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-rows: 1fr auto; min-height: var(--op-h); color: #fff; background: #111315; --op-h: min(90svh, 820px); touch-action: pan-y; }
.rw-opener.is-tall { --op-h: min(76svh, 700px); }
.rw-opener.is-medium { --op-h: 540px; }
.rw-opener__bg { position: absolute; inset: 0; z-index: -2; }
.rw-opener__bg img, .rw-opener__bg video, .rw-opener__bg iframe, .rw-opener__bg .rw-ph, .rw-opener__card img, .rw-opener__card video, .rw-opener__card iframe, .rw-opener__card .rw-ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: var(--op-focus, center); border: 0; animation: rw-opener-in .7s ease; }
.rw-opener__bg iframe, .rw-opener__card iframe { pointer-events: none; transform: scale(1.35); }
.rw-opener__bg picture, .rw-opener__card picture { display: contents; }
.rw-opener__shade { position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    linear-gradient(to top, rgb(12 13 15 / calc(var(--op-a, .7) + .1)) 0%, rgb(12 13 15 / calc(var(--op-a, .7) * .5)) 38%, rgb(12 13 15 / 0) 70%),
    linear-gradient(to var(--op-to, left), rgb(12 13 15 / calc(var(--op-a, .7) * .7)) 0%, rgb(12 13 15 / 0) 60%); }
.rw-opener.is-ltr { --op-to: right; }
.rw-opener.is-soft { --op-a: .45; }
.rw-opener.is-strong { --op-a: .88; }
.rw-opener__top { position: relative; display: flex; justify-content: flex-end; align-items: center; gap: .5rem; width: min(1180px, calc(100% - 2rem)); margin-inline: auto; padding-top: 1rem; }
.rw-opener__body { position: relative; display: grid; align-items: end; gap: 2rem; width: min(1180px, calc(100% - 2rem)); margin-inline: auto; padding-block: clamp(5rem, 14vh, 9rem) 1.6rem; }
.rw-opener__copy { max-width: 40rem; }
.rw-opener__copy h2 { margin: 0; font-size: clamp(2.1rem, 5.2vw, 4.2rem); line-height: 1.08; font-weight: 800; letter-spacing: -.035em; color: #fff; text-wrap: balance; animation: rw-opener-up .6s ease; }
.rw-opener__copy p { max-width: 34rem; margin-top: 1rem; color: rgb(255 255 255 / 84%); font-size: 1.05rem; line-height: 1.8; animation: rw-opener-up .8s ease; }
.rw-opener__copy .rw-actions { margin-top: 1.6rem; }
.rw-opener__copy .rw-actions>.rw-btn { min-height: 3.2rem; padding-inline: 1.7rem; }
.rw-opener__copy .rw-actions>.rw-btn--ghost { color: #fff; border-color: rgb(255 255 255 / 55%); background: rgb(255 255 255 / 8%); backdrop-filter: blur(6px); }
.rw-opener__card { display: none; position: relative; overflow: hidden; width: clamp(15rem, 26vw, 22rem); aspect-ratio: 4 / 5; border-radius: 1.4rem; box-shadow: 0 24px 70px rgb(0 0 0 / 45%); outline: 1px solid rgb(255 255 255 / 30%); outline-offset: -1px; }
@container (min-width: 900px) {
  .rw-opener.is-framed .rw-opener__body { grid-template-columns: minmax(0, 1fr) auto; }
  .rw-opener.is-framed .rw-opener__card { display: block; }
  .rw-opener.is-framed .rw-opener__bg img, .rw-opener.is-framed .rw-opener__bg video { filter: blur(24px) saturate(.9) brightness(.7); transform: scale(1.15); }
  .rw-opener.is-framed .rw-opener__bg iframe { display: none; }
}
.rw-opener__foot { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; width: min(1180px, calc(100% - 2rem)); margin-inline: auto; padding-bottom: 1.4rem; }
.rw-opener__tabs { display: flex; gap: .6rem; margin-inline-start: auto; }
.rw-opener__tabs button { position: relative; display: grid; gap: .45rem; width: 4.6rem; padding: 0; border: 0; background: transparent; color: rgb(255 255 255 / 70%); font: inherit; font-size: .75rem; font-weight: 700; text-align: start; cursor: pointer; }
.rw-opener__tabs .rw-opener__thumb { position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden; border-radius: .6rem; background: rgb(255 255 255 / 12%); opacity: .62; transition: opacity .25s, transform .25s; }
.rw-opener__tabs .rw-opener__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rw-opener__tabs button[aria-current="true"] { color: #fff; }
.rw-opener__tabs button[aria-current="true"] .rw-opener__thumb { opacity: 1; transform: translateY(-3px); outline: 2px solid #fff; outline-offset: 2px; }
.rw-opener__fill { position: relative; display: block; height: 3px; border-radius: 3px; background: rgb(255 255 255 / 25%); overflow: hidden; }
.rw-opener__fill i { position: absolute; inset: 0; background: #fff; transform: scaleX(0); transform-origin: var(--op-origin, right); }
.rw-opener.is-ltr { --op-origin: left; }
.rw-opener__tabs button[aria-current="true"] .rw-opener__fill i { animation: var(--op-run, none) 7s linear forwards; }
.rw-opener.is-held .rw-opener__fill i { animation-play-state: paused; }
.rw-opener__tabs button[aria-current="true"] .rw-opener__fill.is-still i { animation: none; transform: scaleX(1); }
@keyframes rw-opener-fill-a { to { transform: scaleX(1); } }
@keyframes rw-opener-fill-b { to { transform: scaleX(1); } }
@container (max-width: 559px) { .rw-opener__tabs button { width: 3.4rem; } .rw-opener__tabs .rw-opener__thumb { display: none; } .rw-opener__tabs button > b { display: none; } }
.rw-opener__arrows { display: flex; align-items: center; gap: .45rem; }
.rw-opener__arrows button, .rw-opener__count, .rw-opener__sound { border: 1px solid rgb(255 255 255 / 35%); background: rgb(12 13 15 / 40%); color: #fff; backdrop-filter: blur(8px); }
.rw-opener__arrows button { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; padding: 0; border-radius: 50%; cursor: pointer; }
.rw-opener__arrows svg { width: 1.15rem; height: 1.15rem; display: block; }
.rw-opener__count { white-space: nowrap; min-width: 4.4rem; padding: .45rem .8rem; border-radius: 999px; font-variant-numeric: tabular-nums; font-weight: 700; text-align: center; }
.rw-opener__sound { min-height: 2.5rem; padding: 0 1rem; border-radius: 999px; font: inherit; font-size: .85rem; font-weight: 700; cursor: pointer; }
.rw-opener__tag { padding: .3rem .8rem; border-radius: 999px; background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); font-size: .78rem; font-weight: 700; }
.rw-opener :focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
@keyframes rw-opener-in { from { opacity: .35; } to { opacity: 1; } }
@keyframes rw-opener-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .rw-opener * { animation: none !important; } }
`, pick = /* @__PURE__ */ __name((value, allowed, fallback) => {
  const raw = String(unwrapValue(value) || fallback);
  return allowed.includes(raw) ? raw : fallback;
}, "pick"), _OpenSlider = class _OpenSlider extends LitElement {
  constructor() {
    super(...arguments), this.index = 0, this.sound = !1, this.waited = 0, this.kinds = [], this.failed = /* @__PURE__ */ new Set(), this.stop = () => {
    }, this.timer = 0, this.count = 1, this.paused = !1, this.reduced = !1, this.point = 0, this.pointing = !1, this.hold = () => {
      this.paused || (this.paused = !0, this.requestUpdate());
    }, this.release = () => {
      this.paused && (this.paused = !1, this.requestUpdate());
    }, this.down = (event) => {
      var _a, _b;
      event.target.closest("button") || (this.point = event.clientX, this.pointing = !0, this.hold(), (_b = (_a = event.currentTarget).setPointerCapture) == null || _b.call(_a, event.pointerId));
    }, this.up = (event) => {
      if (!this.pointing) return;
      this.pointing = !1;
      const delta = event.clientX - this.point;
      Math.abs(delta) > 48 && this.move(isRtl() ? delta > 0 ? 1 : -1 : delta < 0 ? 1 : -1), this.release();
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-open-slider", css), this.stop = watchLocale(this), this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches, this.arm(), this.addEventListener("pointerenter", this.hold), this.addEventListener("pointerleave", this.release), this.addEventListener("focusin", this.hold), this.addEventListener("focusout", this.release);
  }
  disconnectedCallback() {
    window.clearInterval(this.timer), this.removeEventListener("pointerenter", this.hold), this.removeEventListener("pointerleave", this.release), this.removeEventListener("focusin", this.hold), this.removeEventListener("focusout", this.release), this.stop(), super.disconnectedCallback();
  }
  onKey(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const forward = isRtl() ? event.key === "ArrowLeft" : event.key === "ArrowRight";
    this.move(forward ? 1 : -1);
  }
  arm() {
    window.clearInterval(this.timer), this.timer = 0, !this.reduced && (this.timer = window.setInterval(() => {
      if (this.paused) return;
      const kind = this.kinds[this.index];
      kind !== "file" && (kind === "frame" && ++this.waited < 3 || (this.waited = 0, this.step(1)));
    }, 7e3));
  }
  step(dir) {
    this.count < 2 || (this.index = (this.index + dir + this.count) % this.count);
  }
  choose(index) {
    this.index = index, this.waited = 0, this.arm();
  }
  move(dir) {
    this.waited = 0, this.step(dir), this.arm();
  }
  picture(slide) {
    if (!slide.image) return media("", slide.alt || slide.title);
    const alt = slide.alt || slide.title;
    return slide.mobile ? html`<picture><source media="(max-width: 699px)" srcset=${slide.mobile} /><img src=${slide.image} alt=${alt} /></picture>` : html`<img src=${slide.image} alt=${alt} />`;
  }
  moving(slide, total) {
    return isFileClip(slide.video) ? html`<video src=${slide.video} poster=${slide.image || nothing} .muted=${!this.sound} autoplay playsinline preload="metadata"
          ?loop=${total < 2 || this.reduced} aria-label=${slide.alt || slide.title}
          @ended=${() => this.move(1)} @error=${() => {
      this.failed.add(slide.video), this.requestUpdate();
    }}></video>` : html`<iframe src=${frameSrc(slide.video, !0, !0)} title=${slide.alt || slide.title} allow="autoplay; encrypted-media; picture-in-picture" loading="lazy"></iframe>`;
  }
  render() {
    const cfg = getConfig(this.config), slides = getCollectionItems(cfg.items, "items").map((item) => ({
      image: String(item.image || "").trim(),
      mobile: String(item.image_mobile || "").trim(),
      alt: localizedString(item.alt),
      title: localizedString(item.title),
      text: localizedString(item.text),
      button: localizedString(item.button),
      url: String(item.url || "").trim(),
      second: localizedString(item.second_button),
      secondUrl: String(item.second_url || "").trim(),
      video: clipUrl(item.video)
    })).filter((item) => item.title);
    this.count = slides.length, this.kinds = slides.map((item) => item.video && !this.failed.has(item.video) ? isFileClip(item.video) ? "file" : "frame" : "image"), this.index >= slides.length && (this.index = 0);
    const slide = slides[this.index], label = localizedString(cfg.title) || t({ ar: "سلايدر", en: "Slider" });
    if (!slide) return html`<section class="rw-block ${schemeOf(cfg)}" style=${sectionStyle(cfg)}><div class="rw-section"><div class="rw-container">${emptyCopy()}</div></div></section>`;
    const rtl = isRtl(), framed = pick(cfg.fit, ["framed", "cover"], "cover") === "framed", height = pick(cfg.height, ["screen", "tall", "medium"], "screen"), shade = pick(cfg.shade, ["soft", "medium", "strong"], "medium"), focus = pick(cfg.focus, ["top", "center", "bottom"], "center"), kind = this.kinds[this.index], playing = kind === "file" || kind === "frame", pointLeft = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`, pointRight = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`, classes = ["rw-opener", framed ? "is-framed" : "", `is-${height}`, `is-${shade}`, rtl ? "" : "is-ltr", this.paused ? "is-held" : ""].filter(Boolean).join(" "), color = String(cfg.bg_color || "").trim(), bg = playing && !framed ? this.moving(slide, slides.length) : this.picture(slide), card = playing ? this.moving(slide, slides.length) : this.picture(slide), run = this.reduced || playing ? "none" : this.index % 2 ? "rw-opener-fill-b" : "rw-opener-fill-a";
    return html`<section class="rw-block ${schemeOf(cfg)}" aria-roledescription="carousel" aria-label=${label} @keydown=${(event) => this.onKey(event)}>
      <div class=${classes} style=${`--op-focus:center ${focus};--op-run:${run};${color ? `background:${color};` : ""}`} @pointerdown=${this.down} @pointerup=${this.up} @pointercancel=${this.up}>
        <div class="rw-opener__bg" aria-hidden=${framed ? "true" : "false"}>${bg}</div>
        <div class="rw-opener__shade"></div>
        <div class="rw-opener__top">
          ${slide.video ? html`<span class="rw-opener__tag">${t({ ar: "فيديو", en: "Video" })}</span>` : nothing}
          ${kind === "file" ? html`<button type="button" class="rw-opener__sound" @click=${() => {
      this.sound = !this.sound, this.hold();
    }}>${this.sound ? t({ ar: "كتم الصوت", en: "Mute" }) : t({ ar: "تشغيل الصوت", en: "Sound on" })}</button>` : nothing}
        </div>
        <div class="rw-opener__body">
          <div class="rw-opener__copy" aria-live="polite">
            <h2>${slide.title}</h2>
            ${slide.text ? html`<p>${slide.text}</p>` : nothing}
            <div class="rw-actions">${renderCta(slide.button, slide.url)}${slide.second && slide.secondUrl ? html`<a class="rw-btn rw-btn--ghost" href=${slide.secondUrl}>${slide.second}</a>` : nothing}</div>
          </div>
          ${framed ? html`<div class="rw-opener__card">${card}</div>` : nothing}
        </div>
        ${slides.length > 1 ? html`<div class="rw-opener__foot">
          <div class="rw-opener__arrows">
            <button type="button" aria-label=${t({ ar: "الشريحة السابقة", en: "Previous slide" })} @click=${() => this.move(-1)}>${rtl ? pointRight : pointLeft}</button>
            <span class="rw-opener__count" dir="ltr">${`${String(this.index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`}</span>
            <button type="button" aria-label=${t({ ar: "الشريحة التالية", en: "Next slide" })} @click=${() => this.move(1)}>${rtl ? pointLeft : pointRight}</button>
          </div>
          <div class="rw-opener__tabs">${slides.map((item, index) => html`<button type="button" aria-current=${index === this.index ? "true" : "false"} aria-label=${item.title} @click=${() => this.choose(index)}>
            <span class="rw-opener__thumb">${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : nothing}</span>
            <b>${String(index + 1).padStart(2, "0")}</b>
            <span class="rw-opener__fill ${index === this.index && (playing || this.reduced) ? "is-still" : ""}"><i></i></span>
          </button>`)}</div>
        </div>` : nothing}
      </div>
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
__decorateClass([
  state()
], OpenSlider.prototype, "sound");
typeof OpenSlider < "u" && OpenSlider.registerSallaComponent("salla-open-slider");
export {
  OpenSlider as default
};
