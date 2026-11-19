import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { flag, getCollectionItems, getConfig, isRtl, localizedString, t, unwrapValue, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading, media } from "../../utils/ui.js";
import { clipUrl, frameSrc, hushRoot, isFileClip, releaseSound, settleSilence } from "../../utils/video.js";

const css = `
.rw-reels__bar { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; margin-bottom: 1.1rem; flex-wrap: wrap; }
.rw-reels__bar .rw-head { margin-bottom: 0; flex: 1; }
.rw-reels__nav { display: flex; gap: .45rem; }
.rw-reels__nav button, .rw-reel__sound { border: 1px solid var(--rw-border); background: var(--rw-surface); color: var(--rw-text); cursor: pointer; }
.rw-reels__nav button { width: 2.6rem; height: 2.6rem; border-radius: .6rem; }
.rw-reels__nav button:focus-visible, .rw-reel__sound:focus-visible, .rw-reel__link:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-reels__row { display: flex; gap: .8rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: .35rem; scrollbar-width: thin; }
.rw-reel { position: relative; flex: 0 0 min(16rem, 72%); scroll-snap-align: center; aspect-ratio: 9 / 16; overflow: hidden; border-radius: 1rem; background: #121417; color: #fff; }
.rw-reel video, .rw-reel img, .rw-reel iframe, .rw-reel .rw-ph { width: 100%; height: 100%; object-fit: cover; border: 0; }
.rw-reel iframe { position: absolute; inset: 0; pointer-events: none; }
.rw-reel__hit { position: absolute; inset: 0; border: 0; background: transparent; color: inherit; cursor: pointer; }
.rw-reel__meta { position: absolute; z-index: 1; inset-inline: 0; bottom: 0; display: grid; gap: .28rem; padding: .95rem .85rem .8rem; background: linear-gradient(transparent, rgb(0 0 0 / 78%)); pointer-events: none; }
.rw-reel__meta strong { font-size: .98rem; }
.rw-reel__meta p { font-size: .9rem; line-height: 1.55; color: rgb(255 255 255 / 88%); }
.rw-reel__stars { display: inline-flex; align-items: center; gap: .18rem; direction: ltr; }
.rw-reel__stars svg { width: .95rem; height: .95rem; display: block; }
.rw-reel__stars .is-on { fill: #f5c451; }
.rw-reel__stars .is-off { fill: rgb(255 255 255 / 18%); stroke: rgb(255 255 255 / 80%); }
.rw-reel__sound { position: absolute; z-index: 2; top: .7rem; inset-inline-end: .7rem; min-height: 2.4rem; padding: .35rem .7rem; border-radius: .7rem; background: rgb(18 20 23 / 72%); color: #fff; border-color: transparent; }
.rw-reel__link { justify-self: start; color: #fff; font-weight: 700; pointer-events: auto; text-decoration: underline; text-underline-offset: .18rem; }
.rw-reels .rw-actions { margin-top: 1.2rem; }
`;

type Reel = {
  source: string;
  poster: string;
  name: string;
  quote: string;
  place: string;
  stars: number;
  link: string;
  linkLabel: string;
};

export default class ReviewReels extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private active = 0;
  @state() private audible = false;
  @state() private opened = false;
  @state() private seen = false;
  @state() private sound = -1;
  private picked = -1;
  private stop = () => {};
  private observer: IntersectionObserver | null = null;
  private reduced = false;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-review-reels", css);
    this.stop = watchLocale(this);
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.stop();
    super.disconnectedCallback();
  }

  protected updated() {
    this.watch();
    this.querySelectorAll(".rw-reel.is-live").forEach((card) => {
      const index = Number((card as HTMLElement).dataset.index || 0);
      const voiced = flag(getConfig(this.config).autoplay) ? index === this.sound : this.audible;
      if (voiced) releaseSound(card);
      else settleSilence(card);
    });
  }

  private reels(): Reel[] {
    return getCollectionItems<Record<string, any>>(getConfig(this.config).items, "items")
      .map((item) => ({
        source: clipUrl(item.video_url),
        poster: String(item.poster || ""),
        name: localizedString(item.name),
        quote: localizedString(item.quote),
        place: localizedString(item.place),
        stars: Math.min(5, Math.max(0, Number(unwrapValue(item.stars) || 0))),
        link: clipUrl(item.link_url),
        linkLabel: localizedString(item.link_label),
      }))
      .filter((item) => item.source || item.poster || item.quote || item.name);
  }

  private watch() {
    const row = this.querySelector(".rw-reels__row");
    if (!row) return;
    const auto = flag(getConfig(this.config).autoplay) && !this.reduced;
    if (auto) {
      if (this.seen) {
        this.observer?.disconnect();
        this.observer = null;
        return;
      }
      if (this.observer) return;
      this.observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this.seen = true;
      }, { threshold: 0.2 });
      this.observer.observe(row);
      return;
    }
    this.observer?.disconnect();
    this.observer = new IntersectionObserver((entries) => {
      const best = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!best) return;
      const index = Number((best.target as HTMLElement).dataset.index || 0);
      if (this.picked >= 0 && index !== this.picked) return;
      if (index === this.picked) this.picked = -1;
      if (index !== this.active) {
        this.audible = false;
        this.opened = false;
        this.active = index;
      }
    }, { root: row, threshold: [0.65, 0.85] });
    row.querySelectorAll(".rw-reel").forEach((card) => this.observer?.observe(card));
  }

  private move(dir: number) {
    const row = this.querySelector(".rw-reels__row");
    const card = row?.querySelector(".rw-reel");
    if (!row || !card) return;
    const delta = (card.getBoundingClientRect().width + 12) * dir * (isRtl() ? -1 : 1);
    row.scrollBy({ left: delta, behavior: this.reduced ? "auto" : "smooth" });
  }

  private toggleSound(index: number) {
    const next = this.sound === index ? -1 : index;
    this.querySelectorAll(".rw-reel").forEach((card) => {
      const current = Number((card as HTMLElement).dataset.index || 0);
      if (current === next) releaseSound(card);
      else hushRoot(card);
    });
    this.sound = next;
  }

  private playCard(index: number, event: Event) {
    const card = (event.currentTarget as HTMLElement).closest(".rw-reel");
    if (flag(getConfig(this.config).autoplay) && !this.reduced) {
      this.seen = true;
      if (index !== this.active) card?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      return;
    }
    if (index !== this.active) {
      this.picked = index;
      this.audible = false;
      this.opened = false;
      this.active = index;
      card?.scrollIntoView({ inline: "center", block: "nearest", behavior: this.reduced ? "auto" : "smooth" });
      return;
    }
    if (this.audible) {
      this.audible = false;
      if (card) hushRoot(card);
      return;
    }
    this.opened = true;
    this.audible = true;
    if (card) releaseSound(card);
  }

  render() {
    const cfg = getConfig(this.config);
    const items = this.reels();
    const auto = flag(cfg.autoplay) && !this.reduced;
    const title = localizedString(cfg.title);
    return html`<section class="rw-block rw-section rw-reels ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "reels"}>
      <div class="rw-container">
        <div class="rw-reels__bar">
          ${heading(cfg)}
          ${items.length > 1 ? html`<div class="rw-reels__nav">
            <button type="button" aria-label=${t({ ar: "السابق", en: "Previous" })} @click=${() => this.move(-1)}>‹</button>
            <button type="button" aria-label=${t({ ar: "التالي", en: "Next" })} @click=${() => this.move(1)}>›</button>
          </div>` : nothing}
        </div>
        ${items.length ? html`<div class="rw-reels__row">
          ${items.map((item, index) => {
            const voiced = auto ? index === this.sound : this.audible && index === this.active;
            const live = Boolean(item.source) && (auto ? this.seen : index === this.active && (this.opened || voiced));
            const file = isFileClip(item.source);
            return html`<article class="rw-reel ${live ? "is-live" : ""}" data-index=${index}>
              ${live && item.source
                ? file
                  ? html`<video src=${item.source} poster=${item.poster || nothing} playsinline loop .muted=${!voiced}></video>`
                  : html`<iframe src=${frameSrc(item.source, true, true)} title=${item.name || item.quote || "reel"} allow="autoplay; encrypted-media; picture-in-picture"></iframe>`
                : item.poster
                  ? media(item.poster, item.name || item.quote)
                  : html`<div class="rw-ph">${item.source ? "▶" : t({ ar: "أضف فيديو التجربة", en: "Add the experience video" })}</div>`}
              ${live ? nothing : html`<button type="button" class="rw-reel__hit" aria-label=${item.name || t({ ar: "تشغيل", en: "Play" })} @click=${(event: Event) => this.playCard(index, event)}></button>`}
              ${live ? html`<button type="button" class="rw-reel__sound" aria-pressed=${voiced ? "true" : "false"} @click=${(event: Event) => (auto ? this.toggleSound(index) : this.playCard(index, event))}>${voiced ? t({ ar: "كتم", en: "Mute" }) : t({ ar: "صوت", en: "Sound" })}</button>` : nothing}
              <div class="rw-reel__meta">
                ${item.stars ? html`<span class="rw-reel__stars" dir="ltr" role="img" aria-label=${`${item.stars}/5`}>${[1, 2, 3, 4, 5].map((star) => html`<svg viewBox="0 0 24 24" class=${star <= item.stars ? "is-on" : "is-off"} aria-hidden="true"><path d="M12 2.4 14.8 8.7l6.8.6-5.2 4.4 1.6 6.6L12 17.2 6 20.3l1.6-6.6L2.4 9.3l6.8-.6L12 2.4z" /></svg>`)}</span>` : nothing}
                ${item.name ? html`<strong>${item.name}${item.place ? ` · ${item.place}` : ""}</strong>` : nothing}
                ${item.quote ? html`<p>${item.quote}</p>` : nothing}
                ${item.link && item.linkLabel ? html`<a class="rw-reel__link" href=${item.link}>${item.linkLabel}</a>` : nothing}
              </div>
            </article>`;
          })}
        </div>` : emptyCopy()}
        <div class="rw-actions">${renderCta(cfg.button_label, String(cfg.button_url || ""))}</div>
      </div>
    </section>`;
  }
}
