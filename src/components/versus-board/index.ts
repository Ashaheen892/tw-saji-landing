import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-board { display: grid; gap: .55rem; }
.rw-vrow { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; }
.rw-vcell { padding: 1rem; border-radius: .95rem; line-height: 1.65; }
.rw-vcell--off { background: var(--rw-soft); color: var(--rw-muted); }
.rw-vcell--on { background: color-mix(in srgb, var(--color-primary, #0f6e6a) 14%, var(--rw-card)); }
.rw-vhead { font-size: .82rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
`;

export default class VersusBoard extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-versus-board", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const off = localizedString(cfg.col_off) || "بدونها";
    const on = localizedString(cfg.col_on) || "معها";
    const rows = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ off: localizedString(item.off), on: localizedString(item.on) }))
      .filter((row) => row.off || row.on);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "compare"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${rows.length
          ? html`<div class="rw-board">
              <div class="rw-vrow">
                <div class="rw-vcell rw-vhead">${off}</div>
                <div class="rw-vcell rw-vhead">${on}</div>
              </div>
              ${rows.map((row) => html`<div class="rw-vrow">
                <div class="rw-vcell rw-vcell--off">${row.off}</div>
                <div class="rw-vcell rw-vcell--on">${row.on}</div>
              </div>`)}
            </div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
