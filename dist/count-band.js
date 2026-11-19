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
var __defProp2 = Object.defineProperty, __decorateClass = /* @__PURE__ */ __name((decorators, target, key, kind) => {
  for (var result = void 0, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = decorator(target, key, result) || result);
  return result && __defProp2(target, key, result), result;
}, "__decorateClass");
const css = `
.rw-timer { margin-bottom: 1.5rem; text-align: center; }
.rw-timer__label { color: var(--rw-muted); }
.rw-timer__cells { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: .8rem; }
.rw-timer__cells div { padding: .2rem .4rem; }
.rw-timer__cells div + div { border-inline-start: 1px solid var(--rw-border); }
.rw-timer__cells strong { display: block; font-variant-numeric: tabular-nums; font-size: clamp(1.7rem, 4vw, 2.8rem); line-height: 1; letter-spacing: -.04em; }
.rw-timer__cells span { display: block; margin-top: .3rem; color: var(--rw-muted); font-size: .85rem; }
.rw-counts { display: grid; }
@container (min-width: 720px) { .rw-counts { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rw-count { padding: 1.4rem 1rem; text-align: center; }
@container (min-width: 720px) { .rw-count + .rw-count { border-inline-start: 1px solid var(--rw-border); } }
.rw-count strong { display: flex; align-items: baseline; justify-content: center; gap: .15rem; font-variant-numeric: tabular-nums; font-size: clamp(2.2rem, 5vw, 3.5rem); line-height: 1; letter-spacing: -.05em; }
.rw-count__affix { font-size: .38em; font-weight: 650; letter-spacing: 0; }
.rw-count b { display: block; margin-top: .55rem; font-size: 1rem; }
.rw-count span { display: block; margin-top: .3rem; color: var(--rw-muted); }
`, DIGITS = "٠١٢٣٤٥٦٧٨٩", STORE = "rw-count-band-end";
function toArabic(value) {
  return value.replace(/\d/g, (digit) => DIGITS[Number(digit)] || digit);
}
__name(toArabic, "toArabic");
function parseStat(value) {
  const match = value.replace(/[٠-٩]/g, (digit) => String(DIGITS.indexOf(digit))).match(/\d+(?:[.,]\d+)?/);
  if (!match || match.index == null) return { prefix: "", suffix: "", number: 0, decimals: 0, arabic: !1, raw: value };
  const token = match[0], decimals = /[.,]/.test(token) ? token.split(/[.,]/)[1].length : 0;
  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + token.length),
    number: Number(token.replace(",", ".")),
    decimals,
    arabic: /[٠-٩]/.test(value),
    raw: ""
  };
}
__name(parseStat, "parseStat");
function formatStat(stat, progress) {
  if (stat.raw) return stat.raw;
  const amount = stat.number * progress, text = stat.decimals ? amount.toFixed(stat.decimals) : String(Math.round(amount));
  return stat.arabic ? toArabic(text) : text;
}
__name(formatStat, "formatStat");
function pad(value, arabic) {
  const text = String(value).padStart(2, "0");
  return arabic ? toArabic(text) : text;
}
__name(pad, "pad");
const _CountBand = class _CountBand extends LitElement {
  constructor() {
    super(...arguments), this.progress = 0, this.now = Date.now(), this.stop = () => {
    }, this.clock = 0, this.frame = 0, this.look = null, this.saw = !1, this.reduced = !1;
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("rw-host"), injectStyles("rw-base", baseCss), injectStyles("rw-count-band", css), this.stop = watchLocale(this), this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches, this.clock = window.setInterval(() => {
      this.now = Date.now();
    }, 1e3);
  }
  disconnectedCallback() {
    var _a;
    this.stop(), (_a = this.look) == null || _a.disconnect(), window.clearInterval(this.clock), window.cancelAnimationFrame(this.frame), super.disconnectedCallback();
  }
  updated() {
    this.saw || this.look || (this.look = new IntersectionObserver((entries) => {
      var _a;
      entries.some((entry) => entry.isIntersecting) && (this.saw = !0, (_a = this.look) == null || _a.disconnect(), this.rise());
    }, { threshold: 0.35 }), this.look.observe(this));
  }
  rise() {
    if (this.reduced) {
      this.progress = 1;
      return;
    }
    const start = performance.now(), step = /* @__PURE__ */ __name((now) => {
      const ratio = Math.min(1, (now - start) / 1100);
      this.progress = 1 - (1 - ratio) ** 3, ratio < 1 && (this.frame = window.requestAnimationFrame(step));
    }, "step");
    this.frame = window.requestAnimationFrame(step);
  }
  deadline(cfg) {
    if (cfg.show_countdown != null && !flag(cfg.show_countdown)) return null;
    const raw = unwrapValue(cfg.ends_at), parsed = typeof raw == "string" && raw ? Date.parse(raw) : NaN;
    if (!Number.isNaN(parsed)) return parsed;
    try {
      const saved = Number(localStorage.getItem(STORE) || 0);
      if (saved > this.now) return saved;
      const end = Date.now() + 4320 * 60 * 1e3;
      return localStorage.setItem(STORE, String(end)), end;
    } catch {
      return Date.now() + 4320 * 60 * 1e3;
    }
  }
  render() {
    const cfg = getConfig(this.config), arabic = getLocale() !== "en", items = getCollectionItems(cfg.items, "items").map((item) => ({
      stat: parseStat(localizedString(item.value)),
      label: localizedString(item.label),
      hint: localizedString(item.hint)
    })).filter((item) => item.stat.raw || item.stat.number || item.stat.prefix || item.stat.suffix), end = this.deadline(cfg), left = end == null ? 0 : Math.max(0, end - this.now), parts = [
      { value: Math.floor(left / 864e5), label: t({ ar: "يوم", en: "Days" }) },
      { value: Math.floor(left % 864e5 / 36e5), label: t({ ar: "ساعة", en: "Hours" }) },
      { value: Math.floor(left % 36e5 / 6e4), label: t({ ar: "دقيقة", en: "Minutes" }) },
      { value: Math.floor(left % 6e4 / 1e3), label: t({ ar: "ثانية", en: "Seconds" }) }
    ], label = end != null && left <= 0 ? t({ ar: "انتهى العرض", en: "The offer has ended" }) : localizedString(cfg.countdown_label) || t({ ar: "ينتهي العرض خلال", en: "The offer ends in" });
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${label || "counts"}>
      <div class="rw-container">
        ${end != null ? html`<div class="rw-timer">
          <p class="rw-timer__label">${label}</p>
          <div class="rw-timer__cells" aria-live="polite">
            ${parts.map((part) => html`<div><strong>${pad(part.value, arabic)}</strong><span>${part.label}</span></div>`)}
          </div>
        </div>` : nothing}
        ${items.length ? html`<div class="rw-counts">${items.map((item) => html`<article class="rw-count">
              <strong>
                ${item.stat.prefix ? html`<span class="rw-count__affix">${item.stat.prefix.trim()}</span>` : nothing}
                ${formatStat(item.stat, this.progress || (this.reduced ? 1 : 0))}
                ${item.stat.suffix ? html`<span class="rw-count__affix">${item.stat.suffix.trim()}</span>` : nothing}
              </strong>
              ${item.label ? html`<b>${item.label}</b>` : nothing}
              ${item.hint ? html`<span>${item.hint}</span>` : nothing}
            </article>`)}</div>` : emptyCopy()}
      </div>
    </section>`;
  }
};
__name(_CountBand, "CountBand");
let CountBand = _CountBand;
__decorateClass([
  property({ type: Object })
], CountBand.prototype, "config");
__decorateClass([
  state()
], CountBand.prototype, "progress");
__decorateClass([
  state()
], CountBand.prototype, "now");
typeof CountBand < "u" && CountBand.registerSallaComponent("salla-count-band");
export {
  CountBand as default
};
