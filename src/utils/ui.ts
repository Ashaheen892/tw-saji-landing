import { html, nothing } from "lit";
import { localizedString, t } from "./config.js";

export function heading(cfg: Record<string, any>, center = false) {
  const kicker = localizedString(cfg.kicker);
  const title = localizedString(cfg.title);
  const subtitle = localizedString(cfg.subtitle);
  if (!kicker && !title && !subtitle) return nothing;
  return html`<div class="rw-head ${center ? "rw-head--center" : ""}">
    ${kicker ? html`<p class="rw-kicker">${kicker}</p>` : nothing}
    ${title ? html`<h2 class="rw-title">${title}</h2>` : nothing}
    ${subtitle ? html`<p class="rw-lead">${subtitle}</p>` : nothing}
    ${title ? html`<span class="rw-rule"></span>` : nothing}
  </div>`;
}

export function emptyCopy() {
  return html`<p class="rw-empty">${t({ ar: "أضف عناصر هذا القسم من الإعدادات", en: "Add this section's items in the settings" })}</p>`;
}

export function media(src: string, alt: string, className = "") {
  if (src) return html`<img class=${className} src=${src} alt=${alt} loading="lazy" />`;
  return html`<div class="rw-ph ${className}"><span class="rw-hint">${t({ ar: "أضف الصورة من إعدادات القسم. المقاس المقترح مذكور بجانب الحقل.", en: "Add an image in the section settings. The suggested size is next to the field." })}</span></div>`;
}
