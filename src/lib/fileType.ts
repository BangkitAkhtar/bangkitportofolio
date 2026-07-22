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

/** Nama file yang enak dibaca, untuk label/tombol unduh. */
export function fileNameFromUrl(url: string): string {
  try {
    const clean = url.split(/[?#]/)[0];
    return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1));
  } catch {
    return "dokumen.pdf";
  }
}
