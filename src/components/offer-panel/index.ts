import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-offer { display: grid; gap: 1rem; }
@container (min-width: 860px) { .rw-offer { grid-template-columns: 1.2fr .8fr; } }
.rw-sheet, .rw-aside { padding: 1.4rem; border: 1px solid var(--rw-border); border-radius: 1.3rem; background: var(--rw-card); }
.rw-aside { background: color-mix(in srgb, var(--color-primary, #1a1d21) 12%, var(--rw-card)); }
.rw-price { margin-top: .4rem; font-size: 1.35rem; font-weight: 700; }
.rw-lines { display: grid; gap: .7rem; margin-top: 1.1rem; }
.rw-lines li { display: flex; gap: .6rem; align-items: flex-start; line-height: 1.6; }
.rw-lines i { color: var(--color-primary, #1a1d21); margin-top: .15rem; }
.rw-aside p { margin-top: .6rem; color: var(--rw-muted); line-height: 1.75; }
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
    return html`<section id="rw-offer" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "offer"}>
      <div class="rw-container">
        <div class="rw-offer">
          <div class="rw-sheet">
            ${localizedString(cfg.kicker) ? html`<p class="rw-kicker">${localizedString(cfg.kicker)}</p>` : nothing}
            ${title ? html`<h2 class="rw-title">${title}</h2>` : nothing}
            ${localizedString(cfg.price_note) ? html`<p class="rw-price">${localizedString(cfg.price_note)}</p>` : nothing}
            ${lines.length
              ? html`<ul class="rw-lines">${lines.map((line) => html`<li><i class="sicon-shield-check" aria-hidden="true"></i><span>${line}</span></li>`)}</ul>`
              : emptyCopy()}
          </div>
          <aside class="rw-aside">
            ${localizedString(cfg.aside_title) ? html`<h3 class="rw-title">${localizedString(cfg.aside_title)}</h3>` : nothing}
            ${localizedString(cfg.aside_text) ? html`<p>${localizedString(cfg.aside_text)}</p>` : nothing}
            <div class="rw-actions">${renderCta(cfg.button_label, cfg.button_url || "")}</div>
          </aside>
        </div>
      </div>
    </section>`;
  }
}
