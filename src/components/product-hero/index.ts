import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { getCollectionItems, getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { fetchProduct, landingProductId, money, pickedId, renderCta, schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { media } from "../../utils/ui.js";

const css = `
.rw-stage { display: grid; gap: 1.4rem; align-items: center; }
@container (min-width: 900px) { .rw-stage { grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr); align-items: start; } }
.rw-stage__photo { aspect-ratio: 1; overflow: hidden; border-radius: 1.1rem; background: var(--rw-soft); }
.rw-stage__photo img, .rw-stage__photo .rw-ph { width: 100%; height: 100%; object-fit: cover; }
.rw-stage__views { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .7rem; }
.rw-stage__views button { min-height: 2.5rem; padding: .3rem .75rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: var(--rw-card); color: var(--rw-text); cursor: pointer; }
.rw-stage__thumb { width: 4.4rem; height: 4.4rem; padding: 0; overflow: hidden; }
.rw-stage__thumb img { width: 100%; height: 100%; object-fit: cover; }
.rw-stage__views button[aria-pressed="true"] { border-color: var(--color-primary, #1a1d21); outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 1px; }
.rw-stage__views button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-stage__copy h2 { font-size: clamp(1.7rem, 3vw, 2.6rem); line-height: 1.2; }
.rw-stage__copy p { margin-top: .7rem; max-width: 36rem; color: var(--rw-muted); line-height: 1.8; }
.rw-stage__price { display: flex; align-items: baseline; gap: .65rem; margin-top: 1.1rem; font-size: 1.7rem; font-weight: 700; }
.rw-stage__price s { color: var(--rw-muted); font-size: 1rem; font-weight: 500; }
.rw-stage__stock { margin-top: .4rem; color: var(--rw-muted); }
`;

type View = { image: string; alt: string; label: string };

function liveViews(product: Record<string, any> | null): View[] {
  if (!product) return [];
  const list = Array.isArray(product.images) ? product.images : [];
  const views: View[] = list
    .map((image: any, index: number) => ({
      image: String(image?.url || image?.image?.url || ""),
      alt: String(image?.alt || product.name || ""),
      label: String(index + 1),
    }))
    .filter((item: View) => item.image);
  const single = product.image?.url || product.thumbnail;
  if (!views.length && single) views.push({ image: String(single), alt: String(product.name || ""), label: "1" });
  return views;
}

export default class ProductHero extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  @state() private index = 0;
  @state() private product: Record<string, any> | null = null;
  private stop = () => {};
  private requested = "";

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-product-hero", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  protected updated() {
    const id = landingProductId() || pickedId(getConfig(this.config).product);
    if (!id || id === this.requested) return;
    this.requested = id;
    this.index = 0;
    fetchProduct(id).then((product) => {
      if (this.requested === id) this.product = product;
    });
  }

  render() {
    const cfg = getConfig(this.config);
    const merchant: View[] = getCollectionItems<Record<string, any>>(cfg.views, "views")
      .map((item) => ({ image: String(item.image || ""), alt: localizedString(item.alt), label: localizedString(item.label) }))
      .filter((item) => item.label || item.image);
    const live = liveViews(this.product);
    const views = live.length ? live : merchant;
    const current = views[Math.min(this.index, Math.max(views.length - 1, 0))];
    const title = this.product?.name || localizedString(cfg.title);
    const text = localizedString(cfg.text);
    const sale = this.product ? Number(this.product.sale_price ?? this.product.price ?? 0) : 0;
    const regular = this.product ? Number(this.product.regular_price ?? this.product.price ?? 0) : 0;
    const price = this.product ? (sale ? money(sale) : "") : localizedString(cfg.price_text);
    const was = this.product
      ? (sale && regular > sale ? money(regular) : "")
      : localizedString(cfg.compare_text);
    const stock = this.product
      ? (this.product.is_available === false || this.product.quantity === 0
        ? t({ ar: "نفدت الكمية", en: "Out of stock" })
        : t({ ar: "متوفر للطلب", en: "Available to order" }))
      : "";
    const buyUrl = String(cfg.button_url || this.product?.url || "");
    return html`<section id="rw-product" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${title || "product"}>
      <div class="rw-container rw-stage">
        <div>
          <div class="rw-stage__photo">${media(current?.image || "", current?.alt || title)}</div>
          ${views.length > 1
            ? html`<div class="rw-stage__views">${views.map((view, index) => html`<button type="button" class=${view.image ? "rw-stage__thumb" : ""} aria-pressed=${index === this.index ? "true" : "false"} aria-label=${view.label || view.alt || String(index + 1)} @click=${() => { this.index = index; }}>
                ${view.image ? html`<img src=${view.image} alt="" />` : view.label || index + 1}
              </button>`)}</div>`
            : nothing}
        </div>
        <div class="rw-stage__copy">
          ${title ? html`<h2>${title}</h2>` : nothing}
          ${text ? html`<p>${text}</p>` : nothing}
          ${price ? html`<div class="rw-stage__price"><span>${price}</span>${was ? html`<s>${was}</s>` : nothing}</div>` : nothing}
          ${stock ? html`<p class="rw-stage__stock">${stock}</p>` : nothing}
          <div class="rw-actions">${renderCta(cfg.button_label, buyUrl)}</div>
        </div>
      </div>
    </section>`;
  }
}
