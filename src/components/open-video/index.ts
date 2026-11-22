import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getConfig, localizedString, t, unwrapValue, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { media } from "../../utils/ui.js";
import { clipUrl, frameSrc, isFileClip, settleSilence } from "../../utils/video.js";

const css = `
.rw-film { display: grid; gap: 1.2rem; align-items: center; }
@container (min-width: 860px) { .rw-film--beside { grid-template-columns: minmax(0, 1.35fr) minmax(16rem, .65fr); } }
.rw-film--stack { grid-template-columns: 1fr; }
.rw-film--stack .rw-film__copy { order: -1; max-width: 40rem; }
.rw-film__stage { position: relative; width: 100%; overflow: hidden; border-radius: 1rem; background: #121417; }
.rw-film--wide .rw-film__stage { aspect-ratio: 16 / 9; }
.rw-film--story .rw-film__stage { aspect-ratio: 9 / 16; max-width: 24rem; justify-self: center; }
.rw-film--square .rw-film__stage { aspect-ratio: 1; max-width: 36rem; justify-self: center; }
.rw-film--portrait .rw-film__stage { aspect-ratio: 4 / 5; max-width: 32rem; justify-self: center; }
.rw-film__stage img, .rw-film__stage video, .rw-film__stage iframe { width: 100%; height: 100%; object-fit: cover; border: 0; }
.rw-film--contain .rw-film__stage img,
.rw-film--contain .rw-film__stage video,
.rw-film--contain .rw-film__stage iframe { object-fit: contain; }
.rw-film__play { position: absolute; inset: 0; display: grid; place-items: center; border: 0; background: rgb(18 20 23 / 28%); color: #fff; cursor: pointer; }
.rw-film__play b { position: absolute; display: grid; place-items: center; width: 4rem; height: 4rem; border-radius: 999px; background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); font-size: 1.1rem; }
.rw-film__miss { position: absolute; inset-inline: 1rem; bottom: 1rem; margin: 0; padding: .55rem .8rem; border-radius: .7rem; background: rgb(18 20 23 / 78%); color: #fff; text-align: center; }
.rw-film__copy h2 { font-size: clamp(1.5rem, 3vw, 2.2rem); line-height: 1.25; }
.rw-film__copy p { margin-top: .7rem; color: var(--rw-muted); line-height: 1.8; }
.rw-film--cover { display: block; position: relative; }
.rw-film--cover .rw-film__stage { max-width: none; min-height: 22rem; }
.rw-film--cover .rw-film__copy { position: absolute; z-index: 1; inset-inline-start: 1.4rem; bottom: 1.4rem; max-width: min(36rem, calc(100% - 2.8rem)); color: #fff; }
.rw-film--cover .rw-film__copy p { color: rgb(255 255 255 / 84%); }
`;

export default class OpenVideo extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private playing = false;
  @state() private missing = false;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-open-video", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  protected updated() {
    const auto = String(unwrapValue(getConfig(this.config).playback) || "click") === "auto";
    if (auto) settleSilence(this);
  }

  render() {
    const cfg = getConfig(this.config);
    const title = localizedString(cfg.title);
    const text = localizedString(cfg.text);
    const poster = String(cfg.poster || "");
    const source = clipUrl(cfg.video_url);
    const layout = String(unwrapValue(cfg.layout) || "beside");
    const frame = String(unwrapValue(cfg.frame) || "wide");
    const fit = String(unwrapValue(cfg.fit) || "cover");
    const auto = String(unwrapValue(cfg.playback) || "click") === "auto";
    const file = isFileClip(source);
    const classes = ["rw-container", "rw-film", `rw-film--${layout}`, `rw-film--${frame}`, fit === "contain" ? "rw-film--contain" : ""].filter(Boolean).join(" ");
    const showPlayer = Boolean(source) && (auto || this.playing);
    const player = file
      ? html`<video src=${source} poster=${poster || nothing} controls playsinline .muted=${auto} ?loop=${auto}></video>`
      : html`<iframe src=${frameSrc(source, auto)} title=${title || "video"} allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen @load=${() => { if (auto) settleSilence(this); }}></iframe>`;
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "video"}>
      <div class=${classes}>
        <div class="rw-film__stage">
          ${showPlayer
            ? player
            : html`<button type="button" class="rw-film__play" @click=${() => { if (source) this.playing = true; else this.missing = true; }}>
                ${media(poster, title)}
                <b aria-hidden="true">▶</b>
                ${this.missing || (auto && !source) ? html`<p class="rw-film__miss rw-hint">${t({ ar: "أضف رابط الفيديو من إعدادات القسم.", en: "Add the video link in the section settings." })}</p>` : nothing}
              </button>`}
        </div>
        <div class="rw-film__copy">
          ${title ? html`<h2>${title}</h2>` : nothing}
          ${text ? html`<p>${text}</p>` : nothing}
        </div>
      </div>
    </section>`;
  }
}
