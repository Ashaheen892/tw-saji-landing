import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-offer { display: grid; overflow: hidden; border: 1px solid var(--rw-border); border-radius: 1.3rem; background: var(--rw-card); }
@container (min-width: 860px) {
  .rw-offer:not(.rw-offer--solo) { grid-template-columns: minmax(0, 1.25fr) minmax(16rem, .75fr); align-items: stretch; }
}
.rw-sheet { padding: 1.35rem 1.3rem 1.15rem; }
.rw-aside { display: flex; flex-direction: column; gap: 1.35rem; padding: 1.35rem 1.3rem; background: color-mix(in srgb, var(--color-primary, #1a1d21) 10%, var(--rw-card)); border-block-start: 1px solid var(--rw-border); }
@container (min-width: 860px) { .rw-aside { border-block-start: 0; border-inline-start: 1px solid var(--rw-border); } }
.rw-aside h3 { font-size: 1.25rem; line-height: 1.35; font-weight: 700; letter-spacing: -.02em; }
.rw-aside p { margin-top: .55rem; color: var(--rw-muted); line-height: 1.75; }
.rw-lines { display: grid; margin-top: 1.15rem; }
.rw-lines li { display: flex; gap: .75rem; align-items: center; min-height: 3.1rem; padding-block: .65rem; border-top: 1px solid var(--rw-border); line-height: 1.6; }
.rw-lines li:last-child { border-bottom: 1px solid var(--rw-border); }
.rw-lines i { display: grid; place-items: center; width: 2.15rem; height: 2.15rem; flex: none; border-radius: .6rem; background: color-mix(in srgb, var(--color-primary, #1a1d21) 14%, var(--rw-soft)); color: var(--color-primary, #1a1d21); }
.rw-offer__buy { display: grid; gap: .75rem; }
.rw-price { font-size: 1.05rem; font-weight: 700; line-height: 1.5; }
.rw-offer__buy .rw-actions { margin-top: 0; }
.rw-offer__buy .rw-btn { width: 100%; }
`;

export default class OfferPanel extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-offer-panel", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const lines = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => localizedString(item.text))
      .filter(Boolean);
    const title = localizedString(cfg.title);
    const kicker = localizedString(cfg.kicker);
    const price = localizedString(cfg.price_note);
    const asideTitle = localizedString(cfg.aside_title);
    const asideText = localizedString(cfg.aside_text);
    const cta = renderCta(cfg.button_label, cfg.button_url || "");
    const hasAside = Boolean(asideTitle || asideText || price || cta !== nothing);
    return html`<section id="rw-offer" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "offer"}>
      <div class="rw-container">
        <div class="rw-offer ${hasAside ? "" : "rw-offer--solo"}">
          <div class="rw-sheet">
            ${kicker ? html`<p class="rw-kicker">${kicker}</p>` : nothing}
            ${title ? html`<h2 class="rw-title">${title}</h2>` : nothing}
            ${lines.length
              ? html`<ul class="rw-lines">${lines.map((line) => html`<li><i class="sicon-shield-check" aria-hidden="true"></i><span>${line}</span></li>`)}</ul>`
              : emptyCopy()}
          </div>
          ${hasAside
            ? html`<aside class="rw-aside">
                <div>
                  ${asideTitle ? html`<h3>${asideTitle}</h3>` : nothing}
                  ${asideText ? html`<p>${asideText}</p>` : nothing}
                </div>
                ${price || cta !== nothing
                  ? html`<div class="rw-offer__buy">
                      ${price ? html`<p class="rw-price">${price}</p>` : nothing}
                      ${cta !== nothing ? html`<div class="rw-actions">${cta}</div>` : nothing}
                    </div>`
                  : nothing}
              </aside>`
            : nothing}
        </div>
      </div>
    </section>`;
  }
}
