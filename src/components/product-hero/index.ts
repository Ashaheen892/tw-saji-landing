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
.rw-stage__views button { display: flex; flex-direction: column; align-items: center; gap: .25rem; min-height: 2.5rem; padding: .3rem .75rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: var(--rw-card); color: var(--rw-text); cursor: pointer; }
.rw-stage__thumb { padding: .25rem; overflow: hidden; }
.rw-stage__thumb img { width: 4.4rem; height: 4.4rem; object-fit: cover; border-radius: .45rem; }
.rw-stage__cap { font-size: .75rem; line-height: 1.2; }
.rw-stage__options { margin-top: 1rem; }
.rw-stage__options .s-product-options-option { margin-top: .85rem; }
.rw-stage__options .s-product-options-colors-wrapper,
.rw-stage__options .s-product-options-thumbnails-wrapper { display: flex; flex-wrap: wrap; gap: .55rem; margin: .35rem 0 0; padding: 0; border: 0; }
.rw-stage__options .s-product-options-colors-item input,
.rw-stage__options .s-product-options-thumbnails-wrapper input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.rw-stage__options .s-product-options-colors-item label { display: flex; flex-direction: column; align-items: center; gap: .25rem; cursor: pointer; font-size: .75rem; }
.rw-stage__options .s-product-options-colors-item span { width: 1.7rem; height: 1.7rem; border-radius: 999px; display: block; border: 1px solid var(--rw-border); }
.rw-stage__options .s-product-options-colors-item input:checked + label span,
.rw-stage__options .s-product-options-thumbnails-wrapper input:checked + label img,
.rw-stage__options .s-product-options-colors-item input:focus-visible + label span,
.rw-stage__options .s-product-options-thumbnails-wrapper input:focus-visible + label img { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-stage__options .s-product-options-thumbnails-wrapper > div { font-size: .75rem; text-align: center; }
.rw-stage__options .s-product-options-thumbnails-wrapper p { margin: .25rem 0 0; }
.rw-stage__options .s-product-options-thumbnails-wrapper label { position: relative; display: inline-block; cursor: pointer; }
.rw-stage__options .s-product-options-thumbnails-icon { display: none; position: absolute; inset-inline-end: .2rem; top: .2rem; width: 1.1rem; height: 1.1rem; border-radius: 999px; background: var(--color-primary, #1a1d21); color: #fff; align-items: center; justify-content: center; }
.rw-stage__options .s-product-options-thumbnails-icon svg { width: .7rem; height: .7rem; fill: currentColor; }
.rw-stage__options .s-product-options-thumbnails-wrapper input:checked + label .s-product-options-thumbnails-icon { display: flex; }
.rw-block .rw-stage__options img { width: 4.2rem; height: 4.2rem; max-width: 4.2rem; object-fit: cover; border-radius: .55rem; }
.rw-stage__options select { width: 100%; max-width: 18rem; min-height: 2.6rem; margin-top: .35rem; padding: 0 .7rem; border: 1px solid var(--rw-border); border-radius: .7rem; background: var(--rw-card); color: var(--rw-text); }
.rw-stage__views button[aria-pressed="true"] { border-color: var(--color-primary, #1a1d21); outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 1px; }
.rw-stage__views button:focus-visible { outline: 2px solid var(--color-primary, #1a1d21); outline-offset: 2px; }
.rw-stage__copy h2 { font-size: clamp(1.7rem, 3vw, 2.6rem); line-height: 1.2; }
.rw-stage__copy p { margin-top: .7rem; max-width: 36rem; color: var(--rw-muted); line-height: 1.8; }
.rw-stage__price { display: flex; align-items: baseline; gap: .65rem; margin-top: 1.1rem; font-size: 1.7rem; font-weight: 700; }
.rw-stage__price s { color: var(--rw-muted); font-size: 1rem; font-weight: 500; }
.rw-stage__stock { margin-top: .4rem; color: var(--rw-muted); }
`;

type View = { image: string; alt: string; label: string };

function productPhotos(product: Record<string, any> | null): View[] {
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

/** Named angles stay. Empty ones take the next product photo, and leftover photos are added after them. */
function composeViews(product: Record<string, any> | null, merchant: View[]): View[] {
  const photos = productPhotos(product);
  if (!merchant.length) return photos;
  if (!photos.length) return merchant;
  let photoIndex = 0;
  const merged = merchant.map((view) => {
    if (view.image) return view;
    const photo = photos[photoIndex];
    if (!photo) return view;
    photoIndex += 1;
    return { ...view, image: photo.image, alt: view.alt || photo.alt };
  });
  photos.slice(photoIndex).forEach((photo) => merged.push(photo));
  return merged;
}

function caption(view: View): string {
  return view.label && !/^\d+$/.test(view.label) ? view.label : "";
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
    const views = composeViews(this.product, merchant);
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
            ? html`<div class="rw-stage__views">${views.map((view, index) => {
                const name = caption(view);
                return html`<button type="button" class=${view.image ? "rw-stage__thumb" : ""} aria-pressed=${index === this.index ? "true" : "false"} aria-label=${name || view.alt || String(index + 1)} @click=${() => { this.index = index; }}>
                ${view.image ? html`<img src=${view.image} alt="" />` : name || index + 1}
                ${view.image && name ? html`<span class="rw-stage__cap">${name}</span>` : nothing}
              </button>`;
              })}</div>`
            : nothing}
        </div>
        <div class="rw-stage__copy">
          ${title ? html`<h2>${title}</h2>` : nothing}
          ${text ? html`<p>${text}</p>` : nothing}
          ${price ? html`<div class="rw-stage__price"><span>${price}</span>${was ? html`<s>${was}</s>` : nothing}</div>` : nothing}
          ${stock ? html`<p class="rw-stage__stock">${stock}</p>` : nothing}
          ${this.product?.id ? html`<div class="rw-stage__options"><salla-product-options product-id=${String(this.product.id)}></salla-product-options></div>` : nothing}
          <div class="rw-actions">${renderCta(cfg.button_label, buyUrl)}</div>
        </div>
      </div>
    </section>`;
  }
}
