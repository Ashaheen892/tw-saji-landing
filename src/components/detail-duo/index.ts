import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { heading, media } from "../../utils/ui.js";

const css = `
.rw-duo { display: grid; gap: 1.15rem; }
@container (min-width: 840px) { .rw-duo { grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); align-items: end; gap: 1.35rem; } }
.rw-shot { display: flex; flex-direction: column; margin: 0; overflow: hidden; border: 1px solid var(--rw-border); border-radius: 1.3rem; background: var(--rw-card); }
.rw-shot__frame { position: relative; aspect-ratio: 4 / 5; max-height: 28rem; overflow: hidden; background: var(--rw-soft); }
@container (min-width: 840px) {
  .rw-shot__frame { max-height: 32rem; }
  .rw-shot--b .rw-shot__frame { aspect-ratio: 1 / 1; max-height: 24rem; }
}
.rw-shot img, .rw-shot .rw-ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.rw-shot figcaption { padding: 1rem 1.1rem 1.15rem; }
.rw-shot h3 { font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; }
.rw-shot h3::after { content: ""; display: block; width: 1.75rem; height: 2px; margin-top: .55rem; border-radius: 99px; background: var(--color-primary, #1a1d21); }
.rw-shot p { margin-top: .55rem; color: var(--rw-muted); line-height: 1.75; }
`;

function shot(image: string, alt: string, title: string, text: string, extra = "") {
  return html`<figure class="rw-shot ${extra}">
    <div class="rw-shot__frame">${media(image, alt || title)}</div>
    ${title || text
      ? html`<figcaption>${title ? html`<h3>${title}</h3>` : nothing}${text ? html`<p>${text}</p>` : nothing}</figcaption>`
      : nothing}
  </figure>`;
}

export default class DetailDuo extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-detail-duo", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "details"}>
      <div class="rw-container">
        ${heading(cfg)}
        <div class="rw-duo">
          ${shot(cfg.image_a || "", localizedString(cfg.alt_a), localizedString(cfg.title_a), localizedString(cfg.text_a))}
          ${shot(cfg.image_b || "", localizedString(cfg.alt_b), localizedString(cfg.title_b), localizedString(cfg.text_b), "rw-shot--b")}
        </div>
      </div>
    </section>`;
  }
}
