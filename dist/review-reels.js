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
function media(src, alt, className = "") {
  return src ? html`<img class=${className} src=${src} alt=${alt} loading="lazy" />` : html`<div class="rw-ph ${className}"><span class="rw-hint">${t({ ar: "أضف الصورة من إعدادات القسم. المقاس المقترح مذكور بجانب الحقل.", en: "Add an image in the section settings. The suggested size is next to the field." })}</span></div>`;
}
__name(media, "media");
const held = /* @__PURE__ */ new WeakSet(), hushed = /* @__PURE__ */ new WeakSet();
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
function muteFrame(frame) {
  const src = frame.src || "", win = frame.contentWindow;
  win && (src.includes("youtube") ? (win.postMessage(JSON.stringify({ event: "command", func: "mute", args: "" }), "*"), win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [0] }), "*")) : src.includes("vimeo") && win.postMessage(JSON.stringify({ method: "setVolume", value: 0 }), "*"));
}
__name(muteFrame, "muteFrame");
function unmuteFrame(frame) {
  const src = frame.src || "", win = frame.contentWindow;
  win && (src.includes("youtube") ? (win.postMessage(JSON.stringify({ event: "command", func: "unMute", args: "" }), "*"), win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "*")) : src.includes("vimeo") && win.postMessage(JSON.stringify({ method: "setVolume", value: 1 }), "*"));
}
__name(unmuteFrame, "unmuteFrame");
function holdSilence(video) {
  if (video.dataset.rwSound !== "on") {
    if (video.muted = !0, video.defaultMuted = !0, video.volume = 0, !held.has(video)) {
      held.add(video);
      const lock = /* @__PURE__ */ __name(() => {
        video.dataset.rwSound !== "on" && (video.muted = !0, video.volume = 0);
      }, "lock");
      video.addEventListener("play", lock), video.addEventListener("volumechange", lock), video.addEventListener("pointerdown", () => {
        video.dataset.rwSound = "on", held.delete(video);
      }, { once: !0 });
    }
    video.paused && video.play().catch(() => {
    });
  }
}
__name(holdSilence, "holdSilence");
function holdFrameSilence(frame) {
  if (frame.dataset.rwSound === "on" || hushed.has(frame)) return;
  hushed.add(frame);
  const send = /* @__PURE__ */ __name(() => {
    frame.dataset.rwSound !== "on" && muteFrame(frame);
  }, "send");
  frame.addEventListener("load", send), window.setTimeout(send, 400), window.setTimeout(send, 1400), window.setTimeout(send, 2500), send();
}
__name(holdFrameSilence, "holdFrameSilence");
function releaseSound(root) {
  root.querySelectorAll("video").forEach((video) => {
    video.dataset.rwSound = "on", held.delete(video), video.muted = !1, video.volume = 1, video.play().catch(() => {
    });
  }), root.querySelectorAll("iframe").forEach((frame) => {
    frame.dataset.rwSound = "on", hushed.delete(frame), unmuteFrame(frame);
  });
}
__name(releaseSound, "releaseSound");
function settleSilence(root) {
  root.querySelectorAll("video").forEach((video) => holdSilence(video)), root.querySelectorAll("iframe").forEach((frame) => holdFrameSilence(frame));
}
__name(settleSilence, "settleSilence");
function hushRoot(root) {
  root.querySelectorAll("video").forEach((video) => {
    delete video.dataset.rwSound, held.delete(video), holdSilence(video);
  }), root.querySelectorAll("iframe").forEach((frame) => {
    delete frame.dataset.rwSound, hushed.delete(frame), holdFrameSilence(frame);
  });
}
__name(hushRoot, "hushRoot");
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-reels__bar { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; margin-bottom: 1.1rem; flex-wrap: wrap; }
.rw-reels__bar .rw-head { margin-bottom: 0; flex: 1; }
.rw-reels__nav { display: flex; gap: .45rem; }
.rw-reels__nav button, .rw-reel__sound { border: 1px solid var(--rw-border); background: var(--rw-surface); color: var(--rw-text); cursor: pointer; }
.rw-reels__nav button { width: 2.6rem; height: 2.6rem; border-radius: .6rem; }
.rw-reels__nav button:focus-visible, .rw-reel__sound:focus-visible, .rw-reel__link:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-reels__row { display: flex; gap: .8rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: .35rem; scrollbar-width: thin; }
.rw-reel { position: relative; flex: 0 0 min(16rem, 72%); scroll-snap-align: center; aspect-ratio: 9 / 16; overflow: hidden; border-radius: 1rem; background: #121417; color: #fff; }
.rw-reel video, .rw-reel img, .rw-reel iframe, .rw-reel .rw-ph { width: 100%; height: 100%; object-fit: cover; border: 0; }
.rw-reel iframe { position: absolute; inset: 0; pointer-events: none; }
.rw-reel__hit { position: absolute; inset: 0; border: 0; background: transparent; color: inherit; cursor: pointer; }
.rw-reel__meta { position: absolute; z-index: 1; inset-inline: 0; bottom: 0; display: grid; gap: .28rem; padding: .95rem .85rem .8rem; background: linear-gradient(transparent, rgb(0 0 0 / 78%)); pointer-events: none; }
.rw-reel__meta strong { font-size: .98rem; }
.rw-reel__meta p { font-size: .9rem; line-height: 1.55; color: rgb(255 255 255 / 88%); }
.rw-reel__stars { display: inline-flex; align-items: center; gap: .18rem; direction: ltr; }
.rw-reel__stars svg { width: .95rem; height: .95rem; display: block; }
.rw-reel__stars .is-on { fill: #f5c451; }
.rw-reel__stars .is-off { fill: rgb(255 255 255 / 18%); stroke: rgb(255 255 255 / 80%); }
.rw-reel__sound { position: absolute; z-index: 2; top: .7rem; inset-inline-end: .7rem; min-height: 2.4rem; padding: .35rem .7rem; border-radius: .7rem; background: rgb(18 20 23 / 72%); color: #fff; border-color: transparent; }
.rw-reel__link { justify-self: start; color: #fff; font-weight: 700; pointer-events: auto; text-decoration: underline; text-underline-offset: .18rem; }
.rw-reels .rw-actions { margin-top: 1.2rem; }
`, _ReviewReels = class _ReviewReels extends LitElement {
  constructor() {
    super(...arguments), this.active = 0, this.audible = !1, this.opened = !1, this.seen = !1, this.sound = -1, this.picked = -1, this.stop = () => {
    }, this.observer = null, this.reduced = !1;
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-review-reels", css), this.stop = watchLocale(this), this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  disconnectedCallback() {
    var _a;
    (_a = this.observer) == null || _a.disconnect(), this.stop(), super.disconnectedCallback();
  }
  updated() {
    this.watch(), this.querySelectorAll(".rw-reel.is-live").forEach((card) => {
      const index = Number(card.dataset.index || 0);
      (flag(getConfig(this.config).autoplay) ? index === this.sound : this.audible) ? releaseSound(card) : settleSilence(card);
    });
  }
  reels() {
    return getCollectionItems(getConfig(this.config).items, "items").map((item) => ({
      source: clipUrl(item.video_url),
      poster: String(item.poster || ""),
      name: localizedString(item.name),
      quote: localizedString(item.quote),
      place: localizedString(item.place),
      stars: Math.min(5, Math.max(0, Number(unwrapValue(item.stars) || 0))),
      link: clipUrl(item.link_url),
      linkLabel: localizedString(item.link_label)
    })).filter((item) => item.source || item.poster || item.quote || item.name);
  }
  watch() {
    var _a, _b;
    const row = this.querySelector(".rw-reels__row");
    if (!row) return;
    if (flag(getConfig(this.config).autoplay) && !this.reduced) {
      if (this.seen) {
        (_a = this.observer) == null || _a.disconnect(), this.observer = null;
        return;
      }
      if (this.observer) return;
      this.observer = new IntersectionObserver((entries) => {
        entries.some((entry) => entry.isIntersecting) && (this.seen = !0);
      }, { threshold: 0.2 }), this.observer.observe(row);
      return;
    }
    (_b = this.observer) == null || _b.disconnect(), this.observer = new IntersectionObserver((entries) => {
      const best = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!best) return;
      const index = Number(best.target.dataset.index || 0);
      this.picked >= 0 && index !== this.picked || (index === this.picked && (this.picked = -1), index !== this.active && (this.audible = !1, this.opened = !1, this.active = index));
    }, { root: row, threshold: [0.65, 0.85] }), row.querySelectorAll(".rw-reel").forEach((card) => {
      var _a2;
      return (_a2 = this.observer) == null ? void 0 : _a2.observe(card);
    });
  }
  move(dir) {
    const row = this.querySelector(".rw-reels__row"), card = row == null ? void 0 : row.querySelector(".rw-reel");
    if (!row || !card) return;
    const delta = (card.getBoundingClientRect().width + 12) * dir * (isRtl() ? -1 : 1);
    row.scrollBy({ left: delta, behavior: this.reduced ? "auto" : "smooth" });
  }
  toggleSound(index) {
    const next = this.sound === index ? -1 : index;
    this.querySelectorAll(".rw-reel").forEach((card) => {
      Number(card.dataset.index || 0) === next ? releaseSound(card) : hushRoot(card);
    }), this.sound = next;
  }
  playCard(index, event) {
    const card = event.currentTarget.closest(".rw-reel");
    if (flag(getConfig(this.config).autoplay) && !this.reduced) {
      this.seen = !0, index !== this.active && (card == null || card.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }));
      return;
    }
    if (index !== this.active) {
      this.picked = index, this.audible = !1, this.opened = !1, this.active = index, card == null || card.scrollIntoView({ inline: "center", block: "nearest", behavior: this.reduced ? "auto" : "smooth" });
      return;
    }
    if (this.audible) {
      this.audible = !1, card && hushRoot(card);
      return;
    }
    this.opened = !0, this.audible = !0, card && releaseSound(card);
  }
  render() {
    const cfg = getConfig(this.config), items = this.reels(), auto = flag(cfg.autoplay) && !this.reduced, title = localizedString(cfg.title);
    return html`<section class="rw-block rw-section rw-reels ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "reels"}>
      <div class="rw-container">
        <div class="rw-reels__bar">
          ${heading(cfg)}
          ${items.length > 1 ? html`<div class="rw-reels__nav">
            <button type="button" aria-label=${t({ ar: "السابق", en: "Previous" })} @click=${() => this.move(-1)}>‹</button>
            <button type="button" aria-label=${t({ ar: "التالي", en: "Next" })} @click=${() => this.move(1)}>›</button>
          </div>` : nothing}
        </div>
        ${items.length ? html`<div class="rw-reels__row">
          ${items.map((item, index) => {
      const voiced = auto ? index === this.sound : this.audible && index === this.active, live = !!item.source && (auto ? this.seen : index === this.active && (this.opened || voiced)), file = isFileClip(item.source);
      return html`<article class="rw-reel ${live ? "is-live" : ""}" data-index=${index}>
              ${live && item.source ? file ? html`<video src=${item.source} poster=${item.poster || nothing} playsinline loop .muted=${!voiced}></video>` : html`<iframe src=${frameSrc(item.source, !0, !0)} title=${item.name || item.quote || "reel"} allow="autoplay; encrypted-media; picture-in-picture"></iframe>` : item.poster ? media(item.poster, item.name || item.quote) : html`<div class="rw-ph">${item.source ? "▶" : html`<span class="rw-hint">${t({ ar: "أضف فيديو التجربة", en: "Add the experience video" })}</span>`}</div>`}
              ${live ? nothing : html`<button type="button" class="rw-reel__hit" aria-label=${item.name || t({ ar: "تشغيل", en: "Play" })} @click=${(event) => this.playCard(index, event)}></button>`}
              ${live ? html`<button type="button" class="rw-reel__sound" aria-pressed=${voiced ? "true" : "false"} @click=${(event) => auto ? this.toggleSound(index) : this.playCard(index, event)}>${t(voiced ? { ar: "كتم", en: "Mute" } : { ar: "صوت", en: "Sound" })}</button>` : nothing}
              <div class="rw-reel__meta">
                ${item.stars ? html`<span class="rw-reel__stars" dir="ltr" role="img" aria-label=${`${item.stars}/5`}>${[1, 2, 3, 4, 5].map((star) => html`<svg viewBox="0 0 24 24" class=${star <= item.stars ? "is-on" : "is-off"} aria-hidden="true"><path d="M12 2.4 14.8 8.7l6.8.6-5.2 4.4 1.6 6.6L12 17.2 6 20.3l1.6-6.6L2.4 9.3l6.8-.6L12 2.4z" /></svg>`)}</span>` : nothing}
                ${item.name ? html`<strong>${item.name}${item.place ? ` · ${item.place}` : ""}</strong>` : nothing}
                ${item.quote ? html`<p>${item.quote}</p>` : nothing}
                ${item.link && item.linkLabel ? html`<a class="rw-reel__link" href=${item.link}>${item.linkLabel}</a>` : nothing}
              </div>
            </article>`;
    })}
        </div>` : emptyCopy()}
        <div class="rw-actions">${renderCta(cfg.button_label, String(cfg.button_url || ""))}</div>
      </div>
    </section>`;
  }
};
__name(_ReviewReels, "ReviewReels");
let ReviewReels = _ReviewReels;
__decorateClass([
  property({ type: Object })
], ReviewReels.prototype, "config");
__decorateClass([
  state()
], ReviewReels.prototype, "active");
__decorateClass([
  state()
], ReviewReels.prototype, "audible");
__decorateClass([
  state()
], ReviewReels.prototype, "opened");
__decorateClass([
  state()
], ReviewReels.prototype, "seen");
__decorateClass([
  state()
], ReviewReels.prototype, "sound");
typeof ReviewReels < "u" && ReviewReels.registerSallaComponent("salla-review-reels");
export {
  ReviewReels as default
};
