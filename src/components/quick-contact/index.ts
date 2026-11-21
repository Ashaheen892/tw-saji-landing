import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { getConfig, localizedString, t, watchLocale } from "../../utils/config.js";
import { schemeOf } from "../../utils/landing.js";
import { baseCss, injectStyles, sectionStyle } from "../../utils/styles.js";
import { emptyCopy, heading } from "../../utils/ui.js";

const css = `
.rw-quick { display: grid; }
@container (min-width: 760px) { .rw-quick { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.rw-quick a { display: block; padding: 1rem 1rem 1rem 0; border-block-start: 1px solid var(--rw-border); color: inherit; text-decoration: none; }
.rw-quick small { display: block; color: var(--rw-muted); font-size: .78rem; }
.rw-quick b { display: block; margin-top: .3rem; font-size: 1.08rem; }
.rw-quick a:hover b { text-decoration: underline; text-underline-offset: .18rem; }
`;

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
      phone ? { kicker: localizedString(cfg.phone_label) || t({ ar: "اتصال", en: "Call" }), value: localizedString(cfg.phone_text) || phone, href: `tel:+${phone}` } : null,
      wa ? { kicker: localizedString(cfg.whatsapp_label) || t({ ar: "واتساب", en: "WhatsApp" }), value: localizedString(cfg.whatsapp_text) || t({ ar: "راسل المشغل", en: "Message the workshop" }), href: `https://wa.me/${wa}${message ? `?text=${encodeURIComponent(message)}` : ""}` } : null,
      email ? { kicker: localizedString(cfg.email_label) || t({ ar: "البريد", en: "Email" }), value: email, href: `mailto:${email}` } : null,
    ].filter(Boolean) as { kicker: string; value: string; href: string }[];
    return html`<section id="rw-contact" class="rw-block rw-section ${schemeOf(cfg)}" style=${sectionStyle(cfg)} aria-label=${localizedString(cfg.title) || "contact"}>
      <div class="rw-container">
        ${heading(cfg)}
        ${actions.length
          ? html`<div class="rw-quick">${actions.map((item) => html`<a href=${item.href}><small>${item.kicker}</small><b>${item.value}</b></a>`)}</div>`
          : emptyCopy()}
      </div>
    </section>`;
  }
}
