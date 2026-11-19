import { html, nothing } from "lit";
import { localizedString, unwrapValue } from "./config.js";

/** Centered section title. The merchant picks one of four original marks, not a copied treatment. */
export function sectionTitle(cfg: Record<string, any>) {
  const title = localizedString(cfg.title);
  const subtitle = localizedString(cfg.subtitle);
  if (!title && !subtitle) return nothing;
  const style = String(unwrapValue(cfg.title_style) || "hairline");
  return html`<div class="rw-ts rw-ts--${style}">
    ${title ? html`<h2>${title}</h2>` : nothing}
    ${subtitle ? html`<p>${subtitle}</p>` : nothing}
    <span class="rw-ts__mark"></span>
  </div>`;
}

export const titleCss = `
.rw-ts { margin-bottom: 1.6rem; text-align: center; }
.rw-ts h2 { font-size: clamp(1.55rem, 3vw, 2.35rem); line-height: 1.25; font-weight: 700; }
.rw-ts p { max-width: 36rem; margin: .7rem auto 0; color: var(--rw-muted); line-height: 1.8; }
.rw-ts__mark { display: block; margin: .85rem auto 0; }
.rw-ts--plain .rw-ts__mark { display: none; }
.rw-ts--hairline .rw-ts__mark { width: 3.2rem; height: 2px; border-radius: 99px; background: var(--color-primary, #1c3d36); }
.rw-ts--brackets h2 { display: inline-block; padding-inline: .8rem; }
.rw-ts--brackets .rw-ts__mark { display: none; }
.rw-ts--brackets h2::before, .rw-ts--brackets h2::after { content: ""; display: inline-block; width: .55rem; height: .7em; border-block: 2px solid var(--color-primary, #1c3d36); vertical-align: .05em; }
.rw-ts--brackets h2::before { border-inline-start: 2px solid var(--color-primary, #1c3d36); margin-inline-end: .45rem; }
.rw-ts--brackets h2::after { border-inline-end: 2px solid var(--color-primary, #1c3d36); margin-inline-start: .45rem; }
.rw-ts--ticket h2 { display: inline-block; padding: .15rem .7rem; border: 1px dashed var(--color-primary, #1c3d36); }
.rw-ts--ticket .rw-ts__mark { width: .45rem; height: .45rem; border: 1px solid var(--color-primary, #1c3d36); transform: rotate(45deg); }
`;
