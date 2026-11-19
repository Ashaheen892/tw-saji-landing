import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { sectionTitle, titleCss } from "../../utils/title.js";

const css = `
.rw-letter { width: min(42rem, 100%); margin-inline: auto; padding: 1.6rem 1.4rem 1.4rem; background: var(--rw-card); border-radius: 1.2rem; border: 1px solid var(--rw-border); }
.rw-letter p { color: var(--rw-muted); line-height: 1.9; font-size: 1.05rem; }
.rw-letter__sign { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-end; margin-top: 1.3rem; padding-top: 1rem; border-top: 1px solid var(--rw-border); }
.rw-letter__sign b { display: block; }
.rw-letter__sign span { display: block; color: var(--rw-muted); }
`;

export default class MakerLetter extends LitElement {
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
    injectStyles("rw-maker-letter", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const body = localizedString(cfg.text);
    const name = localizedString(cfg.signer);
    const role = localizedString(cfg.role);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "letter"}>
      <div class="rw-container">
        ${sectionTitle(cfg)}
        <article class="rw-letter">
          ${body ? html`<p>${body}</p>` : nothing}
          <div class="rw-letter__sign">
            <div>${name ? html`<b>${name}</b>` : nothing}${role ? html`<span>${role}</span>` : nothing}</div>
            ${renderCta(cfg.button_label, String(cfg.button_url || ""))}
          </div>
        </article>
      </div>
    </section>`;
  }
}
