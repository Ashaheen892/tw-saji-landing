import { html, nothing } from "lit";
import { isRtl, localizedString, unwrapValue } from "./config.js";

const COPIES = 12;

/** Full-width announcement bar. Color is the store primary unless a tone is passed. */
export function announceCss(prefix: string): string {
  return `
.${prefix}-ann.${prefix}-ann {
  overflow: hidden;
  padding-block: 5px;
  border: 0;
  font-family: var(--font-main, inherit);
  background: var(--ann-bg, var(--color-primary));
  color: var(--ann-ink, var(--color-primary-reverse, #fff));
}
.${prefix}-ann__still {
  padding: 5px 1.5rem;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 26px;
}
.${prefix}-ann__list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 5px 0;
  list-style: none;
  white-space: nowrap;
}
.${prefix}-ann__item {
  flex: none;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 26px;
  animation: ${prefix}-ann-ltr var(--ann-speed, 18s) linear infinite;
}
.${prefix}-ann.is-rtl .${prefix}-ann__item { animation-name: ${prefix}-ann-rtl; }
.${prefix}-ann__list:hover .${prefix}-ann__item { animation-play-state: paused; }
.${prefix}-ann__text {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding-inline: 1.5rem;
}
.${prefix}-ann__text::after {
  content: "";
  width: .35rem;
  height: .35rem;
  border-radius: 50%;
  background: currentColor;
  opacity: .55;
  flex: none;
}
@keyframes ${prefix}-ann-ltr { to { transform: translateX(-100%); } }
@keyframes ${prefix}-ann-rtl { to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) {
  .${prefix}-ann__item { animation: none; }
  .${prefix}-ann__item[aria-hidden="true"] { display: none; }
  .${prefix}-ann__list { justify-content: center; }
  .${prefix}-ann__text::after { display: none; }
}
`;
}

export function announceBar(cfg: Record<string, any>, prefix: string, extraClass = "", tone = "") {
  const text = localizedString(cfg.announce).trim();
  if (!text) return nothing;
  const moving = String(unwrapValue(cfg.announce_mode) || "move") !== "still";
  if (!moving) {
    return html`<div class="${prefix}-ann ${prefix}-ann__still ${extraClass}" style=${tone}>${text}</div>`;
  }
  const rtl = isRtl() ? " is-rtl" : "";
  return html`<div class="${prefix}-ann${rtl} ${extraClass}" style=${tone}>
    <ul class="${prefix}-ann__list">
      ${Array.from({ length: COPIES }, (_, index) => html`<li class="${prefix}-ann__item" aria-hidden=${index ? "true" : "false"}><span class="${prefix}-ann__text">${text}</span></li>`)}
    </ul>
  </div>`;
}
