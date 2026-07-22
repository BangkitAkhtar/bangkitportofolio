import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { pdfThumbUrl } from "@/lib/fileType";

interface PdfPreviewProps {
  /** URL PDF (sudah dinormalisasi) */
  url: string;
  /** class untuk elemen preview, mis. "w-full h-24" */
  className?: string;
  /** tampilkan label kecil "PDF" di pojok */
  showBadge?: boolean;
}

/**
 * Pratinjau isi PDF, dipakai bersama oleh galeri publik & dashboard admin.
 *
 * Dua tingkat, dari yang paling murah:
 *  1. Thumbnail buatan server ("<file>.pdf.webp") — hanya ada kalau server punya
 *     Imagick. Paling ringan: cuma satu request gambar kecil.
 *  2. Render halaman pertama di browser via PDF.js ke <canvas>.
 *
 * Sengaja TIDAK memakai <iframe>: browser Android/iOS tidak merender PDF di dalam
 * iframe, jadi di HP hasilnya kosong. Render ke canvas jalan di semua perangkat.
 * PDF.js di-import dinamis supaya tidak ikut ke bundle awal halaman.
 */
export function PdfPreview({ url, className = "", showBadge = true }: PdfPreviewProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const [rendered, setRendered] = useState<string | null>(null);
  const [renderFailed, setRenderFailed] = useState(false);

  useEffect(() => {
    // Baru render sendiri kalau thumbnail server memang tidak ada
    if (!thumbFailed || rendered || renderFailed) return;

    let cancelled = false;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

        const doc = await pdfjs.getDocument({ url }).promise;
        const page = await doc.getPage(1);

        // Skalakan ke lebar ~600px: cukup tajam untuk kartu galeri, tidak boros memori HP
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: 600 / base.width });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas 2d context tidak tersedia");

        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        if (cancelled) return;

        setRendered(canvas.toDataURL("image/webp", 0.8));
        doc.destroy();
      } catch {
        if (!cancelled) setRenderFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [thumbFailed, rendered, renderFailed, url]);

  const badge = showBadge && (
    <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-medium">
      <FileText className="w-3 h-3" /> PDF
    </span>
  );

  // 1. Thumbnail dari server (paling ringan)
  if (!thumbFailed) {
    return (
      <>
        <img
          src={pdfThumbUrl(url)}
          alt="Pratinjau PDF"
          className={`${className} object-cover object-top select-none pointer-events-none bg-white`}
          draggable={false}
          loading="lazy"
          onError={() => setThumbFailed(true)}
        />
        {badge}
      </>
    );
  }

  // 2. Hasil render PDF.js
  if (rendered) {
    return (
      <>
        <img
          src={rendered}
          alt="Pratinjau PDF"
          className={`${className} object-cover object-top select-none pointer-events-none bg-white`}
          draggable={false}
        />
        {badge}
      </>
    );
  }

  // 3. Sedang merender, atau benar-benar gagal -> kartu netral (jangan tampilkan gambar rusak)
  return (
    <>
      <div
        className={`${className} flex flex-col items-center justify-center gap-1 bg-secondary/40 text-muted-foreground`}
      >
        <FileText className="w-6 h-6" />
        <span className="text-[10px] font-medium">
          {renderFailed ? "PDF" : "Memuat…"}
        </span>
      </div>
      {showBadge && renderFailed && badge}
    </>
  );
}
