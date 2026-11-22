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
const COPIES = 12, ROTATE_MS = 4200, ANN_THUMB = {
  tile: { w: 28, h: 28 },
  bean: { w: 28, h: 28 },
  arch: { w: 24, h: 30 },
  slant: { w: 40, h: 26 }
}, lookCss = /* @__PURE__ */ __name((p, look) => {
  const box = ANN_THUMB[look], size = `.${p}-ann__media { width: ${box.w}px; height: ${box.h}px; }`;
  return look === "bean" ? `${size}
.${p}-ann__media { border-radius: 50%; box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent); }
.${p}-ann__item .${p}-ann__text::after { width: .55rem; height: .32rem; border-radius: 50%; transform: rotate(-35deg); box-shadow: inset 1px 0 0 color-mix(in srgb, var(--ann-fill) 70%, transparent); }
.${p}-anns.is-stack > .${p}-ann + .${p}-ann { box-shadow: none; background-image: linear-gradient(90deg, color-mix(in srgb, currentColor 35%, transparent) 50%, transparent 0); background-size: 10px 1px; background-repeat: repeat-x; }` : look === "arch" ? `${size}
.${p}-ann__media { border-radius: 999px 999px 3px 3px; outline: 1px solid color-mix(in srgb, currentColor 45%, transparent); outline-offset: 2px; }
.${p}-ann__label { letter-spacing: .02em; }
.${p}-ann__item .${p}-ann__text::after { width: .38rem; height: .38rem; border-radius: 0; transform: rotate(45deg); opacity: .7; }` : look === "slant" ? `${size}
.${p}-ann__media { border-radius: 0; clip-path: polygon(16% 0, 100% 0, 84% 100%, 0 100%); }
.${p}-ann__label { font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: .03em; }
.${p}-ann__item .${p}-ann__text::after { content: "/"; width: auto; height: auto; border-radius: 0; background: none; font-weight: 900; font-style: normal; opacity: .6; }` : `${size}
.${p}-ann__media { border-radius: 7px; }`;
}, "lookCss");
function announceCss(prefix, look = "tile") {
  const p = prefix;
  return `
.${p}-ann.${p}-ann {
  --ann-fill: var(--ann-bg-light, var(--ann-bg, var(--color-primary)));
  --ann-text: var(--ann-ink-light, var(--ann-ink, var(--color-primary-reverse, #fff)));
  overflow: hidden;
  padding-block: 5px;
  border: 0;
  font-family: var(--font-main, inherit);
  background: var(--ann-fill);
  color: var(--ann-text);
}
html.${p}-mode-dark .${p}-ann.${p}-auto, .${p}-ann.${p}-dark {
  --ann-fill: var(--ann-bg-dark, var(--ann-bg-light, var(--ann-bg, var(--color-primary))));
  --ann-text: var(--ann-ink-dark, var(--ann-ink-light, var(--ann-ink, var(--color-primary-reverse, #fff))));
}
.${p}-ann__still {
  display: flex;
  justify-content: center;
  padding: 5px 1.5rem;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 26px;
}
.${p}-ann__list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 5px 0;
  list-style: none;
  white-space: nowrap;
}
.${p}-ann__item {
  flex: none;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 26px;
  animation: ${p}-ann-ltr var(--ann-speed, 18s) linear infinite;
}
.${p}-ann.is-rtl .${p}-ann__item { animation-name: ${p}-ann-rtl; }
.${p}-ann.is-back .${p}-ann__item { animation-name: ${p}-ann-ltr-back; }
.${p}-ann.is-rtl.is-back .${p}-ann__item { animation-name: ${p}-ann-rtl-back; }
.${p}-ann__list:hover .${p}-ann__item { animation-play-state: paused; }
.${p}-ann__text {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  padding-inline: 1.5rem;
}
.${p}-ann__item .${p}-ann__text::after {
  content: "";
  width: .35rem;
  height: .35rem;
  margin-inline-start: .9rem;
  border-radius: 50%;
  background: currentColor;
  opacity: .55;
  flex: none;
}
.${p}-ann__still .${p}-ann__text { padding-inline: 0; }
.${p}-ann__link { display: inline-flex; align-items: center; gap: .6rem; color: inherit; text-decoration: none; }
.${p}-ann__link:hover .${p}-ann__label { text-decoration: underline; text-underline-offset: 3px; }
.${p}-ann__link:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
.${p}-ann__media {
  flex: none;
  display: inline-grid;
  place-items: center;
  overflow: hidden;
  background: color-mix(in srgb, currentColor 16%, transparent);
}
.${p}-ann__media img { display: block; width: 100%; height: 100%; object-fit: cover; }
.${p}-ann__media i { font-size: 15px; line-height: 1; }
.${p}-ann__media.is-hint {
  width: auto;
  padding-inline: .45rem;
  border: 1px dashed currentColor;
  background: color-mix(in srgb, currentColor 10%, transparent);
  clip-path: none;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  direction: ltr;
}
.${p}-anns { display: grid; }
.${p}-anns.is-stack > .${p}-ann + .${p}-ann { box-shadow: inset 0 1px 0 color-mix(in srgb, currentColor 18%, transparent); }
.${p}-anns.is-stack > .${p}-ann:nth-child(even):not(.is-own) { background-color: color-mix(in srgb, var(--ann-fill) 84%, #000); }
.${p}-anns.is-rotate > .${p}-ann { grid-area: 1 / 1; opacity: 0; visibility: hidden; transition: opacity .45s ease, visibility 0s linear .45s; }
.${p}-anns.is-rotate > .${p}-ann.is-on { opacity: 1; visibility: visible; transition: opacity .45s ease; }
@keyframes ${p}-ann-ltr { to { transform: translateX(-100%); } }
@keyframes ${p}-ann-rtl { to { transform: translateX(100%); } }
@keyframes ${p}-ann-ltr-back { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes ${p}-ann-rtl-back { from { transform: translateX(100%); } to { transform: translateX(0); } }
@media (prefers-reduced-motion: reduce) {
  .${p}-ann .${p}-ann__item { animation: none !important; }
  .${p}-ann__item[aria-hidden="true"] { display: none; }
  .${p}-ann__list { justify-content: center; }
  .${p}-ann__item .${p}-ann__text::after { display: none; }
  .${p}-anns.is-rotate > .${p}-ann { transition: none; }
}
${lookCss(p, look)}
`;
}
__name(announceCss, "announceCss");
function announceTone(cfg) {
  const paint = /* @__PURE__ */ __name((key, variable) => {
    const value = String(cfg[key] || "").trim();
    return value ? `${variable}:${value}` : "";
  }, "paint");
  return [
    paint("announce_bg", "--ann-bg-light"),
    paint("announce_ink", "--ann-ink-light"),
    paint("announce_bg_dark", "--ann-bg-dark"),
    paint("announce_ink_dark", "--ann-ink-dark")
  ].filter(Boolean).join(";");
}
__name(announceTone, "announceTone");
function marquee(prefix, extraClass, style, body, own = !1, go = "") {
  const rtl = isRtl();
  return html`<div class="${prefix}-ann${rtl ? " is-rtl" : ""}${go === (rtl ? "left" : "right") ? " is-back" : ""}${own ? " is-own" : ""} ${extraClass}" style=${style}>
    <ul class="${prefix}-ann__list">
      ${Array.from({ length: COPIES }, (_, index) => html`<li class="${prefix}-ann__item" aria-hidden=${index ? "true" : "false"}><span class="${prefix}-ann__text">${body}</span></li>`)}
    </ul>
  </div>`;
}
__name(marquee, "marquee");
function readStrips(cfg) {
  if (!Array.isArray(cfg.bars)) {
    const text = localizedString(cfg.announce).trim();
    return text ? [{ text, media: "none", icon: "", image: "", link: "", still: String(unwrapValue(cfg.announce_mode) || "move") === "still", go: "", bg: "", ink: "" }] : [];
  }
  return getCollectionItems(cfg.bars, "bars").map((row) => {
    const kind = String(unwrapValue(row.media) || "none"), motion = String(unwrapValue(row.motion) || "right");
    return {
      text: localizedString(row.text).trim(),
      media: kind === "icon" || kind === "image" ? kind : "none",
      icon: String(unwrapValue(row.icon) || "").trim(),
      image: String(unwrapValue(row.image) || "").trim(),
      link: linkHref(row.link),
      still: motion === "still",
      go: motion === "left" || motion === "right" ? motion : "",
      bg: String(row.bg || "").trim(),
      ink: String(row.ink || "").trim()
    };
  }).filter((row) => row.text);
}
__name(readStrips, "readStrips");
function stripBody(prefix, look, row) {
  const box = ANN_THUMB[look];
  let media = nothing;
  row.media === "icon" && row.icon ? media = html`<span class="${prefix}-ann__media is-icon" aria-hidden="true"><i class=${row.icon}></i></span>` : row.media === "image" && row.image ? media = html`<span class="${prefix}-ann__media"><img src=${row.image} alt="" width=${box.w * 2} height=${box.h * 2} loading="lazy" decoding="async" /></span>` : row.media === "image" && (media = html`<span class="${prefix}-ann__media is-hint ${prefix}-hint" aria-hidden="true">${box.w * 4}×${box.h * 4}</span>`);
  const inner = html`${media}<span class="${prefix}-ann__label">${row.text}</span>`;
  return row.link ? html`<a class="${prefix}-ann__link" href=${row.link}>${inner}</a>` : inner;
}
__name(stripBody, "stripBody");
function announceStrips(cfg, prefix, look, extraClass = "", tone = "") {
  const rows = readStrips(cfg);
  if (!rows.length) return nothing;
  const rotate = rows.length > 1 && String(unwrapValue(cfg.bars_layout) || "stack") === "rotate", strips = rows.map((row, index) => {
    const own = !!(row.bg || row.ink), style = [row.bg ? `--ann-fill:${row.bg}` : "", row.ink ? `--ann-text:${row.ink}` : ""].filter(Boolean).join(";"), body = stripBody(prefix, look, row);
    return row.still || rotate ? html`<div class="${prefix}-ann ${prefix}-ann__still${own ? " is-own" : ""}${rotate && index === 0 ? " is-on" : ""} ${extraClass}" style=${style} aria-hidden=${rotate && index ? "true" : "false"}><span class="${prefix}-ann__text">${body}</span></div>` : marquee(prefix, extraClass, style, body, own, row.go);
  });
  return html`<div class="${prefix}-anns ${rotate ? "is-rotate" : "is-stack"}" style=${tone} data-ann-rotate=${rotate ? String(rows.length) : "0"} role="region" aria-label=${isRtl() ? "إعلانات المتجر" : "Store announcements"}>${strips}</div>`;
}
__name(announceStrips, "announceStrips");
const timers = /* @__PURE__ */ new WeakMap();
function rotateStrips(root, prefix) {
  root.querySelectorAll(`.${prefix}-anns`).forEach((group) => {
    const count = Number(group.dataset.annRotate || 0), running = timers.get(group);
    if (running && running.count === count || (running && window.clearInterval(running.id), timers.delete(group), count < 2)) return;
    let index = 0;
    if (!group.dataset.annHold) {
      group.dataset.annHold = "0";
      const hold = /* @__PURE__ */ __name((on) => () => {
        group.dataset.annHold = on ? "1" : "0";
      }, "hold");
      group.addEventListener("mouseenter", hold(!0)), group.addEventListener("mouseleave", hold(!1)), group.addEventListener("focusin", hold(!0)), group.addEventListener("focusout", hold(!1));
    }
    const id = window.setInterval(() => {
      if (group.dataset.annHold === "1" || document.hidden) return;
      const items = [...group.children];
      items.length && (index = (index + 1) % items.length, items.forEach((item, at) => {
        item.classList.toggle("is-on", at === index), item.setAttribute("aria-hidden", at === index ? "false" : "true");
      }));
    }, ROTATE_MS);
    timers.set(group, { id, count });
  });
}
__name(rotateStrips, "rotateStrips");
function stopStrips(root, prefix) {
  root.querySelectorAll(`.${prefix}-anns`).forEach((group) => {
    const running = timers.get(group);
    running && window.clearInterval(running.id), timers.delete(group);
  });
}
__name(stopStrips, "stopStrips");
function applyTone(mode) {
  document.documentElement.classList.remove("rw-mode-light", "rw-mode-dark"), document.documentElement.classList.add(mode === "dark" ? "rw-mode-dark" : "rw-mode-light");
  try {
    localStorage.setItem("rw-landing-tone", mode);
  } catch {
  }
  window.dispatchEvent(new CustomEvent("rw-tone"));
}
__name(applyTone, "applyTone");
function currentTone() {
  return document.documentElement.classList.contains("rw-mode-dark") ? "dark" : "light";
}
__name(currentTone, "currentTone");
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
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-bar { position: relative; background: var(--rw-section-bg, var(--rw-surface)); color: var(--rw-text); }
.rw-bar__row { display: flex; align-items: center; gap: .85rem; width: min(1120px, calc(100% - 2rem)); min-height: calc(var(--rw-logo, 52px) + 1.35rem); margin-inline: auto; }
.rw-bar--center .rw-bar__row { justify-content: center; }
.rw-bar__brand { display: inline-flex; align-items: center; color: inherit; text-decoration: none; }
.rw-bar__logo { display: block; height: var(--rw-logo, 52px); width: auto; max-width: 46vw; object-fit: contain; }
.rw-bar__logo--dark { display: none; }
.rw-bar.is-invert .rw-bar__logo--light.has-alt { display: none; }
.rw-bar.is-invert .rw-bar__logo--dark { display: block; }
.rw-bar__name { font-size: 1.15rem; font-weight: 800; }
.rw-bar__link { color: inherit; font-weight: 700; text-decoration: none; }
.rw-bar__tone { display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem; padding: 0; border: 1px solid var(--rw-border); border-radius: .7rem; background: transparent; color: inherit; cursor: pointer; }
.rw-bar__tone svg { width: 1.15rem; height: 1.15rem; display: block; }
.rw-bar--center .rw-bar__tone { position: absolute; inset-inline-end: 1rem; top: 50%; margin-top: -1.25rem; }
.rw-bar--start .rw-bar__tone { margin-inline-start: auto; }
.rw-bar.is-line { box-shadow: inset 0 -1px 0 var(--rw-border); }
.rw-bar.is-clear { background: transparent; color: #f4f6f8; box-shadow: none; }
.rw-bar__tone:focus-visible, .rw-bar__link:focus-visible, .rw-bar__brand:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 3px; }
`, _PageBar = class _PageBar extends LitElement {
  constructor() {
    super(...arguments), this.dark = !1, this.solid = !1, this.store = { logo: "", name: "", url: "" }, this.stop = () => {
    }, this.modeKey = "", this.pinned = null, this.opened = [], this.held = null, this.heldSticky = !1, this.heldClear = !1, this.onScroll = () => {
      const cfg = getConfig(this.config), solid = flag(cfg.sticky) && (window.scrollY || document.documentElement.scrollTop || 0) > 8;
      solid !== this.solid && (this.solid = solid);
    };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    var _a;
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-announce", announceCss("rw", "tile")), injectStyles("rw-page-bar", css), document.addEventListener("scroll", this.onScroll, { capture: !0, passive: !0 });
    const onTone = /* @__PURE__ */ __name(() => {
      this.dark = currentTone() === "dark";
    }, "onTone");
    window.addEventListener("rw-tone", onTone);
    const stopLocale = watchLocale(this);
    this.stop = () => {
      document.removeEventListener("scroll", this.onScroll, { capture: !0 }), window.removeEventListener("rw-tone", onTone), stopLocale(), this.release();
    };
    const api = window.Salla;
    (_a = api == null ? void 0 : api.onReady) == null || _a.call(api).then(() => {
      var _a2, _b, _c;
      this.store = {
        logo: ((_a2 = api.config) == null ? void 0 : _a2.get("store.logo")) || "",
        name: ((_b = api.config) == null ? void 0 : _b.get("store.name")) || "",
        url: ((_c = api.config) == null ? void 0 : _c.get("store.url")) || ""
      };
    });
  }
  disconnectedCallback() {
    stopStrips(this, "rw"), this.stop(), super.disconnectedCallback();
  }
  willUpdate() {
    const cfg = getConfig(this.config), key = `${unwrapValue(cfg.default_mode) || "light"}|${flag(cfg.show_mode_toggle)}`;
    key !== this.modeKey && (this.modeKey = key, applyTone(this.openingMode(cfg)), this.dark = currentTone() === "dark");
  }
  updated() {
    rotateStrips(this, "rw"), this.pin(), this.onScroll();
  }
  openingMode(cfg) {
    const base = String(unwrapValue(cfg.default_mode) || "light");
    if (flag(cfg.show_mode_toggle))
      try {
        const saved = localStorage.getItem("rw-landing-tone");
        if (saved === "dark" || saved === "light") return saved;
      } catch {
      }
    return base === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : base === "dark" ? "dark" : "light";
  }
  /** The box that sits among the other sections, not the inner card that is only as tall as the bar. */
  outerBox() {
    let node = this;
    for (; node.parentElement && node.parentElement !== document.body && node.parentElement !== document.documentElement; ) {
      const parent = node.parentElement;
      if ([...parent.children].filter((el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE").length > 1) return node;
      node = parent;
    }
    return node;
  }
  /** A click inside the sticky bar focuses a control whose document position is the top of the page. */
  place(run) {
    const doc = this.ownerDocument, view = doc.defaultView;
    if (!view) {
      run();
      return;
    }
    const nodes = /* @__PURE__ */ new Set();
    doc.scrollingElement && nodes.add(doc.scrollingElement), nodes.add(doc.documentElement), nodes.add(doc.body);
    let node = this;
    for (; node; )
      nodes.add(node), node = node.parentElement;
    const marks = [...nodes].map((el) => [el, el.scrollTop]), x = view.scrollX, y = view.scrollY, put = /* @__PURE__ */ __name(() => {
      for (const [el, top] of marks) el.scrollTop !== top && (el.scrollTop = top);
      (Math.abs(view.scrollY - y) > 1 || Math.abs(view.scrollX - x) > 1) && view.scrollTo(x, y);
    }, "put");
    run(), put(), view.requestAnimationFrame(() => {
      put(), view.requestAnimationFrame(put);
    });
  }
  pin() {
    const cfg = getConfig(this.config), sticky = flag(cfg.sticky), clear = flag(cfg.transparent), outer = this.outerBox();
    if (clear && this.pinned === outer && (outer.style.marginBottom = `-${this.offsetHeight}px`), this.held === outer && this.heldSticky === sticky && this.heldClear === clear || (this.pinned && this.pinned !== outer && this.release(), this.held = outer, this.heldSticky = sticky, this.heldClear = clear, this.pinned = outer, outer.style.position = sticky ? "sticky" : clear ? "relative" : "", outer.style.top = sticky ? "0" : "", outer.style.zIndex = sticky || clear ? "40" : "", outer.style.marginBottom = clear ? `-${this.offsetHeight}px` : "", this.opened.forEach((el) => {
      el.style.overflow = "";
    }), this.opened = [], !sticky)) return;
    let node = outer.parentElement;
    for (; node && node !== document.body && node !== document.documentElement; ) {
      const flow = getComputedStyle(node);
      if (flow.overflowY === "auto" || flow.overflowY === "scroll") break;
      (flow.overflowY === "hidden" || flow.overflowX === "hidden") && (node.style.overflow = "clip", this.opened.push(node)), node = node.parentElement;
    }
  }
  release() {
    this.pinned && (this.pinned.style.position = this.pinned.style.top = this.pinned.style.zIndex = this.pinned.style.marginBottom = "", this.pinned = null), this.opened.forEach((el) => {
      el.style.overflow = "";
    }), this.opened = [], this.held = null, this.heldSticky = !1, this.heldClear = !1;
  }
  render() {
    const cfg = getConfig(this.config), height = Math.min(Math.max(Number(cfg.logo_height) || 52, 28), 120), start = String(unwrapValue(cfg.align) || "center") === "start", clear = flag(cfg.transparent) && !this.solid, invert = clear || this.dark || schemeOf(cfg) === "rw-dark", logo = String(cfg.logo || this.store.logo || ""), darkLogo = String(cfg.logo_dark || ""), name = this.store.name || t({ ar: "المتجر", en: "Store" }), linkLabel = localizedString(cfg.link_label), linkUrl = linkHref(cfg.link_url), classes = [
      "rw-block rw-bar",
      schemeOf(cfg),
      start ? "rw-bar--start" : "rw-bar--center",
      clear ? "is-clear" : "",
      invert ? "is-invert" : "",
      flag(cfg.show_shadow) && !clear ? "is-line" : ""
    ].filter(Boolean).join(" "), mark = logo ? html`<img class="rw-bar__logo rw-bar__logo--light${darkLogo ? " has-alt" : ""}" src=${logo} alt=${name} />
          ${darkLogo ? html`<img class="rw-bar__logo rw-bar__logo--dark" src=${darkLogo} alt="" />` : nothing}` : html`<span class="rw-bar__name">${name}</span>`, brand = flag(cfg.link_to_store) && this.store.url ? html`<a class="rw-bar__brand" href=${this.store.url}>${mark}</a>` : html`<span class="rw-bar__brand">${mark}</span>`;
    return html`${announceStrips(cfg, "rw", "tile", "rw-block", announceTone(cfg))}
    <header class=${classes} style=${`${sectionStyle(cfg)};--rw-logo:${height}px`}>
      <div class="rw-bar__row">
        ${brand}
        ${linkLabel && linkUrl ? html`<a class="rw-bar__link" href=${linkUrl}>${linkLabel}</a>` : nothing}
        ${flag(cfg.show_mode_toggle) ? html`<button type="button" class="rw-bar__tone" aria-pressed=${this.dark ? "true" : "false"} aria-label=${this.dark ? t({ ar: "التبديل إلى الوضع الفاتح", en: "Switch to light mode" }) : t({ ar: "التبديل إلى الوضع الداكن", en: "Switch to dark mode" })} @mousedown=${(event) => event.preventDefault()} @click=${() => this.place(() => applyTone(this.dark ? "light" : "dark"))}>
              ${this.dark ? html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" /><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" /></g></svg>` : html`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.5 2.4a9 9 0 1 0 7.1 13.6A8 8 0 0 1 14.5 2.4z" /></svg>`}
            </button>` : nothing}
      </div>
    </header>`;
  }
};
__name(_PageBar, "PageBar");
let PageBar = _PageBar;
__decorateClass([
  property({ type: Object })
], PageBar.prototype, "config");
__decorateClass([
  state()
], PageBar.prototype, "dark");
__decorateClass([
  state()
], PageBar.prototype, "solid");
__decorateClass([
  state()
], PageBar.prototype, "store");
typeof PageBar < "u" && PageBar.registerSallaComponent("salla-edit-bar");
export {
  PageBar as default
};
