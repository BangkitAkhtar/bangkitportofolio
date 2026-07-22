import { useState } from "react";
import { FileText } from "lucide-react";
import { pdfThumbUrl } from "@/lib/fileType";

interface PdfPreviewProps {
  /** URL PDF (sudah dinormalisasi) */
  url: string;
  /** class untuk elemen preview (img/iframe), mis. "w-full h-24" */
  className?: string;
  /** tampilkan label kecil "PDF" di pojok */
  showBadge?: boolean;
}

/**
 * Preview isi PDF, dipakai bersama oleh galeri publik & dashboard admin.
 *
 * Backend hanya bisa membuat thumbnail "<file>.pdf.webp" kalau server punya
 * Imagick. Kalau tidak ada (thumbnail 404), otomatis jatuh ke viewer bawaan
 * browser lewat <iframe> supaya user tetap melihat isi dokumennya, bukan
 * sekadar ikon.
 */
export function PdfPreview({ url, className = "", showBadge = true }: PdfPreviewProps) {
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <>
      {thumbFailed ? (
        // pointer-events-none supaya klik diteruskan ke kartu induknya
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title="Pratinjau PDF"
          className={`${className} pointer-events-none border-0 bg-white`}
          loading="lazy"
        />
      ) : (
        <img
          src={pdfThumbUrl(url)}
          alt="Pratinjau PDF"
          className={`${className} object-cover select-none pointer-events-none bg-white`}
          draggable={false}
          loading="lazy"
          onError={() => setThumbFailed(true)}
        />
      )}

      {showBadge && (
        <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-medium">
          <FileText className="w-3 h-3" /> PDF
        </span>
      )}
    </>
  );
}
