import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-brands { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-block-start: 1px solid var(--rw-border); border-inline-start: 1px solid var(--rw-border); }
@container (min-width: 720px) { .rw-brands { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.rw-brand { display: grid; place-items: center; align-content: center; gap: .45rem; min-height: 8.5rem; padding: 1.2rem .8rem; text-align: center; color: inherit; text-decoration: none; border-inline-end: 1px solid var(--rw-border); border-block-end: 1px solid var(--rw-border); transition: background .2s ease; }
a.rw-brand:hover { background: var(--rw-soft); }
.rw-brand img { height: 2.4rem; width: auto; max-width: 8rem; object-fit: contain; filter: grayscale(1); opacity: .85; }
a.rw-brand:hover img { filter: none; opacity: 1; }
.rw-brand b { display: block; font-size: 1.05rem; font-weight: 750; letter-spacing: -.01em; }
.rw-brand small { display: block; color: var(--rw-muted); font-size: .8rem; }
`;

export default class BrandRow extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-brand-row", css);
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
        name: localizedString(item.name),
        note: localizedString(item.note),
        image: String(item.image || "").trim(),
        url: String(item.url || "").trim(),
      }))
      .filter((item) => item.name);
    const body = items.map((item) => {
      const inner = html`${item.image ? html`<img src=${item.image} alt="" />` : nothing}<span><b>${item.name}</b>${item.note ? html`<small>${item.note}</small>` : nothing}</span>`;
      return item.url
        ? html`<a class="rw-brand" href=${item.url}>${inner}</a>`
        : html`<span class="rw-brand">${inner}</span>`;
    });
    return html`<section id="rw-brands" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "brands"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${items.length ? html`<div class="rw-brands">${body}</div>` : emptyCopy()}
      </div>
    </section>`;
  }
}
