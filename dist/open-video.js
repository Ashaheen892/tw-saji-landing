var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: !0 });
import { html, LitElement, nothing } from "lit";
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
  if (!silent || kind === "file") return frame;
  const params = new URLSearchParams();
  return params.set("autoplay", "1"), params.set("playsinline", "1"), kind === "youtube" ? (params.set("mute", "1"), params.set("rel", "0"), params.set("enablejsapi", "1"), clean && params.set("controls", "0")) : kind === "vimeo" ? (params.set("muted", "1"), clean && (params.set("controls", "0"), params.set("loop", "1"), params.set("title", "0"), params.set("byline", "0"), params.set("portrait", "0"))) : (params.set("mute", "1"), params.set("muted", "1")), `${frame}${frame.includes("?") ? "&" : "?"}${params.toString()}`;
}
__name(frameSrc, "frameSrc");
function muteFrame(frame) {
  const src = frame.src || "", win = frame.contentWindow;
  win && (src.includes("youtube") ? (win.postMessage(JSON.stringify({ event: "command", func: "mute", args: "" }), "*"), win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [0] }), "*")) : src.includes("vimeo") && win.postMessage(JSON.stringify({ method: "setVolume", value: 0 }), "*"));
}
__name(muteFrame, "muteFrame");
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
function settleSilence(root) {
  root.querySelectorAll("video").forEach((video) => holdSilence(video)), root.querySelectorAll("iframe").forEach((frame) => holdFrameSilence(frame));
}
__name(settleSilence, "settleSilence");
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-film { display: grid; gap: 1.2rem; align-items: center; }
@container (min-width: 860px) { .rw-film--beside { grid-template-columns: minmax(0, 1.35fr) minmax(16rem, .65fr); } }
.rw-film--stack { grid-template-columns: 1fr; }
.rw-film--stack .rw-film__copy { order: -1; max-width: 40rem; }
.rw-film__stage { position: relative; width: 100%; overflow: hidden; border-radius: 1rem; background: #121417; }
.rw-film--wide .rw-film__stage { aspect-ratio: 16 / 9; }
.rw-film--story .rw-film__stage { aspect-ratio: 9 / 16; max-width: 24rem; justify-self: center; }
.rw-film--square .rw-film__stage { aspect-ratio: 1; max-width: 36rem; justify-self: center; }
.rw-film--portrait .rw-film__stage { aspect-ratio: 4 / 5; max-width: 32rem; justify-self: center; }
.rw-film__stage img, .rw-film__stage video, .rw-film__stage iframe { width: 100%; height: 100%; object-fit: cover; border: 0; }
.rw-film--contain .rw-film__stage img,
.rw-film--contain .rw-film__stage video,
.rw-film--contain .rw-film__stage iframe { object-fit: contain; }
.rw-film__play { position: absolute; inset: 0; display: grid; place-items: center; border: 0; background: rgb(18 20 23 / 28%); color: #fff; cursor: pointer; }
.rw-film__play b { position: absolute; display: grid; place-items: center; width: 4rem; height: 4rem; border-radius: 999px; background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); font-size: 1.1rem; }
.rw-film__miss { position: absolute; inset-inline: 1rem; bottom: 1rem; margin: 0; padding: .55rem .8rem; border-radius: .7rem; background: rgb(18 20 23 / 78%); color: #fff; text-align: center; }
.rw-film__copy h2 { font-size: clamp(1.5rem, 3vw, 2.2rem); line-height: 1.25; }
.rw-film__copy p { margin-top: .7rem; color: var(--rw-muted); line-height: 1.8; }
.rw-film--cover { display: block; position: relative; }
.rw-film--cover .rw-film__stage { max-width: none; min-height: 22rem; }
.rw-film--cover .rw-film__copy { position: absolute; z-index: 1; inset-inline-start: 1.4rem; bottom: 1.4rem; max-width: min(36rem, calc(100% - 2.8rem)); color: #fff; }
.rw-film--cover .rw-film__copy p { color: rgb(255 255 255 / 84%); }
`, _OpenVideo = class _OpenVideo extends LitElement {
  constructor() {
    super(...arguments), this.playing = !1, this.missing = !1, this.stop = () => {
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-open-video", css), this.stop = watchLocale(this);
  }
  disconnectedCallback() {
    this.stop(), super.disconnectedCallback();
  }
  updated() {
    String(unwrapValue(getConfig(this.config).playback) || "click") === "auto" && settleSilence(this);
  }
  render() {
    const cfg = getConfig(this.config), title = localizedString(cfg.title), text = localizedString(cfg.text), poster = String(cfg.poster || ""), source = clipUrl(cfg.video_url), layout = String(unwrapValue(cfg.layout) || "beside"), frame = String(unwrapValue(cfg.frame) || "wide"), fit = String(unwrapValue(cfg.fit) || "cover"), auto = String(unwrapValue(cfg.playback) || "click") === "auto", file = isFileClip(source), classes = ["rw-container", "rw-film", `rw-film--${layout}`, `rw-film--${frame}`, fit === "contain" ? "rw-film--contain" : ""].filter(Boolean).join(" "), showPlayer = !!source && (auto || this.playing), player = file ? html`<video src=${source} poster=${poster || nothing} controls playsinline .muted=${auto} ?loop=${auto}></video>` : html`<iframe src=${frameSrc(source, auto)} title=${title || "video"} allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen @load=${() => {
      auto && settleSilence(this);
    }}></iframe>`;
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "video"}>
      <div class=${classes}>
        <div class="rw-film__stage">
          ${showPlayer ? player : html`<button type="button" class="rw-film__play" @click=${() => {
      source ? this.playing = !0 : this.missing = !0;
    }}>
                ${media(poster, title)}
                <b aria-hidden="true">▶</b>
                ${this.missing || auto && !source ? html`<p class="rw-film__miss rw-hint">${t({ ar: "أضف رابط الفيديو من إعدادات القسم.", en: "Add the video link in the section settings." })}</p>` : nothing}
              </button>`}
        </div>
        <div class="rw-film__copy">
          ${title ? html`<h2>${title}</h2>` : nothing}
          ${text ? html`<p>${text}</p>` : nothing}
        </div>
      </div>
    </section>`;
  }
};
__name(_OpenVideo, "OpenVideo");
let OpenVideo = _OpenVideo;
__decorateClass([
  property({ type: Object })
], OpenVideo.prototype, "config");
__decorateClass([
  state()
], OpenVideo.prototype, "playing");
__decorateClass([
  state()
], OpenVideo.prototype, "missing");
typeof OpenVideo < "u" && OpenVideo.registerSallaComponent("salla-open-video");
export {
  OpenVideo as default
};
