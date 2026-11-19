import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, unwrapValue, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-notes { display: grid; gap: 1rem; }
@container (min-width: 800px) { .rw-notes { grid-template-columns: 1fr 1fr; } }
.rw-note { padding: 1.25rem 1.3rem 1.15rem; border: 1px solid var(--rw-border); border-radius: 1.15rem 1.15rem 1.15rem .4rem; background: var(--rw-card); box-shadow: 0 18px 40px -30px rgb(28 23 18 / 55%); }
@container (min-width: 800px) { .rw-note:nth-child(2n) { margin-top: 1.4rem; border-radius: 1.15rem 1.15rem .4rem 1.15rem; } }
.rw-note q { display: block; font-size: 1.08rem; line-height: 1.8; }
.rw-note q::before { content: "“"; margin-inline-end: .15rem; color: var(--color-primary, #8a5a32); font-size: 1.4rem; }
.rw-note footer { display: flex; justify-content: space-between; gap: .6rem; margin-top: 1rem; color: var(--rw-muted); font-size: .9rem; }
.rw-stars { letter-spacing: .12em; color: var(--color-primary, #8a5a32); }
`;

export default class VoiceStack extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-voice-stack", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const items = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({
        quote: localizedString(item.quote),
        name: localizedString(item.name),
        place: localizedString(item.place),
        stars: Math.min(5, Math.max(1, Number(unwrapValue(item.stars) || 5))),
      }))
      .filter((item) => item.quote);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "voices"}>
      <div class="rw-container">
        ${heading(cfg, true)}
        ${items.length
          ? html`<div class="rw-notes">${items.map((item) => html`<figure class="rw-note">
              <q>${item.quote}</q>
              <footer>
                <span>${item.name}${item.place ? ` · ${item.place}` : ""}</span>
                <span class="rw-stars" aria-label=${`${item.stars}/5`}>${"●".repeat(item.stars)}${"○".repeat(5 - item.stars)}</span>
              </footer>
            </figure>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
