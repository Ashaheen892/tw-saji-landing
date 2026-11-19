import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";
import { emptyCopy, media } from "../../utils/ui.js";

const css = `
.rw-origin { display: grid; gap: 1.2rem; }
@container (min-width: 800px) { .rw-origin { grid-template-columns: 1.1fr .9fr; align-items: stretch; } }
.rw-origin__place { display: flex; flex-direction: column; justify-content: flex-end; min-height: 18rem; padding: 1.3rem; border-radius: 1.3rem; overflow: hidden; background: var(--rw-soft); }
.rw-origin__place img, .rw-origin__place .rw-ph { width: 100%; height: 100%; min-height: 18rem; object-fit: cover; border-radius: 1rem; }
.rw-origin__name { margin-top: .8rem; font-size: clamp(1.8rem, 4vw, 2.8rem); line-height: 1.1; }
.rw-origin__facts { display: grid; gap: .7rem; align-content: center; }
.rw-origin__fact { padding: .9rem 1rem; border-radius: .9rem; background: var(--rw-card); border: 1px solid var(--rw-border); }
.rw-origin__fact b { display: block; }
.rw-origin__fact span { display: block; margin-top: .25rem; color: var(--rw-muted); line-height: 1.7; }
`;

export default class OriginCard extends LitElement {
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
    injectStyles("rw-origin-card", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const place = localizedString(cfg.place);
    const facts = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ label: localizedString(item.label), text: localizedString(item.text) }))
      .filter((item) => item.label);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "origin"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        ${place || facts.length
          ? html`<div class="rw-origin">
              <div class="rw-origin__place">
                ${media(String(cfg.image || ""), localizedString(cfg.image_alt))}
                ${place ? html`<p class="rw-origin__name">${place}</p>` : nothing}
              </div>
              <div class="rw-origin__facts">
                ${facts.map((fact) => html`<article class="rw-origin__fact"><b>${fact.label}</b>${fact.text ? html`<span>${fact.text}</span>` : nothing}</article>`)}
              </div>
            </div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
