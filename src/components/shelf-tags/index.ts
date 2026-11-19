import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-shelf { display: grid; grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr)); gap: .75rem; padding-top: 1rem; border-top: 2px solid var(--rw-text); }
.rw-tag { display: flex; flex-direction: column; justify-content: space-between; min-height: 8.5rem; padding: 1rem .9rem .95rem; background: var(--rw-card); border: 1px solid var(--rw-border); border-top: 4px solid var(--color-primary, #1a1d21); }
.rw-tag b { font-size: 1.25rem; line-height: 1.3; }
.rw-tag span { display: block; margin-top: .7rem; color: var(--rw-muted); line-height: 1.55; }
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
          ? html`<div class="rw-shelf">${tags.map((tag) => html`<article class="rw-tag"><b>${tag.word}</b>${tag.note ? html`<span>${tag.note}</span>` : ""}</article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
