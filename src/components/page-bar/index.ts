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
.rw-bar__tone { display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem; padding: 0; border: 1px solid var(--rw-border); border-radius: .7rem; background: transparent; color: inherit; cursor: pointer; }
.rw-bar__tone svg { width: 1.15rem; height: 1.15rem; display: block; }
.rw-bar--center .rw-bar__tone { position: absolute; inset-inline-end: 1rem; top: 50%; margin-top: -1.25rem; }
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
  private pinned: HTMLElement | null = null;
  private opened: HTMLElement[] = [];
  private held: HTMLElement | null = null;
  private heldSticky = false;
  private heldClear = false;

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

  /** The box that sits among the other sections, not the inner card that is only as tall as the bar. */
  private outerBox(): HTMLElement {
    let node: HTMLElement = this;
    while (node.parentElement && node.parentElement !== document.body && node.parentElement !== document.documentElement) {
      const parent = node.parentElement;
      const sections = [...parent.children].filter((el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE");
      if (sections.length > 1) return node;
      node = parent;
    }
    return node;
  }

  /** A click inside the sticky bar focuses a control whose document position is the top of the page. */
  private place(run: () => void) {
    const doc = this.ownerDocument;
    const view = doc.defaultView;
    if (!view) {
      run();
      return;
    }
    const nodes = new Set<Element>();
    if (doc.scrollingElement) nodes.add(doc.scrollingElement);
    nodes.add(doc.documentElement);
    nodes.add(doc.body);
    let node: HTMLElement | null = this;
    while (node) {
      nodes.add(node);
      node = node.parentElement;
    }
    const marks = [...nodes].map((el) => [el, el.scrollTop] as const);
    const x = view.scrollX;
    const y = view.scrollY;
    const put = () => {
      for (const [el, top] of marks) if (el.scrollTop !== top) el.scrollTop = top;
      if (Math.abs(view.scrollY - y) > 1 || Math.abs(view.scrollX - x) > 1) view.scrollTo(x, y);
    };
    run();
    put();
    view.requestAnimationFrame(() => {
      put();
      view.requestAnimationFrame(put);
    });
  }

  private pin() {
    const cfg = getConfig(this.config);
    const sticky = flag(cfg.sticky);
    const clear = flag(cfg.transparent);
    const outer = this.outerBox();
    if (clear && this.pinned === outer) outer.style.marginBottom = `-${this.offsetHeight}px`;
    if (this.held === outer && this.heldSticky === sticky && this.heldClear === clear) return;
    if (this.pinned && this.pinned !== outer) this.release();
    this.held = outer;
    this.heldSticky = sticky;
    this.heldClear = clear;
    this.pinned = outer;
    outer.style.position = sticky ? "sticky" : clear ? "relative" : "";
    outer.style.top = sticky ? "0" : "";
    outer.style.zIndex = sticky || clear ? "40" : "";
    outer.style.marginBottom = clear ? `-${this.offsetHeight}px` : "";
    this.opened.forEach((el) => { el.style.overflow = ""; });
    this.opened = [];
    if (!sticky) return;
    let node = outer.parentElement;
    while (node && node !== document.body && node !== document.documentElement) {
      const flow = getComputedStyle(node);
      if (flow.overflowY === "auto" || flow.overflowY === "scroll") break;
      if (flow.overflowY === "hidden" || flow.overflowX === "hidden") {
        node.style.overflow = "clip";
        this.opened.push(node);
      }
      node = node.parentElement;
    }
  }

  private release() {
    if (this.pinned) {
      this.pinned.style.position = this.pinned.style.top = this.pinned.style.zIndex = this.pinned.style.marginBottom = "";
      this.pinned = null;
    }
    this.opened.forEach((el) => { el.style.overflow = ""; });
    this.opened = [];
    this.held = null;
    this.heldSticky = false;
    this.heldClear = false;
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
          ? html`<button type="button" class="rw-bar__tone" aria-pressed=${this.dark ? "true" : "false"} aria-label=${this.dark ? t({ ar: "التبديل إلى الوضع الفاتح", en: "Switch to light mode" }) : t({ ar: "التبديل إلى الوضع الداكن", en: "Switch to dark mode" })} @mousedown=${(event: Event) => event.preventDefault()} @click=${() => this.place(() => applyTone(this.dark ? "light" : "dark"))}>
              ${this.dark
                ? html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" /><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" /></g></svg>`
                : html`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.5 2.4a9 9 0 1 0 7.1 13.6A8 8 0 0 1 14.5 2.4z" /></svg>`}
            </button>`
          : nothing}
      </div>
    </header>`;
  }
}
