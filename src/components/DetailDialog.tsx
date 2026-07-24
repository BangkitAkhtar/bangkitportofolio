import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { isPdf, fileNameFromUrl, prefersNativePdfViewer, openPdfInNewTab } from "@/lib/fileType";
import { PdfPreview } from "@/components/PdfPreview";
import { markdownToHtml } from "@/lib/markdown";

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  images: string[];
  children?: React.ReactNode;
}

function renderRichText(text?: string) {
  if (!text) return null;

  // Deskripsi disimpan sebagai markdown mentah (dari toolbar Bold/Italic/List di admin
  // dashboard) — harus dikonversi ke HTML dulu, bukan didorong langsung apa adanya.
  return (
    <div
      className="text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1"
      dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }}
    />
  );
}

export function DetailDialog({
  open,
  onClose,
  title,
  subtitle,
  description,
  images,
  children,
}: DetailDialogProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Efek untuk mengunci scroll background dan mereset lightbox
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setLightboxIndex(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Efek Cerdas: Mengaktifkan tombol ESCAPE di keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) {
          setLightboxIndex(null); // Tekan Esc tutup gambar dulu
        } else if (open) {
          onClose(); // Tekan Esc lagi tutup modal utama
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, open, onClose]);

  const lbNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : 0));
  }, [images.length]);

  const lbPrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + images.length) % images.length : 0
    );
  }, [images.length]);

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      if (info.offset.x < -50) lbNext();
      else if (info.offset.x > 50) lbPrev();
    },
    [lbNext, lbPrev]
  );

  return (
    <>
      {/* =======================================
          1. ANIMASI MODAL UTAMA 
          ======================================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="main-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm"
            onClick={onClose} // Klik area kosong untuk menutup modal
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam kotak agar tidak tertutup
              className="relative z-10 bg-card rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-secondary/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                aria-label="Tutup Dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-foreground text-xl pr-8">{title}</h3>
                    {subtitle && (
                      <p className="text-primary text-sm font-semibold mt-1">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  {description && renderRichText(description)}

                  {children}

                  {images.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Gallery
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {images.map((img, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer border bg-secondary/30 shadow-sm"
                            onClick={() => {
                              // Di HP/tablet, lightbox cuma menampilkan render halaman 1 yang
                              // buram saat diperbesar. Serahkan ke viewer PDF bawaan perangkat.
                              if (isPdf(img) && prefersNativePdfViewer()) {
                                openPdfInNewTab(img);
                                return;
                              }
                              setLightboxIndex(i);
                            }}
                          >
                            {isPdf(img) ? (
                              <PdfPreview url={img} className="w-full h-full" />
                            ) : (
                              <img
                                src={img}
                                alt={`${title} - gambar ${i + 1}`}
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable={false}
                                loading="lazy"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =======================================
          2. LIGHTBOX (FOTO FULLSCREEN)
          ======================================= */}
      {/* KUNCI PERBAIKAN: AnimatePresence dihapus agar elemen langsung lenyap dari DOM tanpa sisa */}
      {lightboxIndex !== null && open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Tutup Foto"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
            {lightboxIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={lbPrev}
                className="hidden lg:flex absolute left-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Gambar Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={lbNext}
                className="hidden lg:flex absolute right-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Gambar Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative z-10 w-full h-full flex items-center justify-center p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di foto tertutup
          >
            {isPdf(images[lightboxIndex]) ? (
              // Tampilkan halaman pertama sebagai gambar (jalan di semua perangkat),
              // lalu arahkan ke viewer PDF asli lewat tombol. <iframe> sengaja dihindari
              // karena browser Android/iOS tidak merender PDF di dalamnya -> layar kosong.
              <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
                <div className="flex items-center justify-between gap-3 shrink-0 w-full max-w-3xl">
                  <p className="text-white/80 text-sm font-medium truncate">
                    {fileNameFromUrl(images[lightboxIndex])}
                  </p>
                  <a
                    href={images[lightboxIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-white text-sm font-medium hover:bg-white/20 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" /> Buka / Unduh
                  </a>
                </div>
                <div className="relative max-w-3xl w-full flex-1 min-h-0 rounded-lg overflow-hidden shadow-2xl">
                  <PdfPreview
                    key={lightboxIndex}
                    url={images[lightboxIndex]}
                    className="w-full h-full"
                    showBadge={false}
                  />
                </div>
              </div>
            ) : (
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                src={images[lightboxIndex]}
                alt={`${title} - gambar ${lightboxIndex + 1}`}
                drag={images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={handleDragEnd}
                className="max-w-full max-h-[85vh] object-contain rounded-lg select-none cursor-grab active:cursor-grabbing shadow-2xl"
                draggable={false}
              />
            )}
          </div>

          {/* Tombol Kontrol Mobile */}
          {images.length > 1 && (
            <div
              className="flex lg:hidden gap-8 absolute bottom-6 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={lbPrev}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={lbNext}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}