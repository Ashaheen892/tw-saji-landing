import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, isRtl, localizedString, t, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-rail-head { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-end; }
.rw-rail-nav { display: flex; gap: .4rem; }
.rw-rail-nav button { width: 2.7rem; height: 2.7rem; border: 1px solid var(--rw-border); border-radius: 999px; background: var(--rw-card); color: var(--rw-text); cursor: pointer; }
.rw-rail { display: flex; gap: .85rem; margin-top: 1.2rem; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.rw-rail::-webkit-scrollbar { display: none; }
.rw-reason { flex: 0 0 min(78%, 270px); scroll-snap-align: start; min-height: 11rem; padding: 1.15rem; border: 1px solid var(--rw-border); border-radius: 1.15rem; background: var(--rw-card); }
.rw-reason i { color: var(--color-primary, #1a1d21); font-size: 1.3rem; }
.rw-reason h3 { margin-top: .7rem; font-size: 1.05rem; }
.rw-reason p { margin-top: .4rem; color: var(--rw-muted); line-height: 1.7; font-size: .92rem; }
`;

export default class ReasonRail extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-reason-rail", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  private move(direction: 1 | -1) {
    const rail = this.querySelector<HTMLElement>(".rw-rail");
    if (!rail) return;
    const amount = rail.clientWidth * 0.82 * direction * (isRtl() ? -1 : 1);
    rail.scrollBy({ left: amount, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  render() {
    const cfg = getConfig(this.config);
    const items = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({ icon: item.icon || "sicon-star2", title: localizedString(item.title), text: localizedString(item.text) }))
      .filter((item) => item.title);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "reasons"}>
      <div class="rw-container">
        <div class="rw-rail-head">
          ${heading(cfg)}
          ${items.length > 1
            ? html`<div class="rw-rail-nav">
                <button type="button" aria-label=${t({ ar: "السابق", en: "Previous" })} @click=${() => this.move(-1)}>‹</button>
                <button type="button" aria-label=${t({ ar: "التالي", en: "Next" })} @click=${() => this.move(1)}>›</button>
              </div>`
            : nothing}
        </div>
        ${items.length
          ? html`<div class="rw-rail">${items.map((item) => html`<article class="rw-reason">
              <i class=${item.icon} aria-hidden="true"></i>
              <h3>${item.title}</h3>
              ${item.text ? html`<p>${item.text}</p>` : nothing}
            </article>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
