import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-brands { display: flex; flex-wrap: wrap; align-items: center; }
.rw-brand { display: inline-flex; align-items: center; gap: .7rem; padding: .85rem 1.15rem; color: inherit; text-decoration: none; border-inline-end: 1px solid var(--rw-border); }
.rw-brand img { height: 2rem; width: auto; max-width: 6.5rem; object-fit: contain; }
.rw-brand b { font-weight: 750; letter-spacing: .01em; }
.rw-brand small { display: block; color: var(--rw-muted); font-size: .78rem; }
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
