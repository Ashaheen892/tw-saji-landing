import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { flag, getCollectionItems, getConfig, linkHref, localizedString, t, watchLocale } from "../../utils/config.js";
import { announceBar, announceCss } from "../../utils/announce.js";
import { clearDocks, scrollPageTop, syncDocks, type DockNodes } from "../../utils/dock.js";
import { currentTone, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";

const css = `
.rw-foot.rw-section { padding-block: 1.6rem 1.15rem; }
.rw-foot { border-top: 1px solid var(--rw-border); background: var(--rw-surface-2); }
.rw-foot__top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem 2rem; }
.rw-foot__brand { display: inline-flex; align-items: center; color: inherit; text-decoration: none; }
.rw-foot__logo { display: block; height: 2.25rem; width: auto; max-width: 42vw; object-fit: contain; }
.rw-foot__logo--dark { display: none; }
.rw-foot.is-invert .rw-foot__logo--light.has-alt { display: none; }
.rw-foot.is-invert .rw-foot__logo--dark { display: block; }
.rw-foot__name { font-size: 1.05rem; font-weight: 800; }
.rw-foot__note { max-width: 34rem; color: var(--rw-muted); line-height: 1.7; }
.rw-foot__links { display: flex; flex-wrap: wrap; gap: .45rem 1.15rem; margin-top: 1.05rem; }
.rw-foot__links a { color: inherit; font-weight: 700; text-decoration: none; }
.rw-foot__links a:hover { text-decoration: underline; text-underline-offset: .16rem; }
.rw-foot__links a:focus-visible, .rw-foot__brand:focus-visible, .rw-foot__badges a:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 3px; }
.rw-foot__badges { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.05rem; align-items: center; }
.rw-foot__badges a { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 3.2rem; padding: .4rem .7rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: #fff; color: #16324f; font-weight: 800; font-size: .84rem; text-decoration: none; }
.rw-foot__badges img { display: block; height: 2.4rem; width: auto; max-width: 9.5rem; object-fit: contain; }
.rw-foot__base { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .35rem 1rem; margin-top: 1.05rem; padding-top: .85rem; border-top: 1px solid var(--rw-border); color: var(--rw-muted); font-size: .9rem; }
.rw-dock { position: fixed; z-index: 80; display: inline-grid; place-items: center; width: 3.45rem; height: 3.45rem; padding: 0; border: 0; border-radius: 999px; font-family: var(--font-main, inherit); cursor: pointer; text-decoration: none; box-shadow: 0 14px 30px rgb(0 0 0 / 18%); }
.rw-dock[hidden] { display: none; }
.rw-dock svg { width: 1.45rem; height: 1.45rem; display: block; }
.rw-dock--wa { background: #128C7E; color: #fff; }
.rw-dock--top { background: #1a1d21; color: #fff; }
`;

type StoreMark = { logo: string; name: string; url: string };

export default class PageFoot extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private store: StoreMark = { logo: "", name: "", url: "" };
  @state() private dark = false;
  private stop = () => {};
  private docks: DockNodes = { wa: null, top: null };

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-announce", announceCss("rw"));
    injectStyles("rw-page-footer", css);
    const onTone = () => {
      this.dark = currentTone() === "dark";
    };
    onTone();
    window.addEventListener("rw-tone", onTone);
    const stopLocale = watchLocale(this);
    this.stop = () => {
      window.removeEventListener("rw-tone", onTone);
      stopLocale();
    };
    this.readStore();
    const api = (window as any).Salla;
    api?.onReady?.().then(() => this.readStore());
  }

  private readStore() {
    const api = (window as any).Salla;
    try {
      this.store = {
        logo: api?.config?.get("store.logo") || "",
        name: api?.config?.get("store.name") || "",
        url: api?.config?.get("store.url") || "",
      };
    } catch {
      /* store config is not ready yet */
    }
  }

  disconnectedCallback() {
    this.stop();
    clearDocks(this.docks);
    super.disconnectedCallback();
  }

  protected updated() {
    this.docks = syncDocks(getConfig(this.config), "rw", this.docks, (event) => scrollPageTop(event, this));
  }

  render() {
    const cfg = getConfig(this.config);
    const name = this.store.name || t({ ar: "المتجر", en: "Store" });
    const logo = String(cfg.logo || this.store.logo || "");
    const darkLogo = String(cfg.logo_dark || "");
    const invert = this.dark || schemeOf(cfg) === "rw-dark";
    const note = localizedString(cfg.note);
    const legal = localizedString(cfg.legal);
    const storeUrl = String(this.store.url || "").trim();
    const links = getCollectionItems<Record<string, any>>(cfg.links, "links")
      .map((item) => {
        const own = linkHref(item.url);
        return { label: localizedString(item.label), url: own && own !== "#" ? own : storeUrl };
      })
      .filter((item) => item.label && item.url);
    const badges = getCollectionItems<Record<string, any>>(cfg.badges, "badges")
      .map((item) => ({ image: String(item.image || "").trim(), alt: localizedString(item.alt), url: linkHref(item.url) }))
      .filter((item) => (item.image || item.alt) && item.url && item.url !== "#");
    if (flag(cfg.show_store) && this.store.url) {
      links.unshift({ label: localizedString(cfg.store_label) || t({ ar: "المتجر", en: "Store" }), url: this.store.url });
    }
    const mark = logo
      ? html`<img class="rw-foot__logo rw-foot__logo--light${darkLogo ? " has-alt" : ""}" src=${logo} alt=${name} />
          ${darkLogo ? html`<img class="rw-foot__logo rw-foot__logo--dark" src=${darkLogo} alt="" />` : nothing}`
      : html`<span class="rw-foot__name">${name}</span>`;
    const brand = this.store.url
      ? html`<a class="rw-foot__brand" href=${this.store.url}>${mark}</a>`
      : html`<span class="rw-foot__brand">${mark}</span>`;
    const year = new Date().getFullYear();
    return html`${announceBar(cfg, "rw", "rw-block")}
    <footer class="rw-block rw-section rw-foot ${schemeOf(cfg)} ${invert ? "is-invert" : ""}" style=${sectionStyle(cfg)} aria-label=${t({ ar: "ذيل الصفحة", en: "Page footer" })}>
      <div class="rw-container">
        <div class="rw-foot__top">
          ${brand}
          ${note ? html`<p class="rw-foot__note">${note}</p>` : nothing}
        </div>
        ${links.length ? html`<nav class="rw-foot__links" aria-label=${t({ ar: "روابط", en: "Links" })}>
          ${links.map((item) => html`<a href=${item.url}>${item.label}</a>`)}
        </nav>` : nothing}
        ${badges.length ? html`<div class="rw-foot__badges">
          ${badges.map((item) => html`<a href=${item.url} target="_blank" rel="noopener noreferrer">
            ${item.image ? html`<img src=${item.image} alt=${item.alt || ""} />` : nothing}
            ${item.alt ? html`<span>${item.alt}</span>` : nothing}
          </a>`)}
        </div>` : nothing}
        <div class="rw-foot__base">
          <span>© ${year} ${name}</span>
          ${legal ? html`<span>${legal}</span>` : nothing}
        </div>
      </div>
    </footer>`;
  }
}
