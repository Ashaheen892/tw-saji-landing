import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, isRtl, localizedString, t, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, media } from "../../utils/ui.js";

const css = `
.rw-opener { display: grid; background: var(--rw-card); }
.rw-opener__media { position: relative; order: -1; min-height: 18rem; aspect-ratio: 4 / 3; overflow: hidden; background: var(--rw-soft); touch-action: pan-y; }
.rw-opener__media img, .rw-opener__media .rw-ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; animation: rw-opener-in .4s ease; }
@container (min-width: 860px) {
  .rw-opener { grid-template-columns: minmax(17rem, .72fr) minmax(0, 1.28fr); min-height: 34rem; }
  .rw-opener__media { order: 0; min-height: 0; aspect-ratio: auto; }
}
.rw-opener__copy { display: flex; flex-direction: column; justify-content: center; gap: 1.35rem; padding: 1.35rem 1.2rem 1.15rem; }
@container (min-width: 860px) { .rw-opener__copy { padding: 2.1rem 1.8rem 1.5rem; } }
.rw-opener__copy h2 { max-width: 16ch; font-size: clamp(1.75rem, 3.2vw, 2.7rem); line-height: 1.18; font-weight: 700; letter-spacing: -.03em; }
.rw-opener__copy p { max-width: 36rem; margin-top: .8rem; color: var(--rw-muted); line-height: 1.8; }
.rw-opener__nav { position: absolute; z-index: 1; inset-inline: .75rem; bottom: .75rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.rw-opener__nav button, .rw-opener__count { border: 0; border-radius: .7rem; background: rgb(18 20 23 / 74%); color: #fff; }
.rw-opener__nav button { direction: ltr; display: grid; place-items: center; width: 2.75rem; height: 2.75rem; padding: 0; cursor: pointer; }
.rw-opener__nav svg { width: 1.2rem; height: 1.2rem; display: block; }
.rw-opener__count { direction: ltr; min-width: 4.2rem; padding: .4rem .7rem; border-radius: 999px; font-variant-numeric: tabular-nums; font-weight: 700; text-align: center; }
.rw-opener__jumps { display: grid; }
.rw-opener__jumps button { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .7rem; align-items: center; width: 100%; min-height: 2.9rem; padding: .55rem .35rem; border: 0; border-top: 1px solid var(--rw-border); background: transparent; color: var(--rw-muted); text-align: start; cursor: pointer; }
.rw-opener__jumps button:last-child { border-bottom: 1px solid var(--rw-border); }
.rw-opener__jumps button[aria-current="true"] { color: var(--rw-text); font-weight: 700; background: color-mix(in srgb, var(--color-primary, #1a1d21) 10%, transparent); }
.rw-opener__jumps b { color: var(--color-primary, #1a1d21); font-size: .85rem; font-weight: 700; }
.rw-opener__jumps span { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rw-opener__nav button:focus-visible, .rw-opener__jumps button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
@keyframes rw-opener-in { from { opacity: .45; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .rw-opener__media img { animation: none; } }
`;

export default class OpenSlider extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private index = 0;
  private stop = () => {};
  private timer = 0;
  private count = 1;
  private paused = false;
  private reduced = false;
  private point = 0;
  private pointing = false;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-open-slider", css);
    this.stop = watchLocale(this);
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.arm();
    this.addEventListener("pointerenter", this.hold);
    this.addEventListener("pointerleave", this.release);
    this.addEventListener("focusin", this.hold);
    this.addEventListener("focusout", this.release);
  }

  disconnectedCallback() {
    window.clearInterval(this.timer);
    this.removeEventListener("pointerenter", this.hold);
    this.removeEventListener("pointerleave", this.release);
    this.removeEventListener("focusin", this.hold);
    this.removeEventListener("focusout", this.release);
    this.stop();
    super.disconnectedCallback();
  }

  private onKey(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const forward = isRtl() ? event.key === "ArrowLeft" : event.key === "ArrowRight";
    this.move(forward ? 1 : -1);
  }

  private hold = () => { this.paused = true; };
  private release = () => { this.paused = false; };

  private arm() {
    window.clearInterval(this.timer);
    this.timer = 0;
    if (this.reduced) return;
    this.timer = window.setInterval(() => { if (!this.paused) this.step(1); }, 7000);
  }

  private step(dir: number) {
    if (this.count < 2) return;
    this.index = (this.index + dir + this.count) % this.count;
  }

  private choose(index: number) {
    this.index = index;
    this.arm();
  }

  private move(dir: number) {
    this.step(dir);
    this.arm();
  }

  private down = (event: PointerEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    this.point = event.clientX;
    this.pointing = true;
    this.hold();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  private up = (event: PointerEvent) => {
    if (!this.pointing) return;
    this.pointing = false;
    const delta = event.clientX - this.point;
    if (Math.abs(delta) > 48) this.move(isRtl() ? (delta > 0 ? 1 : -1) : (delta < 0 ? 1 : -1));
    this.release();
  };

  render() {
    const cfg = getConfig(this.config);
    const slides = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({
        image: String(item.image || ""),
        alt: localizedString(item.alt),
        title: localizedString(item.title),
        text: localizedString(item.text),
        button: localizedString(item.button),
        url: String(item.url || ""),
      }))
      .filter((item) => item.title);
    this.count = slides.length;
    const slide = slides[this.index] || slides[0];
    const label = localizedString(cfg.title) || t({ ar: "سلايدر", en: "Slider" });
    const rtl = isRtl();
    const pointLeft = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    const pointRight = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    const prevIcon = rtl ? pointRight : pointLeft;
    const nextIcon = rtl ? pointLeft : pointRight;
    return html`<section class="rw-block ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-roledescription="carousel" aria-label=${label}>
      ${slide
        ? html`<div class="rw-opener">
            <div class="rw-opener__copy">
              <div>
                <h2>${slide.title}</h2>
                ${slide.text ? html`<p>${slide.text}</p>` : nothing}
                <div class="rw-actions">${renderCta(slide.button, slide.url)}</div>
              </div>
              ${slides.length > 1
                ? html`<div class="rw-opener__jumps" @keydown=${(event: KeyboardEvent) => this.onKey(event)}>${slides.map((item, index) => html`<button type="button" aria-current=${index === this.index ? "true" : nothing} @click=${() => this.choose(index)}>
                    <b>${String(index + 1).padStart(2, "0")}</b>
                    <span>${item.title}</span>
                  </button>`)}</div>`
                : nothing}
            </div>
            <div class="rw-opener__media" @pointerdown=${this.down} @pointerup=${this.up} @pointercancel=${this.up}>
              ${media(slide.image, slide.alt || slide.title)}
              ${slides.length > 1
                ? html`<div class="rw-opener__nav">
                    <button type="button" dir="ltr" aria-label=${t({ ar: "الشريحة السابقة", en: "Previous slide" })} @click=${() => this.move(-1)}>${prevIcon}</button>
                    <span class="rw-opener__count" dir="ltr">${`${String(this.index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`}</span>
                    <button type="button" dir="ltr" aria-label=${t({ ar: "الشريحة التالية", en: "Next slide" })} @click=${() => this.move(1)}>${nextIcon}</button>
                  </div>`
                : nothing}
            </div>
          </div>`
        : html`<div class="rw-section"><div class="rw-container">${emptyCopy()}</div></div>`}
    </section>`;
  }
}
