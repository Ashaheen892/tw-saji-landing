import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-partners { display: grid; gap: 1rem; counter-reset: rw-partner; }
@container (min-width: 640px) { .rw-partners { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (min-width: 900px) { .rw-partners { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rw-partner { counter-increment: rw-partner; position: relative; padding: 1.35rem 1.25rem 1.25rem; border-radius: 1rem; background: var(--rw-card); border: 1px solid var(--rw-border); }
.rw-partner::before { content: counter(rw-partner, decimal-leading-zero); display: block; margin-bottom: 1.6rem; font-size: 2.1rem; font-weight: 800; line-height: 1; letter-spacing: -.04em; color: transparent; -webkit-text-stroke: 1px var(--rw-muted); font-variant-numeric: tabular-nums; }
.rw-partner b { display: block; font-size: 1.1rem; }
.rw-partner span { display: block; margin-top: .35rem; color: var(--rw-muted); line-height: 1.6; }
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
