import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-days { display: grid; gap: .7rem; }
@container (min-width: 760px) { .rw-days { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rw-day { min-height: 8.5rem; padding: 1.1rem; border: 1px solid var(--rw-border); border-radius: 1.1rem; background: var(--rw-card); color: var(--rw-text); text-align: start; cursor: pointer; }
.rw-day[aria-pressed="true"] { border-color: var(--color-primary, #1a1d21); background: color-mix(in srgb, var(--color-primary, #1a1d21) 10%, var(--rw-card)); }
.rw-day small { display: block; color: var(--color-primary, #1a1d21); font-weight: 700; }
.rw-day strong { display: block; margin-top: .35rem; font-size: 1.2rem; }
.rw-day p { margin-top: .55rem; color: var(--rw-muted); line-height: 1.7; }
`;

export default class DayParts extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private index = 0;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-title", titleCss);
    injectStyles("rw-day-parts", css);
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
        when: localizedString(item.when),
        title: localizedString(item.title),
        text: localizedString(item.text),
      }))
      .filter((item) => item.title);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "day"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        ${items.length
          ? html`<div class="rw-days">${items.map((item, index) => html`<button type="button" class="rw-day" aria-pressed=${index === this.index ? "true" : "false"} @click=${() => { this.index = index; }}>
              ${item.when ? html`<small>${item.when}</small>` : nothing}
              <strong>${item.title}</strong>
              ${index === this.index && item.text ? html`<p>${item.text}</p>` : nothing}
            </button>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
