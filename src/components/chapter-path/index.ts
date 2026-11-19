import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-path { display: grid; }
.rw-step { display: grid; grid-template-columns: 4.2rem 1fr; gap: .4rem 1rem; position: relative; padding-bottom: 1.4rem; }
.rw-step:not(:last-child)::before { content: ""; position: absolute; inset-inline-start: 1.35rem; top: 2.7rem; bottom: .2rem; width: 1px; background: var(--rw-border); }
.rw-step__no { font-size: 1.45rem; font-weight: 700; letter-spacing: -.04em; color: var(--color-primary, #1a1d21); }
.rw-step h3 { font-size: 1.15rem; }
.rw-step p { margin-top: .3rem; color: var(--rw-muted); line-height: 1.75; }
`;

export default class ChapterPath extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-chapter-path", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const items = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ title: localizedString(item.title), text: localizedString(item.text) }))
      .filter((item) => item.title);
    return html`<section id="rw-chapters" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "chapters"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${items.length
          ? html`<ol class="rw-path">${items.map((item, index) => html`<li class="rw-step">
              <span class="rw-step__no">${String(index + 1).padStart(2, "0")}</span>
              <div><h3>${item.title}</h3>${item.text ? html`<p>${item.text}</p>` : nothing}</div>
            </li>`)}</ol>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
