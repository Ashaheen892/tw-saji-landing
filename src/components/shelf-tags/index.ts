import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: .8rem; }
.rw-tag { width: min(11rem, 46%); min-height: 6.2rem; padding: .8rem .7rem; background: var(--rw-card); border: 1px solid var(--rw-border); box-shadow: 0 10px 24px -18px rgb(0 0 0 / 50%); }
.rw-tag:nth-child(odd) { transform: rotate(-1.5deg); }
.rw-tag:nth-child(even) { transform: rotate(1.4deg); }
.rw-tag b { display: block; font-size: 1.15rem; }
.rw-tag span { display: block; margin-top: .35rem; color: var(--rw-muted); line-height: 1.5; }
@media (prefers-reduced-motion: reduce) { .rw-tag { transform: none; } }
`;

export default class ShelfTags extends LitElement {
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
    injectStyles("rw-shelf-tags", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const tags = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ word: localizedString(item.word), note: localizedString(item.note) }))
      .filter((item) => item.word);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "tags"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        ${tags.length
          ? html`<div class="rw-tags">${tags.map((tag) => html`<article class="rw-tag"><b>${tag.word}</b>${tag.note ? html`<span>${tag.note}</span>` : ""}</article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
