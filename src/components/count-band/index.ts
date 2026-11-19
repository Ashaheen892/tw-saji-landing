import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-counts { display: grid; }
@container (min-width: 720px) { .rw-counts { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rw-count { padding: 1.4rem 1rem; text-align: center; }
@container (min-width: 720px) { .rw-count + .rw-count { border-inline-start: 1px solid var(--rw-border); } }
.rw-count strong { display: block; font-size: clamp(2.2rem, 5vw, 3.5rem); line-height: 1; letter-spacing: -.05em; }
.rw-count b { display: block; margin-top: .55rem; font-size: 1rem; }
.rw-count span { display: block; margin-top: .3rem; color: var(--rw-muted); }
`;

export default class CountBand extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-count-band", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const items = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({
        value: localizedString(item.value),
        label: localizedString(item.label),
        hint: localizedString(item.hint),
      }))
      .filter((item) => item.value);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "counts"}>
      <div class="rw-container">
        ${items.length
          ? html`<div class="rw-counts">${items.map((item) => html`<article class="rw-count">
              <strong>${item.value}</strong>
              ${item.label ? html`<b>${item.label}</b>` : nothing}
              ${item.hint ? html`<span>${item.hint}</span>` : nothing}
            </article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
