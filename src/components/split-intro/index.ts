import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, t, unwrapValue, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { media } from "../../utils/ui.js";

const css = `
.rw-split { display: grid; gap: 1.75rem; align-items: center; }
@container (min-width: 860px) {
  .rw-split { grid-template-columns: 1.05fr .95fr; gap: 3rem; }
  .rw-split--end .rw-split__copy { order: 2; }
}
.rw-split__media { position: relative; min-height: 22rem; }
.rw-split__frame { position: absolute; inset: 14% -7% -8% 10%; border-radius: 1.8rem; background: color-mix(in srgb, var(--color-primary, #1a1d21) 22%, var(--rw-surface-2)); }
.rw-split__media img, .rw-split__media .rw-ph { position: relative; width: 100%; height: 100%; min-height: 22rem; object-fit: cover; border-radius: 1.6rem; }
`;

export default class SplitIntro extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-split-intro", css);
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
    const kicker = localizedString(cfg.kicker);
    const end = String(unwrapValue(cfg.media_side) || "start") === "end";
    const secondary = localizedString(cfg.secondary_label);
    if (!title && !text && !cfg.image) return nothing;
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || t({ ar: "مقدمة الصفحة", en: "Page introduction" })}>
      <div class="rw-container">
        <div class="rw-split ${end ? "rw-split--end" : ""}">
          <div class="rw-split__copy">
            ${kicker ? html`<p class="rw-kicker">${kicker}</p>` : nothing}
            ${title ? html`<h2 class="rw-display">${title}</h2><span class="rw-rule"></span>` : nothing}
            ${text ? html`<p class="rw-lead">${text}</p>` : nothing}
            <div class="rw-actions">
              ${renderCta(cfg.primary_label, cfg.primary_url || "")}
              ${secondary && cfg.secondary_url ? html`<a class="rw-btn rw-btn--ghost" href=${cfg.secondary_url}>${secondary}</a>` : nothing}
            </div>
          </div>
          <div class="rw-split__media">
            <div class="rw-split__frame"></div>
            ${media(cfg.image || "", localizedString(cfg.image_alt))}
          </div>
        </div>
      </div>
    </section>`;
  }
}
