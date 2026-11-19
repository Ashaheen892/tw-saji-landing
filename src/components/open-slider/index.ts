import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, media } from "../../utils/ui.js";

const css = `
.rw-opener { display: grid; background: var(--rw-card); }
.rw-opener__media { order: -1; min-height: 16rem; background: var(--rw-soft); }
.rw-opener__media img, .rw-opener__media .rw-ph { width: 100%; height: 100%; min-height: 16rem; object-fit: cover; }
@container (min-width: 860px) {
  .rw-opener { grid-template-columns: minmax(18rem, .78fr) minmax(0, 1.22fr); min-height: 36rem; }
  .rw-opener__media { order: 0; min-height: 0; }
  .rw-opener__media img, .rw-opener__media .rw-ph { min-height: 100%; }
}
.rw-opener__copy { display: flex; flex-direction: column; justify-content: space-between; gap: 1.4rem; padding: 1.4rem 1.25rem 1.2rem; }
@container (min-width: 860px) { .rw-opener__copy { padding: 2.2rem 2rem; } }
.rw-opener__copy h2 { font-size: clamp(1.7rem, 3.4vw, 2.8rem); line-height: 1.2; font-weight: 700; }
.rw-opener__copy p { max-width: 36rem; color: var(--rw-muted); line-height: 1.8; }
.rw-opener__jumps { display: grid; }
.rw-opener__jumps button { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .7rem; align-items: baseline; width: 100%; padding: .7rem 0; border: 0; border-top: 1px solid var(--rw-border); background: transparent; color: var(--rw-muted); text-align: start; cursor: pointer; }
.rw-opener__jumps button:last-child { border-bottom: 1px solid var(--rw-border); }
.rw-opener__jumps button[aria-current="true"] { color: var(--rw-text); font-weight: 700; }
.rw-opener__jumps b { color: var(--color-primary, #1a1d21); font-size: .85rem; font-weight: 700; }
.rw-opener__jumps button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
`;

export default class OpenSlider extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private index = 0;
  private stop = () => {};
  private timer = 0;
  private count = 1;
  private paused = false;
  private reduced = false;

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
    if (!this.reduced) this.timer = window.setInterval(() => { if (!this.paused) this.step(1); }, 7000);
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

  private hold = () => { this.paused = true; };
  private release = () => { this.paused = false; };

  private step(dir: number) {
    if (this.count < 2) return;
    this.index = (this.index + dir + this.count) % this.count;
  }

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
                ? html`<div class="rw-opener__jumps">${slides.map((item, index) => html`<button type="button" aria-current=${index === this.index ? "true" : nothing} @click=${() => { this.index = index; }}>
                    <b>${String(index + 1).padStart(2, "0")}</b>
                    <span>${item.title}</span>
                  </button>`)}</div>`
                : nothing}
            </div>
            <div class="rw-opener__media">${media(slide.image, slide.alt || slide.title)}</div>
          </div>`
        : html`<div class="rw-section"><div class="rw-container">${emptyCopy()}</div></div>`}
    </section>`;
  }
}
