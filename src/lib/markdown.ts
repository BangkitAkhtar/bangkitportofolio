/**
 * Konversi markdown sederhana (dari RichTextEditor di admin dashboard) ke HTML.
 * Mendukung persis 4 tombol toolbar-nya: **bold**, *italic*, "- bullet", "1. numbered".
 *
 * HTML di-escape LEBIH DULU, sebelum sintaks markdown diproses — supaya teks yang
 * user ketik tidak bisa menyuntikkan tag HTML/script (hasil fungsi ini dipakai lewat
 * dangerouslySetInnerHTML).
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineFormat(text: string): string {
  // Bold dulu, baru italic — supaya "**" tidak keburu kepotong jadi dua "*" oleh pass italic.
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

/**
 * Format inline saja (bold/italic) untuk SATU baris teks — dipakai di tempat yang
 * sudah menyusun bullet/struktur sendiri secara manual (mis. daftar pengalaman kerja),
 * jadi cukup butuh bold/italic jalan, tanpa parsing blok paragraf/list penuh.
 */
export function formatInline(text?: string | null): string {
  if (!text) return "";
  return inlineFormat(escapeHtml(text));
}

export function markdownToHtml(raw?: string | null): string {
  if (!raw) return "";

  const lines = escapeHtml(raw).split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let i = 0;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${paragraph.map(inlineFormat).join("<br/>")}</p>`);
      paragraph = [];
    }
  };

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed === "") {
      flushParagraph();
      i++;
      continue;
    }

    const bullet = trimmed.match(/^-\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].trim().match(/^-\s+(.*)$/);
        if (!m) break;
        items.push(`<li>${inlineFormat(m[1])}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    const numbered = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].trim().match(/^\d+\.\s+(.*)$/);
        if (!m) break;
        items.push(`<li>${inlineFormat(m[1])}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    paragraph.push(lines[i]);
    i++;
  }
  flushParagraph();

  return html.join("");
}
