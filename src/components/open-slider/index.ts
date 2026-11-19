import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, media } from "../../utils/ui.js";

const css = `
.rw-opener { display: grid; overflow: hidden; background: var(--rw-card); }
@container (min-width: 860px) { .rw-opener { grid-template-columns: minmax(0, .86fr) minmax(0, 1.14fr); min-height: 34rem; } }
.rw-opener__copy { display: flex; flex-direction: column; justify-content: flex-end; gap: .75rem; padding: 1.6rem 1.3rem 1.4rem; }
@container (min-width: 860px) { .rw-opener__copy { padding: 2.4rem; } }
.rw-opener__copy h2 { font-size: clamp(1.8rem, 4vw, 3rem); line-height: 1.15; font-weight: 700; }
.rw-opener__copy p { max-width: 34rem; color: var(--rw-muted); line-height: 1.8; }
.rw-opener__media { min-height: 16rem; background: var(--rw-soft); }
.rw-opener__media img, .rw-opener__media .rw-ph { width: 100%; height: 100%; min-height: 16rem; object-fit: cover; }
.rw-opener__nav { display: flex; align-items: center; gap: .5rem; margin-top: .4rem; }
.rw-opener__nav button { width: 2.6rem; height: 2.6rem; border: 1px solid var(--rw-border); border-radius: .6rem; background: var(--rw-surface); color: var(--rw-text); cursor: pointer; }
.rw-opener__nav button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-opener__nav span { margin-inline-start: .3rem; color: var(--rw-muted); }
`;

export default class OpenSlider extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private index = 0;
  private stop = () => {};
  private timer = 0;
  private count = 1;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-open-slider", css);
    this.stop = watchLocale(this);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motion) this.timer = window.setInterval(() => this.step(1), 7000);
  }

  disconnectedCallback() {
    window.clearInterval(this.timer);
    this.stop();
    super.disconnectedCallback();
  }

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
    return html`<section class="rw-block ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-roledescription="carousel" aria-label=${localizedString(cfg.title) || "slider"}>
      ${slide
        ? html`<div class="rw-opener">
            <div class="rw-opener__copy">
              <h2>${slide.title}</h2>
              ${slide.text ? html`<p>${slide.text}</p>` : nothing}
              ${renderCta(slide.button, slide.url)}
              ${slides.length > 1
                ? html`<div class="rw-opener__nav">
                    <button type="button" aria-label="السابق" @click=${() => this.step(-1)}>‹</button>
                    <button type="button" aria-label="التالي" @click=${() => this.step(1)}>›</button>
                    <span dir="ltr">${this.index + 1} / ${slides.length}</span>
                  </div>`
                : nothing}
            </div>
            <div class="rw-opener__media">${media(slide.image, slide.alt || slide.title)}</div>
          </div>`
        : html`<div class="rw-section"><div class="rw-container">${emptyCopy()}</div></div>`}
    </section>`;
  }
}
