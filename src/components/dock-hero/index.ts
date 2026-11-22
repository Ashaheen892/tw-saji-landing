import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";

const css = `
.rw-stage { position: relative; display: flex; align-items: flex-end; min-height: 78vh; overflow: hidden; color: #f4f6f8; }
.rw-stage__media, .rw-stage__shade, .rw-stage__fallback { position: absolute; inset: 0; width: 100%; height: 100%; }
.rw-stage__media { object-fit: cover; }
.rw-stage__fallback { background:
  radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--color-primary, #1a1d21) 55%, transparent), transparent 36%),
  linear-gradient(165deg, #10211f, #1b1410 70%); }
.rw-stage__shade { background: linear-gradient(180deg, rgb(0 0 0 / 10%) 10%, rgb(0 0 0 / 74%)); }
.rw-stage__body { position: relative; z-index: 1; width: min(1120px, calc(100% - 2rem)); margin: 0 auto 1.4rem; }
.rw-stage .rw-lead { color: rgb(247 243 236 / 84%); }
.rw-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 1.4rem; border: 1px solid rgb(255 255 255 / 18%); border-radius: 1.1rem; background: rgb(255 255 255 / 10%); backdrop-filter: blur(12px); }
.rw-fact { padding: .95rem .8rem; }
.rw-fact + .rw-fact { border-inline-start: 1px solid rgb(255 255 255 / 16%); }
.rw-fact strong { display: block; font-size: clamp(1.2rem, 2vw, 1.7rem); }
.rw-fact span { color: rgb(247 243 236 / 76%); font-size: .85rem; }
`;

export default class DockHero extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-stage-hero", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const title = localizedString(cfg.title);
    const facts = [1, 2, 3]
      .map((n) => ({ value: localizedString(cfg[`fact_${n}_value`]), label: localizedString(cfg[`fact_${n}_label`]) }))
      .filter((fact) => fact.value || fact.label);
    return html`<section class="rw-block ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || t({ ar: "واجهة الرصيف", en: "Dock hero" })}>
      <div class="rw-stage">
        ${cfg.image
          ? html`<img class="rw-stage__media" src=${cfg.image} alt=${localizedString(cfg.image_alt)} />`
          : html`<div class="rw-stage__fallback"></div>`}
        <div class="rw-stage__shade"></div>
        <div class="rw-stage__body">
          ${localizedString(cfg.kicker) ? html`<p class="rw-kicker">${localizedString(cfg.kicker)}</p>` : nothing}
          ${title ? html`<h2 class="rw-display">${title}</h2>` : nothing}
          ${localizedString(cfg.text) ? html`<p class="rw-lead">${localizedString(cfg.text)}</p>` : nothing}
          <div class="rw-actions">${renderCta(cfg.button_label, cfg.button_url || "")}</div>
          ${facts.length
            ? html`<div class="rw-facts">${facts.map((fact) => html`<div class="rw-fact"><strong>${fact.value}</strong><span>${fact.label}</span></div>`)}</div>`
            : nothing}
        </div>
      </div>
    </section>`;
  }
}
