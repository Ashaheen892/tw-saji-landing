import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-partners { display: grid; gap: 0; }
@container (min-width: 760px) { .rw-partners { grid-template-columns: 1fr 1fr; } }
.rw-partner { padding: 1rem 0; border-block-end: 1px solid var(--rw-border); }
@container (min-width: 760px) { .rw-partner:nth-child(odd) { padding-inline-end: 1.5rem; } }
.rw-partner b { display: block; font-size: 1.08rem; }
.rw-partner span { display: block; margin-top: .3rem; color: var(--rw-muted); line-height: 1.6; }
`;

export default class PartnerRow extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-partner-row", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const items = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ name: localizedString(item.name), note: localizedString(item.note) }))
      .filter((item) => item.name);
    return html`<section id="rw-partners" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "partners"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${items.length
          ? html`<div class="rw-partners">${items.map((item) => html`<article class="rw-partner"><b>${item.name}</b>${item.note ? html`<span>${item.note}</span>` : nothing}</article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
