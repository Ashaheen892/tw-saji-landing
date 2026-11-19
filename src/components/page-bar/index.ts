import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { flag, getConfig, localizedString, t, unwrapValue, watchLocale } from "../../utils/config.js";
import { applyTone, currentTone, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";

const css = `
.rw-bar { position: relative; background: var(--rw-section-bg, var(--rw-surface)); color: var(--rw-text); }
.rw-bar__row { display: flex; align-items: center; gap: .85rem; width: min(1120px, calc(100% - 2rem)); min-height: calc(var(--rw-logo, 52px) + 1.35rem); margin-inline: auto; }
.rw-bar--center .rw-bar__row { justify-content: center; }
.rw-bar__brand { display: inline-flex; align-items: center; color: inherit; text-decoration: none; }
.rw-bar__logo { display: block; height: var(--rw-logo, 52px); width: auto; max-width: 46vw; object-fit: contain; }
.rw-bar__logo--dark { display: none; }
.rw-bar.is-invert .rw-bar__logo--light.has-alt { display: none; }
.rw-bar.is-invert .rw-bar__logo--dark { display: block; }
.rw-bar__name { font-size: 1.15rem; font-weight: 800; }
.rw-bar__link { color: inherit; font-weight: 700; text-decoration: none; }
.rw-bar__tone { min-height: 2.3rem; padding: .3rem .75rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: transparent; color: inherit; cursor: pointer; }
.rw-bar--center .rw-bar__tone { position: absolute; inset-inline-end: 1rem; top: 50%; margin-top: -1.15rem; }
.rw-bar--start .rw-bar__tone { margin-inline-start: auto; }
.rw-bar.is-line { box-shadow: inset 0 -1px 0 var(--rw-border); }
.rw-bar.is-clear { background: transparent; color: #f4f6f8; box-shadow: none; }
.rw-bar__tone:focus-visible, .rw-bar__link:focus-visible, .rw-bar__brand:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 3px; }
`;

type StoreMark = { logo: string; name: string; url: string };

export default class PageBar extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private dark = false;
  @state() private solid = false;
  @state() private store: StoreMark = { logo: "", name: "", url: "" };
  private stop = () => {};
  private modeKey = "";

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-page-bar", css);
    document.addEventListener("scroll", this.onScroll, { capture: true, passive: true });
    const onTone = () => {
      this.dark = currentTone() === "dark";
    };
    window.addEventListener("rw-tone", onTone);
    const stopLocale = watchLocale(this);
    this.stop = () => {
      document.removeEventListener("scroll", this.onScroll, { capture: true });
      window.removeEventListener("rw-tone", onTone);
      stopLocale();
      this.release();
    };
    const api = (window as any).Salla;
    api?.onReady?.().then(() => {
      this.store = {
        logo: api.config?.get("store.logo") || "",
        name: api.config?.get("store.name") || "",
        url: api.config?.get("store.url") || "",
      };
    });
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  protected willUpdate() {
    const cfg = getConfig(this.config);
    const key = `${unwrapValue(cfg.default_mode) || "light"}|${flag(cfg.show_mode_toggle)}`;
    if (key === this.modeKey) return;
    this.modeKey = key;
    applyTone(this.openingMode(cfg));
    this.dark = currentTone() === "dark";
  }

  protected updated() {
    this.pin();
    this.onScroll();
  }

  private openingMode(cfg: Record<string, any>): "light" | "dark" {
    const base = String(unwrapValue(cfg.default_mode) || "light");
    if (flag(cfg.show_mode_toggle)) {
      try {
        const saved = localStorage.getItem("rw-landing-tone");
        if (saved === "dark" || saved === "light") return saved;
      } catch {
        /* private mode */
      }
    }
    if (base === "system") return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return base === "dark" ? "dark" : "light";
  }

  private pin() {
    const cfg = getConfig(this.config);
    const sticky = flag(cfg.sticky);
    const clear = flag(cfg.transparent);
    const card = (this.closest(".component-card") as HTMLElement | null) || this;
    card.style.position = sticky ? "sticky" : "";
    card.style.top = sticky ? "0" : "";
    card.style.zIndex = sticky || clear ? "30" : "";
    card.style.marginBottom = clear ? `-${this.offsetHeight}px` : "";
  }

  private release() {
    const card = this.closest(".component-card") as HTMLElement | null;
    if (!card) return;
    card.style.position = card.style.top = card.style.zIndex = card.style.marginBottom = "";
  }

  private onScroll = () => {
    const cfg = getConfig(this.config);
    const solid = flag(cfg.sticky) && (window.scrollY || document.documentElement.scrollTop || 0) > 8;
    if (solid !== this.solid) this.solid = solid;
  };

  render() {
    const cfg = getConfig(this.config);
    const height = Math.min(Math.max(Number(cfg.logo_height) || 52, 28), 120);
    const start = String(unwrapValue(cfg.align) || "center") === "start";
    const clear = flag(cfg.transparent) && !this.solid;
    const invert = clear || this.dark || schemeOf(cfg) === "rw-dark";
    const logo = String(cfg.logo || this.store.logo || "");
    const darkLogo = String(cfg.logo_dark || "");
    const name = this.store.name || t({ ar: "المتجر", en: "Store" });
    const linkLabel = localizedString(cfg.link_label);
    const classes = [
      "rw-block rw-bar",
      schemeOf(cfg),
      start ? "rw-bar--start" : "rw-bar--center",
      clear ? "is-clear" : "",
      invert ? "is-invert" : "",
      flag(cfg.show_shadow) && !clear ? "is-line" : "",
    ].filter(Boolean).join(" ");
    const mark = logo
      ? html`<img class="rw-bar__logo rw-bar__logo--light${darkLogo ? " has-alt" : ""}" src=${logo} alt=${name} />
          ${darkLogo ? html`<img class="rw-bar__logo rw-bar__logo--dark" src=${darkLogo} alt="" />` : nothing}`
      : html`<span class="rw-bar__name">${name}</span>`;
    const brand = flag(cfg.link_to_store) && this.store.url
      ? html`<a class="rw-bar__brand" href=${this.store.url}>${mark}</a>`
      : html`<span class="rw-bar__brand">${mark}</span>`;
    return html`<header class=${classes} style=${`${sectionStyle(cfg)};--rw-logo:${height}px`}>
      <div class="rw-bar__row">
        ${brand}
        ${linkLabel && cfg.link_url ? html`<a class="rw-bar__link" href=${cfg.link_url}>${linkLabel}</a>` : nothing}
        ${flag(cfg.show_mode_toggle)
          ? html`<button type="button" class="rw-bar__tone" aria-pressed=${this.dark ? "true" : "false"} @click=${() => applyTone(this.dark ? "light" : "dark")}>
              ${this.dark ? t({ ar: "فاتح", en: "Light" }) : t({ ar: "داكن", en: "Dark" })}
            </button>`
          : nothing}
      </div>
    </header>`;
  }
}
