import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";
import { emptyCopy } from "../../utils/ui.js";

const css = `
.rw-thread { width: min(40rem, 100%); margin-inline: auto; display: grid; gap: 0; }
.rw-thread__step { display: grid; grid-template-columns: 2.4rem 1fr; gap: .8rem; }
.rw-thread__rail { display: flex; flex-direction: column; align-items: center; }
.rw-thread__rail i { width: .7rem; height: .7rem; margin-top: .35rem; border-radius: 99px; background: var(--color-primary, #1a1d21); }
.rw-thread__rail b { flex: 1; width: 1px; background: var(--rw-border); }
.rw-thread__step:last-child .rw-thread__rail b { display: none; }
.rw-thread__body { padding-bottom: 1.2rem; }
.rw-thread__body strong { display: block; font-size: 1.05rem; }
.rw-thread__body p { margin-top: .3rem; color: var(--rw-muted); line-height: 1.75; }
`;

export default class CareThread extends LitElement {
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
    injectStyles("rw-care-thread", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const steps = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ title: localizedString(item.title), text: localizedString(item.text) }))
      .filter((item) => item.title);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "care"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        ${steps.length
          ? html`<ol class="rw-thread">${steps.map((step) => html`<li class="rw-thread__step">
              <span class="rw-thread__rail"><i></i><b></b></span>
              <div class="rw-thread__body"><strong>${step.title}</strong>${step.text ? html`<p>${step.text}</p>` : ""}</div>
            </li>`)}</ol>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
