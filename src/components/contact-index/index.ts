import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-quickwrap { display: grid; gap: 1.5rem; }
@container (min-width: 860px) { .rw-quickwrap { grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: start; gap: 3rem; } .rw-quickwrap .rw-head { margin-bottom: 0; } }
.rw-quick { display: grid; border-block-start: 1px solid var(--rw-border); }
.rw-quick a { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: .3rem 1rem; padding: 1.1rem .25rem; border-block-end: 1px solid var(--rw-border); color: inherit; text-decoration: none; transition: padding .2s ease; }
.rw-quick small { grid-column: 1; color: var(--rw-muted); font-size: .8rem; }
.rw-quick b { grid-column: 1; font-size: 1.2rem; font-weight: 750; overflow-wrap: anywhere; }
.rw-quick i { grid-column: 2; grid-row: 1 / span 2; display: grid; place-items: center; width: 2.6rem; height: 2.6rem; border-radius: 50%; border: 1px solid var(--rw-border); font-style: normal; transition: background .2s ease, color .2s ease; }
.rw-quick a:hover { padding-inline: .75rem; }
.rw-quick a:hover i { background: var(--color-primary, #1a1d21); color: var(--color-primary-reverse, #fff); border-color: transparent; }
[dir="rtl"] .rw-quick i { transform: scaleX(-1); }
`;

function telHref(value: unknown): string {
  const raw = (typeof value === "string" ? value : localizedString(value)).trim();
  const num = raw.replace(/\D/g, "");
  if (!num) return "";
  if (raw.startsWith("+")) return `tel:+${num}`;
  if (num.startsWith("00")) return `tel:+${num.slice(2)}`;
  return `tel:${num}`;
}

function digits(value: unknown): string {
  const raw = typeof value === "string" ? value : localizedString(value);
  return raw.replace(/\D/g, "");
}

export default class QuickContact extends LitElement {
  @property({ type: Object }) config?: Record<string, any>;
  private stop = () => {};

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rw-host");
    injectStyles("rw-base", baseCss);
    injectStyles("rw-quick-contact", css);
    this.stop = watchLocale(this);
  }

  disconnectedCallback() {
    this.stop();
    super.disconnectedCallback();
  }

  render() {
    const cfg = getConfig(this.config);
    const phone = digits(cfg.phone);
    const wa = digits(cfg.whatsapp || "201153958512");
    const email = String(cfg.email || "").trim();
    const message = localizedString(cfg.whatsapp_message);
    const actions = [
      phone ? { kicker: localizedString(cfg.phone_label) || t({ ar: "اتصال", en: "Call" }), value: localizedString(cfg.phone_text) || phone, href: telHref(cfg.phone) } : null,
      wa ? { kicker: localizedString(cfg.whatsapp_label) || t({ ar: "واتساب", en: "WhatsApp" }), value: localizedString(cfg.whatsapp_text) || t({ ar: "واتساب", en: "WhatsApp" }), href: `https://wa.me/${wa}${message ? `?text=${encodeURIComponent(message)}` : ""}` } : null,
      email ? { kicker: localizedString(cfg.email_label) || t({ ar: "البريد", en: "Email" }), value: email, href: `mailto:${email}` } : null,
    ].filter(Boolean) as { kicker: string; value: string; href: string }[];
    return html`<section id="rw-contact" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "contact"}>
      <div class="rw-container">
        <div class="rw-quickwrap">
          ${heading(cfg)}
          ${actions.length
            ? html`<div class="rw-quick">${actions.map((item) => html`<a href=${item.href} target=${item.href.startsWith("http") ? "_blank" : nothing} rel="noopener"><small>${item.kicker}</small><b>${item.value}</b><i aria-hidden="true">→</i></a>`)}</div>`
            : emptyCopy()}
        </div>
      </div>
    </section>`;
  }
}
