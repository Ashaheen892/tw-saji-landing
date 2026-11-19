import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-when { display: flex; gap: .45rem; overflow-x: auto; }
.rw-when button { flex: 1 0 auto; min-height: 2.9rem; padding: .55rem .95rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: var(--rw-card); color: var(--rw-text); cursor: pointer; }
.rw-when button[aria-selected="true"] { border-color: transparent; background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); }
.rw-when button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-daypanel { margin-top: .8rem; min-height: 9rem; padding: 1.35rem 1.25rem; border: 1px solid var(--rw-border); border-radius: 1rem; background: var(--rw-card); }
.rw-daypanel small { color: var(--color-primary, #1a1d21); font-weight: 700; }
.rw-daypanel h3 { margin-top: .35rem; font-size: clamp(1.35rem, 2vw, 1.8rem); line-height: 1.3; }
.rw-daypanel p { max-width: 38rem; margin-top: .7rem; color: var(--rw-muted); line-height: 1.85; }
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
    const safe = Math.min(this.index, Math.max(items.length - 1, 0));
    const current = items[safe];
    const tabId = (index: number) => `rw-when-${index}`;
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "day"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        ${current
          ? html`<div class="rw-when" role="tablist">${items.map((item, index) => html`<button type="button" id=${tabId(index)} role="tab" aria-selected=${index === safe ? "true" : "false"} aria-controls="rw-day-panel" @click=${() => { this.index = index; }}>${item.when || item.title}</button>`)}</div>
            <div id="rw-day-panel" class="rw-daypanel" role="tabpanel" aria-labelledby=${tabId(safe)}>
              ${current.when ? html`<small>${current.when}</small>` : nothing}
              <h3>${current.title}</h3>
              ${current.text ? html`<p>${current.text}</p>` : nothing}
            </div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
