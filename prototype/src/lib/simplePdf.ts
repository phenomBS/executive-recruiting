/**
 * Minimal dependency-free PDF writer (Helvetica, US Letter).
 * Supports headings, wrapped paragraphs, simple tables, and page numbers.
 */

export type PdfColor = [number, number, number];

export type PdfBlock =
  | { type: 'title'; text: string }
  | { type: 'meta'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'label'; text: string }
  | { type: 'paragraph'; text: string; bold?: boolean; color?: PdfColor }
  | { type: 'bullet'; text: string }
  | { type: 'table'; columns: { header: string; width: number; align?: 'left' | 'right' }[]; rows: string[][] }
  | { type: 'spacer'; height?: number };

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 54;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK: PdfColor = [0.2, 0.23, 0.27];
const MUTED: PdfColor = [0.39, 0.44, 0.52];
const BRAND: PdfColor = [0.3, 0.24, 0.88];
const RULE: PdfColor = [0.82, 0.84, 0.86];

const CHAR_MAP: Record<string, string> = {
  '\u2022': '\u0095',
  '\u2013': '\u0096',
  '\u2014': '\u0097',
  '\u2018': '\u0091',
  '\u2019': '\u0092',
  '\u201C': '\u0093',
  '\u201D': '\u0094',
  '\u2265': '>=',
  '\u2264': '<=',
  '\u2192': '->',
  '\u2026': '...',
  '\u00A0': ' ',
};

export function toWinAnsi(text: string): string {
  let out = '';
  for (const ch of text) {
    if (CHAR_MAP[ch] !== undefined) {
      out += CHAR_MAP[ch];
    } else if (ch.charCodeAt(0) <= 255) {
      out += ch;
    } else {
      out += '?';
    }
  }
  return out;
}

export function escapePdf(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (text[i] === '\\' || text[i] === '(' || text[i] === ')') {
      out += `\\${text[i]}`;
    } else if (code > 126 || code < 32) {
      out += `\\${code.toString(8).padStart(3, '0')}`;
    } else {
      out += text[i];
    }
  }
  return out;
}

// Helvetica advance widths (per 1000 units) for ASCII 32..126.
const WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

function charWidth(ch: string, bold: boolean): number {
  const code = ch.charCodeAt(0);
  let w: number;
  if (code >= 32 && code <= 126) w = WIDTHS[code - 32];
  else if (code === 0x95) w = 350;
  else if (code === 0x96) w = 556;
  else if (code === 0x97) w = 1000;
  else w = 556;
  return bold ? w * 1.07 : w;
}

export function textWidth(text: string, size: number, bold: boolean): number {
  let total = 0;
  for (const ch of text) total += charWidth(ch, bold);
  return (total / 1000) * size;
}

export function wrap(text: string, size: number, bold: boolean, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = toWinAnsi(text).split('\n');
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (textWidth(candidate, size, bold) <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
        while (textWidth(current, size, bold) > maxWidth && current.length > 1) {
          let cut = current.length - 1;
          while (cut > 1 && textWidth(current.slice(0, cut), size, bold) > maxWidth) cut -= 1;
          lines.push(current.slice(0, cut));
          current = current.slice(cut);
        }
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function color(c: PdfColor): string {
  return `${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(3)}`;
}

class Layout {
  pages: string[][] = [[]];
  y = PAGE_H - MARGIN;

  get ops() {
    return this.pages[this.pages.length - 1];
  }

  ensure(height: number) {
    if (this.y - height < MARGIN + 18) {
      this.pages.push([]);
      this.y = PAGE_H - MARGIN;
    }
  }

  text(x: number, baseline: number, str: string, size: number, bold: boolean, c: PdfColor) {
    this.ops.push(
      `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color(c)} rg ${x.toFixed(2)} ${baseline.toFixed(2)} Td (${escapePdf(str)}) Tj ET`
    );
  }

  rule(y: number, c: PdfColor = RULE, x1 = MARGIN, x2 = PAGE_W - MARGIN, width = 0.6) {
    this.ops.push(`${color(c)} RG ${width} w ${x1.toFixed(2)} ${y.toFixed(2)} m ${x2.toFixed(2)} ${y.toFixed(2)} l S`);
  }
}

function block(layout: Layout, item: PdfBlock) {
  switch (item.type) {
    case 'title': {
      const lines = wrap(item.text, 20, true, CONTENT_W);
      layout.ensure(lines.length * 26);
      for (const line of lines) {
        layout.y -= 22;
        layout.text(MARGIN, layout.y, line, 20, true, INK);
        layout.y -= 4;
      }
      return;
    }
    case 'meta': {
      const lines = wrap(item.text, 9.5, false, CONTENT_W);
      layout.ensure(lines.length * 13);
      for (const line of lines) {
        layout.y -= 13;
        layout.text(MARGIN, layout.y, line, 9.5, false, MUTED);
      }
      return;
    }
    case 'heading': {
      layout.ensure(130);
      layout.y -= 18;
      layout.rule(layout.y + 14, RULE);
      layout.y -= 6;
      layout.text(MARGIN, layout.y, toWinAnsi(item.text), 13, true, BRAND);
      layout.y -= 6;
      return;
    }
    case 'label': {
      layout.ensure(20);
      layout.y -= 14;
      layout.text(MARGIN, layout.y, toWinAnsi(item.text.toUpperCase()), 8.5, true, MUTED);
      return;
    }
    case 'paragraph': {
      const size = 10;
      const lines = wrap(item.text, size, Boolean(item.bold), CONTENT_W);
      for (const line of lines) {
        layout.ensure(15);
        layout.y -= 14;
        layout.text(MARGIN, layout.y, line, size, Boolean(item.bold), item.color || INK);
      }
      return;
    }
    case 'bullet': {
      const size = 10;
      const lines = wrap(item.text, size, false, CONTENT_W - 16);
      lines.forEach((line, index) => {
        layout.ensure(15);
        layout.y -= 14;
        if (index === 0) layout.text(MARGIN + 2, layout.y, '\u0095', size, false, BRAND);
        layout.text(MARGIN + 16, layout.y, line, size, false, INK);
      });
      return;
    }
    case 'table': {
      const total = item.columns.reduce((sum, col) => sum + col.width, 0);
      const widths = item.columns.map(col => (col.width / total) * CONTENT_W);
      const size = 9;
      const pad = 4;
      const drawHeader = () => {
        layout.ensure(24);
        layout.y -= 14;
        let x = MARGIN;
        item.columns.forEach((col, i) => {
          const label = toWinAnsi(col.header);
          const tx = col.align === 'right' ? x + widths[i] - pad - textWidth(label, 8.5, true) : x + pad;
          layout.text(tx, layout.y, label, 8.5, true, MUTED);
          x += widths[i];
        });
        layout.y -= 5;
        layout.rule(layout.y, RULE, MARGIN, PAGE_W - MARGIN, 0.8);
      };
      drawHeader();
      for (const row of item.rows) {
        const cells = row.map((cell, i) => wrap(cell, size, false, widths[i] - pad * 2));
        const lineCount = Math.max(...cells.map(lines => lines.length), 1);
        const height = lineCount * 12 + 8;
        if (layout.y - height < MARGIN + 18) {
          layout.ensure(height + 100);
          drawHeader();
        }
        const top = layout.y;
        let x = MARGIN;
        cells.forEach((lines, i) => {
          lines.forEach((line, lineIndex) => {
            const col = item.columns[i];
            const tx = col.align === 'right' ? x + widths[i] - pad - textWidth(line, size, false) : x + pad;
            layout.text(tx, top - 13 - lineIndex * 12, line, size, false, INK);
          });
          x += widths[i];
        });
        layout.y = top - height;
        layout.rule(layout.y + 3, [0.92, 0.93, 0.95], MARGIN, PAGE_W - MARGIN, 0.5);
      }
      return;
    }
    case 'spacer': {
      layout.y -= item.height ?? 8;
      return;
    }
  }
}

export function buildPdf(blocks: PdfBlock[], footerLabel: string): Blob {
  const layout = new Layout();
  blocks.forEach(item => block(layout, item));

  const total = layout.pages.length;
  layout.pages.forEach((ops, index) => {
    const footer = `${toWinAnsi(footerLabel)}  |  Page ${index + 1} of ${total}`;
    ops.push(
      `BT /F1 8 Tf ${color(MUTED)} rg ${MARGIN} ${MARGIN - 18} Td (${escapePdf(footer)}) Tj ET`
    );
  });

  const objects: string[] = [];
  const pageObjIds: number[] = [];
  // 1 catalog, 2 pages, 3 regular font, 4 bold font, then content+page pairs.
  const firstPageObj = 5;
  layout.pages.forEach((_, index) => {
    pageObjIds.push(firstPageObj + index * 2 + 1);
  });

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] /Count ${total} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

  layout.pages.forEach((ops, index) => {
    const contentId = firstPageObj + index * 2;
    const pageId = contentId + 1;
    const stream = ops.join('\n');
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
