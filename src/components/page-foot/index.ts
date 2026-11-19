import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { flag, getCollectionItems, getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { currentTone, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";

const css = `
.rw-foot.rw-section { padding-block: 1.6rem 1.15rem; }
.rw-foot { border-top: 1px solid var(--rw-border); }
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
.rw-foot__links a:focus-visible, .rw-foot__brand:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 3px; }
.rw-foot__base { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .35rem 1rem; margin-top: 1.05rem; padding-top: .85rem; border-top: 1px solid var(--rw-border); color: var(--rw-muted); font-size: .9rem; }
`;

type StoreMark = { logo: string; name: string; url: string };

export default class PageFoot extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private store: StoreMark = { logo: "", name: "", url: "" };
  @state() private dark = false;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-page-foot", css);
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

  render() {
    const cfg = getConfig(this.config);
    const name = this.store.name || t({ ar: "المتجر", en: "Store" });
    const logo = String(cfg.logo || this.store.logo || "");
    const darkLogo = String(cfg.logo_dark || "");
    const invert = this.dark || schemeOf(cfg) === "rw-dark";
    const note = localizedString(cfg.note);
    const legal = localizedString(cfg.legal);
    const links = getCollectionItems<Record<string, any>>(cfg.links, "links")
      .map((item) => ({ label: localizedString(item.label), url: String(item.url || "").trim() }))
      .filter((item) => item.label && item.url);
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
    return html`<footer class="rw-block rw-section rw-foot ${schemeOf(cfg)} ${invert ? "is-invert" : ""}" style=${sectionStyle(cfg)} aria-label=${t({ ar: "ذيل الصفحة", en: "Page footer" })}>
      <div class="rw-container">
        <div class="rw-foot__top">
          ${brand}
          ${note ? html`<p class="rw-foot__note">${note}</p>` : nothing}
        </div>
        ${links.length ? html`<nav class="rw-foot__links" aria-label=${t({ ar: "روابط", en: "Links" })}>
          ${links.map((item) => html`<a href=${item.url}>${item.label}</a>`)}
        </nav>` : nothing}
        <div class="rw-foot__base">
          <span>© ${year} ${name}</span>
          ${legal ? html`<span>${legal}</span>` : nothing}
        </div>
      </div>
    </footer>`;
  }
}
