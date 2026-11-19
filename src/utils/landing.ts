import { html, nothing } from "lit";
import { flag, localizedString, t, unwrapValue } from "./config.js";

type SallaGlobal = {
  config?: { get: (key: string, fallback?: unknown) => any };
};

function salla(): SallaGlobal | undefined {
  return (window as any).Salla;
}

export function landingSettings(): Record<string, any> {
  return salla()?.config?.get("theme.settings") || {};
}

export function isLandingPage(): boolean {
  return salla()?.config?.get("page.is_landing_page") === true;
}

export function pageMode(): "product" | "promotion" {
  const value = landingSettings().page_for_product;
  if (typeof value === "boolean" || value == null) return value === false ? "promotion" : "product";
  if (typeof value === "string") return value === "promotion" ? "promotion" : "product";
  return Array.isArray(value) && value[0]?.value === "promotion" ? "promotion" : "product";
}

export function landingProductId(): string | null {
  if (!isLandingPage() || pageMode() !== "product") return null;
  const id = landingSettings().product?.value?.[0];
  return id ? String(id) : null;
}

export function mainButton(): { text: string; url: string } {
  const settings = landingSettings();
  return { text: String(settings.main_btn_text || ""), url: String(settings.main_btn_url || "") };
}

/** Product pages buy through the page checkout. Promotion pages follow the page link. */
export function openCheckout(): void {
  const checkout = document.querySelector(".s-block--fast-checkout");
  const layout = checkout?.getAttribute("data-layout");
  if (window.innerWidth < 1024 || layout === "side-drawer" || !checkout) {
    window.dispatchEvent(new CustomEvent("open-checkout-drawer"));
    return;
  }
  checkout.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function renderCta(labelValue: unknown, fallbackUrl = "", ghost = false) {
  const label = localizedString(labelValue).trim();
  if (!label) return nothing;
  const cls = ghost ? "rw-btn rw-btn--ghost" : "rw-btn";
  const productPage = Boolean(landingProductId());
  const demo = !isLandingPage();
  if (productPage || (demo && !fallbackUrl)) {
    return html`<button type="button" class=${cls} @click=${() => openCheckout()}>${label}</button>`;
  }
  const href = (isLandingPage() && pageMode() === "promotion" ? mainButton().url : "") || fallbackUrl;
  if (!href) return html`<button type="button" class=${cls} @click=${() => openCheckout()}>${label}</button>`;
  return html`<a class=${cls} href=${href}>${label}</a>`;
}

let toneReady = false;

export function applyTone(mode: "light" | "dark"): void {
  document.documentElement.classList.remove("rw-mode-light", "rw-mode-dark");
  document.documentElement.classList.add(mode === "dark" ? "rw-mode-dark" : "rw-mode-light");
  try {
    localStorage.setItem("rw-landing-tone", mode);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent("rw-tone"));
}

export function rememberTone(): void {
  if (toneReady) return;
  toneReady = true;
  try {
    const saved = localStorage.getItem("rw-landing-tone");
    if (saved === "dark" || saved === "light") applyTone(saved);
  } catch {
    /* ignore */
  }
}

export function currentTone(): "light" | "dark" {
  return document.documentElement.classList.contains("rw-mode-dark") ? "dark" : "light";
}

export function renderTone(enabled: unknown, dark: boolean, onToggle: () => void) {
  if (!flag(enabled)) return nothing;
  const next = dark ? t({ ar: "الوضع الفاتح", en: "Light mode" }) : t({ ar: "الوضع الداكن", en: "Dark mode" });
  return html`<button type="button" class="rw-tone" aria-pressed=${dark ? "true" : "false"} @click=${onToggle}>${next}</button>`;
}

export function schemeOf(cfg: Record<string, any>): string {
  const scheme = String(unwrapValue(cfg.color_scheme) || "auto");
  return scheme === "dark" ? "rw-dark" : scheme === "light" ? "rw-light" : "rw-auto";
}
