import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { flag, getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { applyTone, currentTone, renderCta, renderTone, rememberTone, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";

const css = `
.rw-dock { position: relative; display: flex; align-items: flex-end; min-height: 78vh; overflow: hidden; color: #f7f3ec; }
.rw-dock__media, .rw-dock__shade, .rw-dock__fallback { position: absolute; inset: 0; width: 100%; height: 100%; }
.rw-dock__media { object-fit: cover; }
.rw-dock__fallback { background:
  radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--color-primary, #0f6e6a) 55%, transparent), transparent 36%),
  linear-gradient(165deg, #10211f, #1b1410 70%); }
.rw-dock__shade { background: linear-gradient(180deg, rgb(0 0 0 / 10%) 10%, rgb(0 0 0 / 74%)); }
.rw-dock__body { position: relative; z-index: 1; width: min(1120px, calc(100% - 2rem)); margin: 0 auto 1.4rem; }
.rw-dock .rw-lead { color: rgb(247 243 236 / 84%); }
.rw-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 1.4rem; border: 1px solid rgb(255 255 255 / 18%); border-radius: 1.1rem; background: rgb(255 255 255 / 10%); backdrop-filter: blur(12px); }
.rw-fact { padding: .95rem .8rem; }
.rw-fact + .rw-fact { border-inline-start: 1px solid rgb(255 255 255 / 16%); }
.rw-fact strong { display: block; font-size: clamp(1.2rem, 2vw, 1.7rem); }
.rw-fact span { color: rgb(247 243 236 / 76%); font-size: .85rem; }
`;

export default class DockHero extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private dark = false;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-dock-hero", css);
    rememberTone();
    this.dark = currentTone() === "dark";
    const onTone = () => {
      this.dark = currentTone() === "dark";
    };
    window.addEventListener("rw-tone", onTone);
    const stopLocale = watchLocale(this);
    this.stop = () => {
      window.removeEventListener("rw-tone", onTone);
      stopLocale();
    };
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
      ${renderTone(flag(cfg.show_tone), this.dark, () => applyTone(this.dark ? "light" : "dark"))}
      <div class="rw-dock">
        ${cfg.image
          ? html`<img class="rw-dock__media" src=${cfg.image} alt=${localizedString(cfg.image_alt)} />`
          : html`<div class="rw-dock__fallback"></div>`}
        <div class="rw-dock__shade"></div>
        <div class="rw-dock__body">
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
