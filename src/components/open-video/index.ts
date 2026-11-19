import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { media } from "../../utils/ui.js";

const css = `
.rw-film { display: grid; gap: 1.2rem; align-items: center; }
@container (min-width: 860px) { .rw-film { grid-template-columns: minmax(0, 1.35fr) minmax(16rem, .65fr); } }
.rw-film__stage { position: relative; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 1rem; background: #121417; }
.rw-film__stage img, .rw-film__stage video, .rw-film__stage iframe { width: 100%; height: 100%; object-fit: cover; border: 0; }
.rw-film__play { position: absolute; inset: 0; display: grid; place-items: center; border: 0; background: rgb(18 20 23 / 28%); color: #fff; cursor: pointer; }
.rw-film__play b { position: absolute; display: grid; place-items: center; width: 4rem; height: 4rem; border-radius: 999px; background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); font-size: 1.1rem; }
.rw-film__miss { position: absolute; inset-inline: 1rem; bottom: 1rem; margin: 0; padding: .55rem .8rem; border-radius: .7rem; background: rgb(18 20 23 / 78%); color: #fff; text-align: center; }
.rw-film__copy h2 { font-size: clamp(1.5rem, 3vw, 2.2rem); line-height: 1.25; }
.rw-film__copy p { margin-top: .7rem; color: var(--rw-muted); line-height: 1.8; }
`;

function embed(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (host.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }
  } catch {
    return url;
  }
  return url;
}

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

  render() {
    const cfg = getConfig(this.config);
    const title = localizedString(cfg.title);
    const text = localizedString(cfg.text);
    const poster = String(cfg.poster || "");
    const source = String(cfg.video_url || "");
    const file = /\.(mp4|webm)(\?|$)/i.test(source);
    const frame = embed(source);
    return html`<section class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "video"}>
      <div class="rw-container rw-film">
        <div class="rw-film__stage">
          ${this.playing && source
            ? file
              ? html`<video src=${source} poster=${poster} controls autoplay playsinline></video>`
              : html`<iframe src=${frame} title=${title || "video"} allow="autoplay; encrypted-media" allowfullscreen></iframe>`
            : html`<button type="button" class="rw-film__play" @click=${() => { if (source) this.playing = true; else this.missing = true; }}>
                ${media(poster, title)}
                <b aria-hidden="true">▶</b>
                ${this.missing ? html`<p class="rw-film__miss">${t({ ar: "أضف رابط الفيديو من إعدادات القسم.", en: "Add the video link in the section settings." })}</p>` : nothing}`}
        </div>
        <div class="rw-film__copy">
          ${title ? html`<h2>${title}</h2>` : nothing}
          ${text ? html`<p>${text}</p>` : nothing}
        </div>
      </div>
    </section>`;
  }
}
