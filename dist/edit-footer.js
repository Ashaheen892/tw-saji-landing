var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/components/edit-footer/index.ts
import { html as html3, LitElement, nothing as nothing3 } from "lit";
import { property, state } from "lit/decorators.js";

// src/utils/config.ts
function getConfig(raw) {
  if (!raw) return {};
  if (raw.component && typeof raw.component === "object") return raw.component;
  return raw;
}
__name(getConfig, "getConfig");
function getLocale() {
  const lang = window.Salla?.lang?.getLocale?.() || document.documentElement.lang || "ar";
  return String(lang).toLowerCase().startsWith("en") ? "en" : "ar";
}
__name(getLocale, "getLocale");
function isRtl() {
  return (document.documentElement.dir || (getLocale() === "ar" ? "rtl" : "ltr")) === "rtl";
}
__name(isRtl, "isRtl");
function localizedString(value) {
  if (value === null || value === void 0 || value === "") return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value;
    const text = obj[getLocale()] || obj.ar || obj.en;
    return typeof text === "string" ? text : "";
  }
  return String(value);
}
__name(localizedString, "localizedString");
function t(strings) {
  return getLocale() === "ar" ? strings.ar : strings.en;
}
__name(t, "t");
function unwrapValue(value) {
  if (Array.isArray(value)) return unwrapValue(value[0]?.value ?? value[0] ?? "");
  if (value && typeof value === "object" && "value" in value) return value.value;
  return value ?? "";
}
__name(unwrapValue, "unwrapValue");
function linkHref(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return linkHref(value[0]);
  if (typeof value === "object") {
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
  return raw === true || raw === "true" || raw === 1 || raw === "1";
}
__name(flag, "flag");
function getCollectionItems(items, prefix) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (!item || typeof item !== "object") return {};
    const normalized = {};
    for (const [key, val] of Object.entries(item)) {
      normalized[key.startsWith(`${prefix}.`) ? key.slice(prefix.length + 1) : key] = val;
    }
    return normalized;
  });
}
__name(getCollectionItems, "getCollectionItems");
function watchLocale(host) {
  const update = /* @__PURE__ */ __name(() => host.requestUpdate(), "update");
  window.addEventListener("language-changed", update);
  return () => window.removeEventListener("language-changed", update);
}
__name(watchLocale, "watchLocale");

// src/utils/announce.ts
import { html, nothing } from "lit";
var COPIES = 12;
var ANN_THUMB = {
  tile: { w: 28, h: 28 },
  bean: { w: 28, h: 28 },
  arch: { w: 24, h: 30 },
  slant: { w: 40, h: 26 }
};
var lookCss = /* @__PURE__ */ __name((p, look) => {
  const box = ANN_THUMB[look];
  const size = `.${p}-ann__media { width: ${box.w}px; height: ${box.h}px; }`;
  if (look === "bean") return `${size}
.${p}-ann__media { border-radius: 50%; box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent); }
.${p}-ann__item .${p}-ann__text::after { width: .55rem; height: .32rem; border-radius: 50%; transform: rotate(-35deg); box-shadow: inset 1px 0 0 color-mix(in srgb, var(--ann-fill) 70%, transparent); }
.${p}-anns.is-stack > .${p}-ann + .${p}-ann { box-shadow: none; background-image: linear-gradient(90deg, color-mix(in srgb, currentColor 35%, transparent) 50%, transparent 0); background-size: 10px 1px; background-repeat: repeat-x; }`;
  if (look === "arch") return `${size}
.${p}-ann__media { border-radius: 999px 999px 3px 3px; outline: 1px solid color-mix(in srgb, currentColor 45%, transparent); outline-offset: 2px; }
.${p}-ann__label { letter-spacing: .02em; }
.${p}-ann__item .${p}-ann__text::after { width: .38rem; height: .38rem; border-radius: 0; transform: rotate(45deg); opacity: .7; }`;
  if (look === "slant") return `${size}
.${p}-ann__media { border-radius: 0; clip-path: polygon(16% 0, 100% 0, 84% 100%, 0 100%); }
.${p}-ann__label { font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: .03em; }
.${p}-ann__item .${p}-ann__text::after { content: "/"; width: auto; height: auto; border-radius: 0; background: none; font-weight: 900; font-style: normal; opacity: .6; }`;
  return `${size}
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
@media (prefers-reduced-motion: reduce) {
  .${p}-ann__item { animation: none; }
  .${p}-ann__item[aria-hidden="true"] { display: none; }
  .${p}-ann__list { justify-content: center; }
  .${p}-ann__item .${p}-ann__text::after { display: none; }
  .${p}-anns.is-rotate > .${p}-ann { transition: none; }
}
${lookCss(p, look)}
`;
}
__name(announceCss, "announceCss");
function marquee(prefix, extraClass, style, body, own = false) {
  const rtl = isRtl() ? " is-rtl" : "";
  return html`<div class="${prefix}-ann${rtl}${own ? " is-own" : ""} ${extraClass}" style=${style}>
    <ul class="${prefix}-ann__list">
      ${Array.from({ length: COPIES }, (_, index) => html`<li class="${prefix}-ann__item" aria-hidden=${index ? "true" : "false"}><span class="${prefix}-ann__text">${body}</span></li>`)}
    </ul>
  </div>`;
}
__name(marquee, "marquee");
function announceBar(cfg, prefix, extraClass = "", tone = "") {
  const text = localizedString(cfg.announce).trim();
  if (!text) return nothing;
  const moving = String(unwrapValue(cfg.announce_mode) || "move") !== "still";
  if (!moving) {
    return html`<div class="${prefix}-ann ${prefix}-ann__still ${extraClass}" style=${tone}><span class="${prefix}-ann__text">${text}</span></div>`;
  }
  return marquee(prefix, extraClass, tone, text);
}
__name(announceBar, "announceBar");

// src/utils/dock.ts
var WA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4.2A7.8 7.8 0 0 0 5.3 16l-.7 3.2 3.3-.7A7.8 7.8 0 1 0 12 4.2Zm3.7 10.3c-.2.5-1 .9-1.4 1-.4.1-.8.1-1.3-.1-.3-.1-.7-.2-1.2-.5-2.1-1.1-3.4-3.2-3.5-3.4-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.2 0 .3 0 .5.4.2.5.6 1.6.7 1.7.1.2 0 .3-.1.5l-.3.4c-.1.1-.2.2 0 .4.2.3.7 1 1.5 1.6.6.5 1.1.6 1.3.5l.4-.3c.2-.1.3-.1.5 0 .2.2 1 .8 1.1 1 .1.1.1.3 0 .5Z"></path></svg>`;
var UP = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 19V8.8L7.4 12.4 6 11l6-6 6 6-1.4 1.4L13 8.8V19h-2Z"></path></svg>`;
function shown(value) {
  if (value == null || value === "") return true;
  return flag(value);
}
__name(shown, "shown");
function sideOf(value, fallback) {
  return String(unwrapValue(value) || fallback) === "end" ? "end" : "start";
}
__name(sideOf, "sideOf");
function digitsOf(value) {
  const raw = typeof value === "string" ? value : localizedString(value);
  return raw.replace(/\D/g, "");
}
__name(digitsOf, "digitsOf");
function paint(el, bg, ink) {
  el.style.background = String(bg || "").trim();
  el.style.color = String(ink || "").trim();
}
__name(paint, "paint");
function place(el, side, raised) {
  el.style.bottom = raised ? "5.6rem" : "1.15rem";
  el.style.insetInlineStart = side === "start" ? "1.15rem" : "auto";
  el.style.insetInlineEnd = side === "end" ? "1.15rem" : "auto";
}
__name(place, "place");
function syncDocks(cfg, prefix, nodes, onTop, options = {}) {
  const showWa = shown(cfg.show_whatsapp);
  const showTop = shown(cfg.show_top) && !options.hideTop;
  const waSide = sideOf(cfg.whatsapp_side, "start");
  const topSide = sideOf(cfg.top_side, "end");
  const stacked = showWa && showTop && waSide === topSide;
  const digits = digitsOf(cfg.whatsapp_number || "201153958512");
  const message = localizedString(cfg.whatsapp_message);
  const href = digits ? `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}` : "";
  if (showWa && href) {
    if (!nodes.wa) {
      const link = document.createElement("a");
      link.className = `${prefix}-dock ${prefix}-dock--wa`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = WA;
      document.body.appendChild(link);
      nodes.wa = link;
    }
    nodes.wa.href = href;
    nodes.wa.setAttribute("aria-label", t({ ar: "\u0648\u0627\u062A\u0633\u0627\u0628", en: "WhatsApp" }));
    paint(nodes.wa, cfg.whatsapp_bg, cfg.whatsapp_ink);
    place(nodes.wa, waSide, stacked);
    nodes.wa.hidden = false;
  } else if (nodes.wa) nodes.wa.hidden = true;
  const label = localizedString(cfg.top_label) || t({ ar: "\u0623\u0639\u0644\u0649", en: "Top" });
  if (shown(cfg.show_top)) {
    if (!nodes.top) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `${prefix}-dock ${prefix}-dock--top`;
      button.innerHTML = UP;
      button.addEventListener("click", onTop);
      document.body.appendChild(button);
      nodes.top = button;
    }
    nodes.top.setAttribute("aria-label", label);
    if (options.topText) {
      let caption = nodes.top.querySelector("span");
      if (!caption) {
        caption = document.createElement("span");
        nodes.top.appendChild(caption);
      }
      caption.textContent = label;
    }
    paint(nodes.top, cfg.top_bg, cfg.top_ink);
    place(nodes.top, topSide, false);
    nodes.top.hidden = !showTop;
  } else if (nodes.top) nodes.top.hidden = true;
  return nodes;
}
__name(syncDocks, "syncDocks");
function clearDocks(nodes) {
  nodes.wa?.remove();
  nodes.top?.remove();
  nodes.wa = null;
  nodes.top = null;
}
__name(clearDocks, "clearDocks");
function scrollPageTop(event, host) {
  if (event.cancelable) event.preventDefault();
  const targets = /* @__PURE__ */ new Set();
  const addDoc = /* @__PURE__ */ __name((doc) => {
    targets.add(doc.documentElement);
    if (doc.body) targets.add(doc.body);
    if (doc.scrollingElement) targets.add(doc.scrollingElement);
  }, "addDoc");
  addDoc(document);
  try {
    if (window.parent && window.parent !== window) addDoc(window.parent.document);
  } catch {
  }
  let node = host;
  while (node) {
    if (node.scrollHeight > node.clientHeight + 4) targets.add(node);
    node = node.parentElement;
  }
  targets.forEach((el) => {
    el.scrollTop = 0;
  });
  try {
    window.scrollTo(0, 0);
  } catch {
  }
}
__name(scrollPageTop, "scrollPageTop");

// src/utils/landing.ts
import { html as html2, nothing as nothing2 } from "lit";
function currentTone() {
  return document.documentElement.classList.contains("rw-mode-dark") ? "dark" : "light";
}
__name(currentTone, "currentTone");
function schemeOf(cfg) {
  const scheme = String(unwrapValue(cfg.color_scheme) || "auto");
  return scheme === "dark" ? "rw-dark" : scheme === "light" ? "rw-light" : "rw-auto";
}
__name(schemeOf, "schemeOf");

// src/utils/styles.ts
function markEditing() {
  const root = document.documentElement;
  const read = /* @__PURE__ */ __name(() => {
    let on = true;
    try {
      const salla = window.Salla;
      on = window.self !== window.top || salla?.config?.get?.("page.is_landing_page") !== true;
    } catch {
      on = true;
    }
    root.dataset.lpEditing = on ? "1" : "0";
  }, "read");
  if (root.dataset.lpEditing) return;
  read();
  try {
    window.Salla?.onReady?.(read);
  } catch {
  }
}
__name(markEditing, "markEditing");
function injectStyles(id, css2) {
  markEditing();
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css2;
  document.head.appendChild(style);
}
__name(injectStyles, "injectStyles");
var LIGHT = `--rw-surface:#f5f6f8; --rw-surface-2:#e8ebef; --rw-card:#ffffff; --rw-soft:#eef1f4; --rw-text:var(--color-text, #1a1d21); --rw-muted:#5c6570; --rw-border:#e1e5ea;`;
var DARK = `--rw-surface:#121417; --rw-surface-2:#1c2026; --rw-card:#1e2329; --rw-soft:#262c33; --rw-text:#f4f6f8; --rw-muted:#b7c0c9; --rw-border:rgb(255 255 255 / 14%);`;
var baseCss = `
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

// src/components/edit-footer/index.ts
var css = `
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
.rw-dock { position: fixed; z-index: 80; display: inline-grid; place-items: center; width: 3.45rem; height: 3.45rem; padding: 0; border: 0; border-radius: 999px; font-family: var(--font-main, inherit); cursor: pointer; text-decoration: none; box-shadow: 0 14px 30px rgb(0 0 0 / 18%); }
.rw-dock[hidden] { display: none; }
.rw-dock svg { width: 1.45rem; height: 1.45rem; display: block; }
.rw-dock--wa { background: #128C7E; color: #fff; }
.rw-dock--top { background: #1a1d21; color: #fff; }
`;
var _PageFoot = class _PageFoot extends LitElement {
  constructor() {
    super(...arguments);
    this.store = { logo: "", name: "", url: "" };
    this.dark = false;
    this.stop = /* @__PURE__ */ __name(() => {
    }, "stop");
    this.docks = { wa: null, top: null };
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-announce", announceCss("rw", "tile"));
    injectStyles("rw-page-footer", css);
    const onTone = /* @__PURE__ */ __name(() => {
      this.dark = currentTone() === "dark";
    }, "onTone");
    onTone();
    window.addEventListener("rw-tone", onTone);
    const stopLocale = watchLocale(this);
    this.stop = () => {
      window.removeEventListener("rw-tone", onTone);
      stopLocale();
    };
    this.readStore();
    const api = window.Salla;
    api?.onReady?.().then(() => this.readStore());
  }
  readStore() {
    const api = window.Salla;
    try {
      this.store = {
        logo: api?.config?.get("store.logo") || "",
        name: api?.config?.get("store.name") || "",
        url: api?.config?.get("store.url") || ""
      };
    } catch {
    }
  }
  disconnectedCallback() {
    this.stop();
    clearDocks(this.docks);
    super.disconnectedCallback();
  }
  updated() {
    this.docks = syncDocks(getConfig(this.config), "rw", this.docks, (event) => scrollPageTop(event, this));
  }
  render() {
    const cfg = getConfig(this.config);
    const name = this.store.name || t({ ar: "\u0627\u0644\u0645\u062A\u062C\u0631", en: "Store" });
    const logo = String(cfg.logo || this.store.logo || "");
    const darkLogo = String(cfg.logo_dark || "");
    const invert = this.dark || schemeOf(cfg) === "rw-dark";
    const note = localizedString(cfg.note);
    const legal = localizedString(cfg.legal);
    const storeUrl = String(this.store.url || "").trim();
    const links = getCollectionItems(cfg.links, "links").map((item) => {
      const own = linkHref(item.url);
      return { label: localizedString(item.label), url: own && own !== "#" ? own : storeUrl };
    }).filter((item) => item.label && item.url);
    const badges = getCollectionItems(cfg.badges, "badges").map((item) => ({ image: String(item.image || "").trim(), alt: localizedString(item.alt), url: linkHref(item.url) })).filter((item) => (item.image || item.alt) && item.url && item.url !== "#");
    if (flag(cfg.show_store) && this.store.url) {
      links.unshift({ label: localizedString(cfg.store_label) || t({ ar: "\u0627\u0644\u0645\u062A\u062C\u0631", en: "Store" }), url: this.store.url });
    }
    const mark = logo ? html3`<img class="rw-foot__logo rw-foot__logo--light${darkLogo ? " has-alt" : ""}" src=${logo} alt=${name} />
          ${darkLogo ? html3`<img class="rw-foot__logo rw-foot__logo--dark" src=${darkLogo} alt="" />` : nothing3}` : html3`<span class="rw-foot__name">${name}</span>`;
    const brand = this.store.url ? html3`<a class="rw-foot__brand" href=${this.store.url}>${mark}</a>` : html3`<span class="rw-foot__brand">${mark}</span>`;
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    return html3`${announceBar(cfg, "rw", "rw-block")}
    <footer class="rw-block rw-section rw-foot ${schemeOf(cfg)} ${invert ? "is-invert" : ""}" style=${sectionStyle(cfg)} aria-label=${t({ ar: "\u0630\u064A\u0644 \u0627\u0644\u0635\u0641\u062D\u0629", en: "Page footer" })}>
      <div class="rw-container">
        <div class="rw-foot__top">
          ${brand}
          ${note ? html3`<p class="rw-foot__note">${note}</p>` : nothing3}
        </div>
        ${links.length ? html3`<nav class="rw-foot__links" aria-label=${t({ ar: "\u0631\u0648\u0627\u0628\u0637", en: "Links" })}>
          ${links.map((item) => html3`<a href=${item.url}>${item.label}</a>`)}
        </nav>` : nothing3}
        ${badges.length ? html3`<div class="rw-foot__badges">
          ${badges.map((item) => html3`<a href=${item.url} target="_blank" rel="noopener noreferrer">
            ${item.image ? html3`<img src=${item.image} alt=${item.alt || ""} />` : nothing3}
            ${item.alt ? html3`<span>${item.alt}</span>` : nothing3}
          </a>`)}
        </div>` : nothing3}
        <div class="rw-foot__base">
          <span>© ${year} ${name}</span>
          ${legal ? html3`<span>${legal}</span>` : nothing3}
        </div>
      </div>
    </footer>`;
  }
};
__name(_PageFoot, "PageFoot");
__decorateClass([
  property({ type: Object })
], _PageFoot.prototype, "config", 2);
__decorateClass([
  state()
], _PageFoot.prototype, "store", 2);
__decorateClass([
  state()
], _PageFoot.prototype, "dark", 2);
var PageFoot = _PageFoot;
export {
  PageFoot as default
};
typeof PageFoot < "u" && PageFoot.registerSallaComponent("salla-edit-footer");
