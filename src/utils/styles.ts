export function injectStyles(id: string, css: string): void {
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

const DARK = `--rw-surface:#16130f; --rw-surface-2:#221c16; --rw-card:#241f19; --rw-soft:#2c261f; --rw-text:#f6f1e8; --rw-muted:#cbbfae; --rw-border:rgb(246 241 232 / 14%);`;

export const baseCss = `
.rw-host { display: block; width: 100%; min-width: 0; container-type: inline-size; color: inherit; }
.component-card:has(> .rw-host:not(:empty)) { min-height: 0; }
.rw-block { --rw-surface:#f7f3ec; --rw-surface-2:#efe7da; --rw-card:#fffdf8; --rw-soft:#f3ecdf; --rw-text:#1c1712; --rw-muted:#6f6458; --rw-border:#e4d8c6;
  display: block; width: 100%; box-sizing: border-box; font-family: var(--font-main, inherit); color: var(--rw-text); background: var(--rw-section-bg, var(--rw-surface)); }
.rw-block.rw-dark, html.rw-mode-dark .rw-block.rw-auto { ${DARK} }
.rw-block.rw-light { --rw-surface:#f7f3ec; --rw-surface-2:#efe7da; --rw-card:#fffdf8; --rw-soft:#f3ecdf; --rw-text:#1c1712; --rw-muted:#6f6458; --rw-border:#e4d8c6; }
@media (prefers-color-scheme: dark) { html:not(.rw-mode-light) .rw-block.rw-auto { ${DARK} } }
.rw-block *, .rw-block *::before, .rw-block *::after { box-sizing: border-box; }
.rw-block img { display: block; max-width: 100%; }
.rw-block h2, .rw-block h3, .rw-block p, .rw-block ul { margin: 0; padding: 0; }
.rw-block ul { list-style: none; }
.rw-block button, .rw-block a { font: inherit; }
.rw-section { position: relative; padding-block: 2.75rem; }
@container (min-width: 800px) { .rw-section { padding-block: 4.25rem; } }
.rw-container { width: min(1120px, calc(100% - 2rem)); margin-inline: auto; }
.rw-kicker { margin-bottom: .7rem; font-size: .78rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--color-primary, #8a5a32); }
.rw-display { font-size: clamp(1.85rem, 4vw, 3.15rem); line-height: 1.2; font-weight: 700; letter-spacing: -.03em; }
.rw-title { font-size: clamp(1.55rem, 3vw, 2.35rem); line-height: 1.25; font-weight: 700; }
.rw-lead { margin-top: .85rem; max-width: 40rem; font-size: 1.05rem; line-height: 1.85; color: var(--rw-muted); }
.rw-head { margin-bottom: 1.75rem; max-width: 40rem; }
.rw-head--center { margin-inline: auto; text-align: center; }
.rw-head--center .rw-lead { margin-inline: auto; }
.rw-rule { width: 2.6rem; height: 2px; margin-top: .9rem; border-radius: 99px; background: var(--color-primary, #8a5a32); }
.rw-head--center .rw-rule { margin-inline: auto; }
.rw-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.4rem; }
.rw-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: .75rem 1.4rem; border: 1px solid transparent; border-radius: 999px; background: var(--color-primary, #8a5a32); color: var(--color-primary-reverse, #fff); font-weight: 700; text-decoration: none; cursor: pointer; transition: transform .18s ease, opacity .18s ease; }
.rw-btn:hover { transform: translateY(-1px); }
.rw-btn:focus-visible { outline: 2px solid var(--color-primary, #8a5a32); outline-offset: 3px; }
.rw-btn--ghost { background: transparent; color: var(--rw-text); border-color: var(--rw-border); }
.rw-tone { position: absolute; z-index: 2; top: .85rem; inset-inline-end: .85rem; min-height: 2.4rem; padding: .35rem .8rem; border: 1px solid var(--rw-border); border-radius: 999px; background: color-mix(in srgb, var(--rw-card) 88%, transparent); color: var(--rw-text); cursor: pointer; }
.rw-ph { display: grid; place-items: center; width: 100%; height: 100%; min-height: 16rem; padding: 1rem; text-align: center; color: var(--rw-muted); background:
  radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--color-primary, #8a5a32) 28%, transparent), transparent 42%),
  linear-gradient(160deg, var(--rw-soft), var(--rw-surface-2)); }
.rw-empty { padding: 1.2rem; border: 1px dashed var(--rw-border); border-radius: 1rem; color: var(--rw-muted); text-align: center; }
@media (prefers-reduced-motion: reduce) {
  .rw-btn, .rw-note, .rw-reason { transition: none !important; }
  .rw-btn:hover { transform: none; }
}
`;

export function sectionStyle(cfg: Record<string, any>): string {
  return cfg.bg_color ? `--rw-section-bg:${cfg.bg_color}` : "";
}
