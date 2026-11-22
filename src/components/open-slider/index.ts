import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, isRtl, localizedString, t, unwrapValue, watchLocale } from "../../utils/config.js";
import { renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, media } from "../../utils/ui.js";
import { clipUrl, frameSrc, isFileClip } from "../../utils/video.js";

/**
 * Full-width opening slider. The slide is the section background and the words sit on it.
 * "framed" keeps a tall photo whole: a blurred copy fills the width and the sharp photo sits in a card.
 * Small photo tabs at the end side switch slides and fill as the slide plays.
 */
const css = `
.rw-opener { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-rows: 1fr auto; min-height: var(--op-h); color: #fff; background: #111315; --op-h: min(90svh, 820px); touch-action: pan-y; }
.rw-opener.is-tall { --op-h: min(76svh, 700px); }
.rw-opener.is-medium { --op-h: 540px; }
.rw-opener__bg { position: absolute; inset: 0; z-index: -2; }
.rw-opener__bg img, .rw-opener__bg video, .rw-opener__bg iframe, .rw-opener__bg .rw-ph, .rw-opener__card img, .rw-opener__card video, .rw-opener__card iframe, .rw-opener__card .rw-ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: var(--op-focus, center); border: 0; animation: rw-opener-in .7s ease; }
.rw-opener__bg iframe, .rw-opener__card iframe { pointer-events: none; transform: scale(1.35); }
.rw-opener__bg picture, .rw-opener__card picture { display: contents; }
.rw-opener__shade { position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    linear-gradient(to top, rgb(12 13 15 / calc(var(--op-a, .7) + .1)) 0%, rgb(12 13 15 / calc(var(--op-a, .7) * .5)) 38%, rgb(12 13 15 / 0) 70%),
    linear-gradient(to var(--op-to, left), rgb(12 13 15 / calc(var(--op-a, .7) * .7)) 0%, rgb(12 13 15 / 0) 60%); }
.rw-opener.is-ltr { --op-to: right; }
.rw-opener.is-soft { --op-a: .45; }
.rw-opener.is-strong { --op-a: .88; }
.rw-opener__top { position: relative; display: flex; justify-content: flex-end; align-items: center; gap: .5rem; width: min(1180px, calc(100% - 2rem)); margin-inline: auto; padding-top: 1rem; }
.rw-opener__body { position: relative; display: grid; align-items: end; gap: 2rem; width: min(1180px, calc(100% - 2rem)); margin-inline: auto; padding-block: clamp(5rem, 14vh, 9rem) 1.6rem; }
.rw-opener__copy { max-width: 40rem; }
.rw-opener__copy h2 { margin: 0; font-size: clamp(2.1rem, 5.2vw, 4.2rem); line-height: 1.08; font-weight: 800; letter-spacing: -.035em; color: #fff; text-wrap: balance; animation: rw-opener-up .6s ease; }
.rw-opener__copy p { max-width: 34rem; margin-top: 1rem; color: rgb(255 255 255 / 84%); font-size: 1.05rem; line-height: 1.8; animation: rw-opener-up .8s ease; }
.rw-opener__copy .rw-actions { margin-top: 1.6rem; }
.rw-opener__copy .rw-actions>.rw-btn { min-height: 3.2rem; padding-inline: 1.7rem; }
.rw-opener__copy .rw-actions>.rw-btn--ghost { color: #fff; border-color: rgb(255 255 255 / 55%); background: rgb(255 255 255 / 8%); backdrop-filter: blur(6px); }
.rw-opener__card { display: none; position: relative; overflow: hidden; width: clamp(15rem, 26vw, 22rem); aspect-ratio: 4 / 5; border-radius: 1.4rem; box-shadow: 0 24px 70px rgb(0 0 0 / 45%); outline: 1px solid rgb(255 255 255 / 30%); outline-offset: -1px; }
@container (min-width: 900px) {
  .rw-opener.is-framed .rw-opener__body { grid-template-columns: minmax(0, 1fr) auto; }
  .rw-opener.is-framed .rw-opener__card { display: block; }
  .rw-opener.is-framed .rw-opener__bg img, .rw-opener.is-framed .rw-opener__bg video { filter: blur(24px) saturate(.9) brightness(.7); transform: scale(1.15); }
  .rw-opener.is-framed .rw-opener__bg iframe { display: none; }
}
.rw-opener__foot { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; width: min(1180px, calc(100% - 2rem)); margin-inline: auto; padding-bottom: 1.4rem; }
.rw-opener__tabs { display: flex; gap: .6rem; margin-inline-start: auto; }
.rw-opener__tabs button { position: relative; display: grid; gap: .45rem; width: 4.6rem; padding: 0; border: 0; background: transparent; color: rgb(255 255 255 / 70%); font: inherit; font-size: .75rem; font-weight: 700; text-align: start; cursor: pointer; }
.rw-opener__tabs .rw-opener__thumb { position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden; border-radius: .6rem; background: rgb(255 255 255 / 12%); opacity: .62; transition: opacity .25s, transform .25s; }
.rw-opener__tabs .rw-opener__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rw-opener__tabs button[aria-current="true"] { color: #fff; }
.rw-opener__tabs button[aria-current="true"] .rw-opener__thumb { opacity: 1; transform: translateY(-3px); outline: 2px solid #fff; outline-offset: 2px; }
.rw-opener__fill { position: relative; display: block; height: 3px; border-radius: 3px; background: rgb(255 255 255 / 25%); overflow: hidden; }
.rw-opener__fill i { position: absolute; inset: 0; background: #fff; transform: scaleX(0); transform-origin: var(--op-origin, right); }
.rw-opener.is-ltr { --op-origin: left; }
.rw-opener__tabs button[aria-current="true"] .rw-opener__fill i { animation: var(--op-run, none) 7s linear forwards; }
.rw-opener.is-held .rw-opener__fill i { animation-play-state: paused; }
.rw-opener__tabs button[aria-current="true"] .rw-opener__fill.is-still i { animation: none; transform: scaleX(1); }
@keyframes rw-opener-fill-a { to { transform: scaleX(1); } }
@keyframes rw-opener-fill-b { to { transform: scaleX(1); } }
@container (max-width: 559px) { .rw-opener__tabs button { width: 3.4rem; } .rw-opener__tabs .rw-opener__thumb { display: none; } .rw-opener__tabs button > b { display: none; } }
.rw-opener__arrows { display: flex; align-items: center; gap: .45rem; }
.rw-opener__arrows button, .rw-opener__count, .rw-opener__sound { border: 1px solid rgb(255 255 255 / 35%); background: rgb(12 13 15 / 40%); color: #fff; backdrop-filter: blur(8px); }
.rw-opener__arrows button { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; padding: 0; border-radius: 50%; cursor: pointer; }
.rw-opener__arrows svg { width: 1.15rem; height: 1.15rem; display: block; }
.rw-opener__count { white-space: nowrap; min-width: 4.4rem; padding: .45rem .8rem; border-radius: 999px; font-variant-numeric: tabular-nums; font-weight: 700; text-align: center; }
.rw-opener__sound { min-height: 2.5rem; padding: 0 1rem; border-radius: 999px; font: inherit; font-size: .85rem; font-weight: 700; cursor: pointer; }
.rw-opener__tag { padding: .3rem .8rem; border-radius: 999px; background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); font-size: .78rem; font-weight: 700; }
.rw-opener :focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
@keyframes rw-opener-in { from { opacity: .35; } to { opacity: 1; } }
@keyframes rw-opener-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .rw-opener * { animation: none !important; } }
`;

type Slide = { image: string; mobile: string; alt: string; title: string; text: string; button: string; url: string; second: string; secondUrl: string; video: string };

const pick = (value: unknown, allowed: string[], fallback: string) => {
  const raw = String(unwrapValue(value) || fallback);
  return allowed.includes(raw) ? raw : fallback;
};

export default class OpenSlider extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private index = 0;
  @state() private sound = false;
  private waited = 0;
  private kinds: string[] = [];
  private failed = new Set<string>();
  private stop = () => {};
  private timer = 0;
  private count = 1;
  private paused = false;
  private reduced = false;
  private point = 0;
  private pointing = false;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-open-slider", css);
    this.stop = watchLocale(this);
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.arm();
    this.addEventListener("pointerenter", this.hold);
    this.addEventListener("pointerleave", this.release);
    this.addEventListener("focusin", this.hold);
    this.addEventListener("focusout", this.release);
  }

  disconnectedCallback() {
    window.clearInterval(this.timer);
    this.removeEventListener("pointerenter", this.hold);
    this.removeEventListener("pointerleave", this.release);
    this.removeEventListener("focusin", this.hold);
    this.removeEventListener("focusout", this.release);
    this.stop();
    super.disconnectedCallback();
  }

  private onKey(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const forward = isRtl() ? event.key === "ArrowLeft" : event.key === "ArrowRight";
    this.move(forward ? 1 : -1);
  }

  private hold = () => { if (!this.paused) { this.paused = true; this.requestUpdate(); } };
  private release = () => { if (this.paused) { this.paused = false; this.requestUpdate(); } };

  private arm() {
    window.clearInterval(this.timer);
    this.timer = 0;
    if (this.reduced) return;
    this.timer = window.setInterval(() => {
      if (this.paused) return;
      const kind = this.kinds[this.index];
      if (kind === "file") return; // a video file moves on when it ends
      if (kind === "frame" && ++this.waited < 3) return; // embeds get three ticks
      this.waited = 0;
      this.step(1);
    }, 7000);
  }

  private step(dir: number) {
    if (this.count < 2) return;
    this.index = (this.index + dir + this.count) % this.count;
  }

  private choose(index: number) {
    this.index = index;
    this.waited = 0;
    this.arm();
  }

  private move(dir: number) {
    this.waited = 0;
    this.step(dir);
    this.arm();
  }

  private down = (event: PointerEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    this.point = event.clientX;
    this.pointing = true;
    this.hold();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  private up = (event: PointerEvent) => {
    if (!this.pointing) return;
    this.pointing = false;
    const delta = event.clientX - this.point;
    if (Math.abs(delta) > 48) this.move(isRtl() ? (delta > 0 ? 1 : -1) : (delta < 0 ? 1 : -1));
    this.release();
  };

  private picture(slide: Slide) {
    if (!slide.image) return media("", slide.alt || slide.title);
    const alt = slide.alt || slide.title;
    if (!slide.mobile) return html`<img src=${slide.image} alt=${alt} />`;
    return html`<picture><source media="(max-width: 699px)" srcset=${slide.mobile} /><img src=${slide.image} alt=${alt} /></picture>`;
  }

  private moving(slide: Slide, total: number) {
    if (isFileClip(slide.video)) {
      return html`<video src=${slide.video} poster=${slide.image || nothing} .muted=${!this.sound} autoplay playsinline preload="metadata"
          ?loop=${total < 2 || this.reduced} aria-label=${slide.alt || slide.title}
          @ended=${() => this.move(1)} @error=${() => { this.failed.add(slide.video); this.requestUpdate(); }}></video>`;
    }
    return html`<iframe src=${frameSrc(slide.video, true, true)} title=${slide.alt || slide.title} allow="autoplay; encrypted-media; picture-in-picture" loading="lazy"></iframe>`;
  }

  render() {
    const cfg = getConfig(this.config);
    const slides: Slide[] = getCollectionItems<Record<string, any>>(cfg.items, "items")
      .map((item) => ({
        image: String(item.image || "").trim(),
        mobile: String(item.image_mobile || "").trim(),
        alt: localizedString(item.alt),
        title: localizedString(item.title),
        text: localizedString(item.text),
        button: localizedString(item.button),
        url: String(item.url || "").trim(),
        second: localizedString(item.second_button),
        secondUrl: String(item.second_url || "").trim(),
        video: clipUrl(item.video),
      }))
      .filter((item) => item.title);
    this.count = slides.length;
    this.kinds = slides.map((item) => (item.video && !this.failed.has(item.video) ? (isFileClip(item.video) ? "file" : "frame") : "image"));
    if (this.index >= slides.length) this.index = 0;
    const slide = slides[this.index];
    const label = localizedString(cfg.title) || t({ ar: "سلايدر", en: "Slider" });
    if (!slide) return html`<section class="rw-block ${schemeOf(cfg)}" style=${sectionStyle(cfg)}><div class="rw-section"><div class="rw-container">${emptyCopy()}</div></div></section>`;
    const rtl = isRtl();
    const framed = pick(cfg.fit, ["framed", "cover"], "cover") === "framed";
    const height = pick(cfg.height, ["screen", "tall", "medium"], "screen");
    const shade = pick(cfg.shade, ["soft", "medium", "strong"], "medium");
    const focus = pick(cfg.focus, ["top", "center", "bottom"], "center");
    const kind = this.kinds[this.index];
    const playing = kind === "file" || kind === "frame";
    const pointLeft = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    const pointRight = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    const classes = ["rw-opener", framed ? "is-framed" : "", `is-${height}`, `is-${shade}`, rtl ? "" : "is-ltr", this.paused ? "is-held" : ""].filter(Boolean).join(" ");
    const color = String(cfg.bg_color || "").trim();
    const bg = playing && !framed ? this.moving(slide, slides.length) : this.picture(slide);
    const card = playing ? this.moving(slide, slides.length) : this.picture(slide);
    // Two identical keyframes take turns so the fill restarts on every slide change.
    const run = this.reduced || playing ? "none" : this.index % 2 ? "rw-opener-fill-b" : "rw-opener-fill-a";
    return html`<section class="rw-block ${schemeOf(cfg)}" aria-roledescription="carousel" aria-label=${label} @keydown=${(event: KeyboardEvent) => this.onKey(event)}>
      <div class=${classes} style=${`--op-focus:center ${focus};--op-run:${run};${color ? `background:${color};` : ""}`} @pointerdown=${this.down} @pointerup=${this.up} @pointercancel=${this.up}>
        <div class="rw-opener__bg" aria-hidden=${framed ? "true" : "false"}>${bg}</div>
        <div class="rw-opener__shade"></div>
        <div class="rw-opener__top">
          ${slide.video ? html`<span class="rw-opener__tag">${t({ ar: "فيديو", en: "Video" })}</span>` : nothing}
          ${kind === "file" ? html`<button type="button" class="rw-opener__sound" @click=${() => { this.sound = !this.sound; this.hold(); }}>${this.sound ? t({ ar: "كتم الصوت", en: "Mute" }) : t({ ar: "تشغيل الصوت", en: "Sound on" })}</button>` : nothing}
        </div>
        <div class="rw-opener__body">
          <div class="rw-opener__copy" aria-live="polite">
            <h2>${slide.title}</h2>
            ${slide.text ? html`<p>${slide.text}</p>` : nothing}
            <div class="rw-actions">${renderCta(slide.button, slide.url)}${slide.second && slide.secondUrl ? html`<a class="rw-btn rw-btn--ghost" href=${slide.secondUrl}>${slide.second}</a>` : nothing}</div>
          </div>
          ${framed ? html`<div class="rw-opener__card">${card}</div>` : nothing}
        </div>
        ${slides.length > 1 ? html`<div class="rw-opener__foot">
          <div class="rw-opener__arrows">
            <button type="button" aria-label=${t({ ar: "الشريحة السابقة", en: "Previous slide" })} @click=${() => this.move(-1)}>${rtl ? pointRight : pointLeft}</button>
            <span class="rw-opener__count" dir="ltr">${`${String(this.index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`}</span>
            <button type="button" aria-label=${t({ ar: "الشريحة التالية", en: "Next slide" })} @click=${() => this.move(1)}>${rtl ? pointLeft : pointRight}</button>
          </div>
          <div class="rw-opener__tabs">${slides.map((item, index) => html`<button type="button" aria-current=${index === this.index ? "true" : "false"} aria-label=${item.title} @click=${() => this.choose(index)}>
            <span class="rw-opener__thumb">${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : nothing}</span>
            <b>${String(index + 1).padStart(2, "0")}</b>
            <span class="rw-opener__fill ${index === this.index && (playing || this.reduced) ? "is-still" : ""}"><i></i></span>
          </button>`)}</div>
        </div>` : nothing}
      </div>
    </section>`;
  }
}
