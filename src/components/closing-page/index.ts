import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";

const css = `
.rw-invite { position: relative; max-width: 42rem; margin-inline: auto; padding: 2.6rem 1.4rem 2.2rem; text-align: center; border: 1px solid var(--rw-border); border-radius: 1.8rem; background: var(--rw-card); }
.rw-invite::before, .rw-invite::after { content: ""; position: absolute; width: .7rem; height: .7rem; border: 2px solid var(--color-primary, #1a1d21); }
.rw-invite::before { top: .8rem; inset-inline-start: .8rem; border-inline-end: 0; border-block-end: 0; }
.rw-invite::after { bottom: .8rem; inset-inline-end: .8rem; border-inline-start: 0; border-block-start: 0; }
.rw-invite .rw-lead, .rw-invite .rw-actions, .rw-invite .rw-rule { margin-inline: auto; }
.rw-invite .rw-actions { justify-content: center; }
.rw-invite__note { margin-top: 1rem; color: var(--rw-muted); font-size: .92rem; }
`;

export default class CloseInvite extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-close-invite", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const title = localizedString(cfg.title);
    const text = localizedString(cfg.text);
    const note = localizedString(cfg.note);
    const kicker = localizedString(cfg.kicker);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || t({ ar: "دعوة الختام", en: "Closing invite" })}>
      <div class="rw-container">
        <div class="rw-invite">
          ${kicker ? html`<p class="rw-kicker">${kicker}</p>` : nothing}
          ${title ? html`<h2 class="rw-display">${title}</h2><span class="rw-rule"></span>` : nothing}
          ${text ? html`<p class="rw-lead">${text}</p>` : nothing}
          <div class="rw-actions">${renderCta(cfg.button_label, cfg.button_url || "")}</div>
          ${note ? html`<p class="rw-invite__note">${note}</p>` : nothing}
        </div>
      </div>
    </section>`;
  }
}
