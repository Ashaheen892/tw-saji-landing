import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-chips { display: flex; flex-wrap: wrap; gap: .55rem; }
.rw-chip { min-height: 2.8rem; padding: .55rem 1rem; border: 1px solid var(--rw-border); border-radius: 999px; background: var(--rw-card); color: var(--rw-text); cursor: pointer; }
.rw-chip[aria-pressed="true"] { border-color: var(--color-primary, #1a1d21); background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); }
.rw-fit { margin-top: 1rem; padding: 1.3rem; border-radius: 1.2rem; background: var(--rw-card); border: 1px solid var(--rw-border); }
.rw-fit p { margin-top: .35rem; color: var(--rw-muted); line-height: 1.8; font-size: 1.05rem; }
`;

export default class SituationPick extends LitElement {
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
    injectStyles("rw-situation-pick", css);
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
        label: localizedString(item.label),
        message: localizedString(item.message),
        button: localizedString(item.button),
      }))
      .filter((item) => item.label);
    const current = items[Math.min(this.index, Math.max(items.length - 1, 0))];
    return html`<section id="rw-fit" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "fit"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${items.length
          ? html`<div class="rw-chips" role="group">
              ${items.map((item, i) => html`<button type="button" class="rw-chip" aria-pressed=${i === this.index ? "true" : "false"} @click=${() => { this.index = i; }}>${item.label}</button>`)}
            </div>
            ${current
              ? html`<div class="rw-fit">
                  <h3>${current.label}</h3>
                  ${current.message ? html`<p>${current.message}</p>` : nothing}
                  <div class="rw-actions">${renderCta(current.button || cfg.button_label, cfg.button_url || "")}</div>
                </div>`
              : nothing}`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
