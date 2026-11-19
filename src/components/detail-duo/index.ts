import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { heading, media } from "../../utils/ui.js";

const css = `
.rw-duo { display: grid; gap: 1rem; }
@container (min-width: 840px) { .rw-duo { grid-template-columns: 1.15fr .85fr; align-items: end; } }
.rw-shot { position: relative; min-height: 24rem; overflow: hidden; border-radius: 1.45rem; background: var(--rw-soft); }
@container (min-width: 840px) { .rw-shot--b { min-height: 20rem; margin-bottom: 2.5rem; } }
.rw-shot img, .rw-shot .rw-ph { width: 100%; height: 100%; min-height: 24rem; object-fit: cover; }
.rw-shot figcaption { position: absolute; inset-inline: 0; bottom: 0; padding: 1.3rem 1.2rem; color: #fff; background: linear-gradient(transparent, rgb(16 12 8 / 78%)); }
.rw-shot h3 { font-size: 1.3rem; }
.rw-shot p { margin-top: .3rem; line-height: 1.7; color: rgb(255 255 255 / 86%); }
`;

function shot(image: string, alt: string, title: string, text: string, extra = "") {
  return html`<figure class="rw-shot ${extra}">
    ${media(image, alt || title)}
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
