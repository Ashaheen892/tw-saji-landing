import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { flag, getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { countUp } from "../../utils/count.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-stats { display: grid; }
@container (min-width: 720px) { .rw-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rw-stat { padding: 1.15rem 0; border-block-end: 1px solid var(--rw-border); }
@container (min-width: 720px) {
  .rw-stat { padding: .2rem 1.5rem 0; border-block-end: 0; border-inline-start: 1px solid var(--rw-border); }
  .rw-stat:first-child { padding-inline-start: 0; border-inline-start: 0; }
}
.rw-stat b { display: block; font-size: clamp(2.4rem, 5vw, 3.7rem); font-weight: 800; letter-spacing: -.045em; line-height: .95; font-variant-numeric: tabular-nums; }
.rw-stat span { display: block; margin-top: .55rem; color: var(--rw-muted); max-width: 16ch; }
`;

export default class StatStrip extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};
  private stopCount = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-stat-strip", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    this.stopCount();
    super.disconnectedCallback();
  }

  protected updated() {
    const cfg = getConfig(this.config);
    const on = cfg.count_up === undefined || cfg.count_up === "" || flag(cfg.count_up);
    if (!on) return;
    this.stopCount();
    this.stopCount = countUp(this, ".rw-stat b");
  }

  render() {
    const cfg = getConfig(this.config);
    const items = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ value: localizedString(item.value), label: localizedString(item.label) }))
      .filter((item) => item.value);
    return html`<section id="rw-stats" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "stats"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${items.length
          ? html`<div class="rw-stats">${items.map((item) => html`<article class="rw-stat"><b .textContent=${item.value}></b>${item.label ? html`<span>${item.label}</span>` : ""}</article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
