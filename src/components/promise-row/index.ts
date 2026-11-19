import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-promises { display: grid; border: 1px solid var(--rw-border); border-radius: 1.3rem; background: var(--rw-card); overflow: hidden; }
@container (min-width: 760px) { .rw-promises { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.rw-promise { display: flex; gap: .8rem; align-items: flex-start; padding: 1.15rem 1rem; border-block-end: 1px solid var(--rw-border); }
@container (min-width: 760px) {
  .rw-promise { border-block-end: 0; border-inline-start: 1px solid var(--rw-border); }
  .rw-promise:first-child { border-inline-start: 0; }
}
.rw-promise i { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; flex: none; border-radius: .7rem; background: color-mix(in srgb, var(--color-primary, #1a1d21) 14%, var(--rw-soft)); color: var(--color-primary, #1a1d21); }
.rw-promise strong { display: block; font-size: 1rem; }
.rw-promise span { display: block; margin-top: .25rem; color: var(--rw-muted); font-size: .88rem; line-height: 1.6; }
`;

export default class PromiseRow extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-promise-row", css);
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
        icon: item.icon || "sicon-shield-check",
        title: localizedString(item.title),
        note: localizedString(item.note),
      }))
      .filter((item) => item.title);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "promises"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${items.length
          ? html`<div class="rw-promises">${items.map((item) => html`<article class="rw-promise">
              <i class=${item.icon} aria-hidden="true"></i>
              <div><strong>${item.title}</strong>${item.note ? html`<span>${item.note}</span>` : nothing}</div>
            </article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
