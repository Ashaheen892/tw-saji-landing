import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-receipt { width: min(34rem, 100%); margin-inline: auto; padding: 1.4rem 1.3rem 1.6rem; background: var(--rw-card); border: 1px solid var(--rw-border); }
.rw-receipt__row { display: flex; gap: .7rem; align-items: baseline; padding-block: .7rem; border-bottom: 1px dashed var(--rw-border); }
.rw-receipt__row b { flex: 0 0 auto; }
.rw-receipt__row span { margin-inline-start: auto; color: var(--rw-muted); text-align: end; }
.rw-receipt__foot { margin-top: .9rem; color: var(--rw-muted); line-height: 1.7; }
`;

export default class ReceiptNote extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-title", titleCss);
    injectStyles("rw-receipt-note", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const rows = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ label: localizedString(item.label), value: localizedString(item.value) }))
      .filter((item) => item.label);
    const foot = localizedString(cfg.foot);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "receipt"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        ${rows.length
          ? html`<div class="rw-receipt">
              ${rows.map((row) => html`<div class="rw-receipt__row"><b>${row.label}</b>${row.value ? html`<span>${row.value}</span>` : ""}</div>`)}
              ${foot ? html`<p class="rw-receipt__foot">${foot}</p>` : ""}
            </div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
