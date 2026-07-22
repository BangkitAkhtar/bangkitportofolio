/**
 * Helper untuk membedakan file PDF dari gambar biasa.
 * Data portofolio menyimpan lampiran sebagai array string URL saja, jadi
 * jenis file ditentukan dari ekstensi di URL-nya.
 */

/** True kalau URL menunjuk ke sebuah PDF. */
export function isPdf(url?: string): boolean {
  if (!url) return false;
  // buang query/hash dulu supaya "file.pdf?v=2" tetap terdeteksi
  const clean = url.split(/[?#]/)[0];
  return clean.toLowerCase().endsWith(".pdf");
}

/**
 * Backend membuat thumbnail halaman pertama dengan konvensi "<file>.pdf.webp"
 * (kalau server mendukung Imagick). Frontend cukup menebak nama ini; jika 404,
 * pemanggil harus fallback ke viewer bawaan browser.
 */
export function pdfThumbUrl(pdfUrl: string): string {
  return `${pdfUrl.split(/[?#]/)[0]}.webp`;
}

/**
 * True di perangkat sentuh (HP/tablet).
 *
 * Di perangkat ini, pratinjau PDF di dalam modal tidak memadai: yang tampil hanya
 * halaman pertama hasil render canvas, dan terlihat buram saat diperbesar. Viewer
 * PDF bawaan HP jauh lebih baik — bisa semua halaman, zoom tajam, dan bisa diunduh.
 * Jadi di perangkat sentuh, PDF langsung dibuka di tab baru.
 */
export function prefersNativePdfViewer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
}

/** Buka PDF di tab baru memakai viewer bawaan perangkat. */
export function openPdfInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Nama file yang enak dibaca, untuk label/tombol unduh. */
export function fileNameFromUrl(url: string): string {
  try {
    const clean = url.split(/[?#]/)[0];
    return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1));
  } catch {
    return "dokumen.pdf";
  }
}
