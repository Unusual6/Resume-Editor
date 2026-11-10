/**
 * Print-based PDF export.
 *
 * The resume is cloned into a hidden iframe that carries a copy of the app's styles
 * plus A4 page rules, then printed. The browser lays the text out as real glyphs, so
 * the exported PDF stays sharp at any zoom and is a fraction of the size of a
 * screenshot-style export (html2canvas + jsPDF embeds one big bitmap).
 */

const FRAME_ATTR = 'data-resume-print-frame';
const FONT_TIMEOUT = 3000;
// Off-screen but laid out at the real page width, so the clone wraps exactly like the preview
const FRAME_CSS = 'position:fixed;left:-10000px;top:0;width:210mm;height:0;border:0;visibility:hidden;';

/** Styles for the print document only; the app's own CSS is copied in on top of them. */
const PRINT_CSS = `
@page { size: A4; margin: 0; }
html, body {
  margin: 0;
  padding: 0;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
*, *::before, *::after { animation: none !important; transition: none !important; }
.resume-a4 {
  width: auto;
  min-height: 0;
  box-shadow: none;
}
/* Keep a heading with its content and never split a paragraph across two pages */
.resume-a4 h2 { break-after: avoid; }
.resume-a4 p, .resume-a4 h1, .resume-a4 h2 { break-inside: avoid; }
`;

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const nextPaint = () =>
  new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

function removeStaleFrames() {
  document.querySelectorAll(`iframe[${FRAME_ATTR}]`).forEach(frame => frame.remove());
}

function addStyle(doc: Document, css: string) {
  const style = doc.createElement('style');
  style.textContent = css;
  doc.head.appendChild(style);
}

/** The clone must be laid out with the same CSS as the app, and webfonts loaded, before printing. */
async function waitForLayout(doc: Document) {
  const ready = Promise.all([
    doc.fonts?.ready ?? Promise.resolve(),
    Promise.all(
      Array.from(doc.images).map(img =>
        img.complete ? Promise.resolve() : new Promise<void>(resolve => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
      )
    ),
  ]);
  await Promise.race([ready, delay(FONT_TIMEOUT)]);
  await nextPaint();
}

export async function printElementAsPDF(source: HTMLElement, fileName: string): Promise<void> {
  removeStaleFrames();

  const frame = document.createElement('iframe');
  frame.setAttribute(FRAME_ATTR, '');
  frame.setAttribute('title', fileName);
  frame.style.cssText = FRAME_CSS;
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    throw new Error('Unable to create a hidden frame for printing');
  }

  doc.open();
  doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
  doc.close();

  const base = doc.createElement('base');
  base.href = document.baseURI;
  doc.head.appendChild(base);
  // The app's CSS first, the print overrides last so they win the cascade
  document.querySelectorAll<HTMLElement>('style, link[rel="stylesheet"]').forEach(node => {
    doc.head.appendChild(node.cloneNode(true));
  });
  addStyle(doc, PRINT_CSS);
  doc.title = fileName;

  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[data-field]').forEach(node => node.removeAttribute('data-field'));
  clone.classList.remove('field-highlight');
  doc.body.appendChild(clone);

  await waitForLayout(doc);

  // Grow the frame to the laid-out height: browsers only print what an iframe can
  // scroll to, so a 0-height frame risks clipping everything after the first page
  frame.style.height = `${Math.ceil(doc.documentElement.scrollHeight)}px`;
  await nextPaint();

  // The suggested file name comes from the document title, which lives on the top
  // document in some browsers, so set both and put the app's title back afterwards
  const previousTitle = document.title;
  document.title = fileName;
  let restored = false;
  const restoreTitle = () => {
    if (restored) return;
    restored = true;
    document.title = previousTitle;
  };
  win.addEventListener('afterprint', restoreTitle, { once: true });
  window.addEventListener('afterprint', restoreTitle, { once: true });
  // Fallback for browsers that never fire afterprint; the frame itself is pruned by
  // the next export, so keeping it alive while a dialog is open stays harmless
  delay(60_000).then(restoreTitle);

  win.focus();
  win.print();
}
