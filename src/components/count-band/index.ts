import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { flag, getCollectionItems, getConfig, getLocale, localizedString, t, unwrapValue, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy } from "../../utils/ui.js";

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
`;

const DIGITS = "٠١٢٣٤٥٦٧٨٩";
const STORE = "rw-count-band-end";

type Stat = { prefix: string; suffix: string; number: number; decimals: number; arabic: boolean; raw: string };

function toArabic(value: string): string {
  return value.replace(/\d/g, (digit) => DIGITS[Number(digit)] || digit);
}

function parseStat(value: string): Stat {
  const western = value.replace(/[٠-٩]/g, (digit) => String(DIGITS.indexOf(digit)));
  const match = western.match(/\d+(?:[.,]\d+)?/);
  if (!match || match.index == null) return { prefix: "", suffix: "", number: 0, decimals: 0, arabic: false, raw: value };
  const token = match[0];
  const decimals = /[.,]/.test(token) ? token.split(/[.,]/)[1].length : 0;
  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + token.length),
    number: Number(token.replace(",", ".")),
    decimals,
    arabic: /[٠-٩]/.test(value),
    raw: "",
  };
}

function formatStat(stat: Stat, progress: number): string {
  if (stat.raw) return stat.raw;
  const amount = stat.number * progress;
  const text = stat.decimals ? amount.toFixed(stat.decimals) : String(Math.round(amount));
  return stat.arabic ? toArabic(text) : text;
}

function parseEnd(raw: unknown): number {
  const text = String(unwrapValue(raw) || "").trim();
  if (!text) return NaN;
  const slash = text.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})(?:[ T](\d{1,2}):(\d{2}))?$/);
  if (slash) {
    const hasTime = slash[4] != null;
    return new Date(Number(slash[3]), Number(slash[2]) - 1, Number(slash[1]), hasTime ? Number(slash[4]) : 23, hasTime ? Number(slash[5]) : 59, hasTime ? 0 : 59).getTime();
  }
  const day = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]), 23, 59, 59).getTime();
  const local = text.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):(\d{2})/);
  if (local) return new Date(Number(local[1]), Number(local[2]) - 1, Number(local[3]), Number(local[4]), Number(local[5]), 0).getTime();
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function pad(value: number, arabic: boolean): string {
  const text = String(value).padStart(2, "0");
  return arabic ? toArabic(text) : text;
}

export default class CountBand extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private progress = 0;
  @state() private now = Date.now();
  private stop = () => {};
  private clock = 0;
  private frame = 0;
  private look: IntersectionObserver | null = null;
  private saw = false;
  private reduced = false;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-count-band", css);
    this.stop = watchLocale(this);
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.clock = window.setInterval(() => {
      this.now = Date.now();
    }, 1000);
  }

  disconnectedCallback() {
    this.stop();
    this.look?.disconnect();
    window.clearInterval(this.clock);
    window.cancelAnimationFrame(this.frame);
    super.disconnectedCallback();
  }

  protected updated() {
    if (this.saw || this.look) return;
    this.look = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.saw = true;
      this.look?.disconnect();
      this.rise();
    }, { threshold: 0.35 });
    this.look.observe(this);
  }

  private rise() {
    if (this.reduced) {
      this.progress = 1;
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const ratio = Math.min(1, (now - start) / 1100);
      this.progress = 1 - (1 - ratio) ** 3;
      if (ratio < 1) this.frame = window.requestAnimationFrame(step);
    };
    this.frame = window.requestAnimationFrame(step);
  }

  private deadline(cfg: Record<string, any>): number | null {
    if (cfg.show_countdown != null && !flag(cfg.show_countdown)) return null;
    const parsed = parseEnd(cfg.ends_at);
    if (!Number.isNaN(parsed)) return parsed;
    try {
      const saved = Number(localStorage.getItem(STORE) || 0);
      if (saved > this.now) return saved;
      const end = Date.now() + 72 * 60 * 60 * 1000;
      localStorage.setItem(STORE, String(end));
      return end;
    } catch {
      return Date.now() + 72 * 60 * 60 * 1000;
    }
  }

  render() {
    const cfg = getConfig(this.config);
    const arabic = getLocale() !== "en";
    const items = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({
        stat: parseStat(localizedString(item.value)),
        label: localizedString(item.label),
        hint: localizedString(item.hint),
      }))
      .filter((item) => item.stat.raw || item.stat.number || item.stat.prefix || item.stat.suffix);
    const end = this.deadline(cfg);
    const left = end == null ? 0 : Math.max(0, end - this.now);
    const parts = [
      { value: Math.floor(left / 86400000), label: t({ ar: "يوم", en: "Days" }) },
      { value: Math.floor((left % 86400000) / 3600000), label: t({ ar: "ساعة", en: "Hours" }) },
      { value: Math.floor((left % 3600000) / 60000), label: t({ ar: "دقيقة", en: "Minutes" }) },
      { value: Math.floor((left % 60000) / 1000), label: t({ ar: "ثانية", en: "Seconds" }) },
    ];
    const ended = end != null && left <= 0;
    const label = ended
      ? t({ ar: "انتهى العرض", en: "The offer has ended" })
      : localizedString(cfg.countdown_label) || t({ ar: "ينتهي العرض خلال", en: "The offer ends in" });
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${label || "counts"}>
      <div class="rw-container">
        ${end != null ? html`<div class="rw-timer">
          <p class="rw-timer__label">${label}</p>
          <div class="rw-timer__cells" aria-live="polite">
            ${parts.map((part) => html`<div><strong>${pad(part.value, arabic)}</strong><span>${part.label}</span></div>`)}
          </div>
        </div>` : nothing}
        ${items.length
          ? html`<div class="rw-counts">${items.map((item) => html`<article class="rw-count">
              <strong>
                ${item.stat.prefix ? html`<span class="rw-count__affix">${item.stat.prefix.trim()}</span>` : nothing}
                ${formatStat(item.stat, this.progress || (this.reduced ? 1 : 0))}
                ${item.stat.suffix ? html`<span class="rw-count__affix">${item.stat.suffix.trim()}</span>` : nothing}
              </strong>
              ${item.label ? html`<b>${item.label}</b>` : nothing}
              ${item.hint ? html`<span>${item.hint}</span>` : nothing}
            </article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
