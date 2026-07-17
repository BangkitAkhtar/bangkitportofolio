import { useState, lazy, Suspense } from "react";
import { Briefcase, Building2, ImageIcon } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
const Lightbox = lazy(() => import("./Lightbox").then((m) => ({ default: m.Lightbox })));
import { PortfolioData } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function ExperienceSection({ data }: { data: PortfolioData }) {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const { t } = useLang();

  // PROTEKSI 1: Pastikan data.experiences berupa array, jika tidak jadikan array kosong
  const experiences = data?.experiences || [];

  // Sembunyikan section jika memang tidak ada data pengalaman sama sekali
  if (experiences.length === 0) return null;

  return (
    <>
      <section id="experience" className="bg-card/50 border-b border-border">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">
              <Briefcase className="w-7 h-7 text-primary" />
              {t.experienceTitle}
            </h2>
          </AnimatedSection>
          <StaggerContainer className="space-y-0">
            {experiences.map((exp) => {
              // PROTEKSI 2: Pastikan setiap properti array di dalam exp tidak null/undefined
              const descriptions = Array.isArray(exp?.description) ? exp.description : [];
              const skills = Array.isArray(exp?.skills) ? exp.skills : [];
              const images = Array.isArray(exp?.images) ? exp.images : [];

              return (
                <StaggerItem key={exp?.id || Math.random().toString()}>
                  <div className="timeline-card">
                    <div className="timeline-dot" />
                    <div className="card-elevated p-5 sm:p-6 hover:translate-x-1 transition-transform duration-200">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden hover:scale-110 hover:rotate-3 transition-transform duration-200">
                          {exp?.companyLogo ? (
                            <img loading="lazy" src={exp.companyLogo} alt={`Logo ${exp?.company || "Perusahaan"}`} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Building2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground text-base sm:text-lg">{exp?.title || "Unknown Role"}</h3>
                          <p className="text-primary font-semibold text-sm">{exp?.company || "Unknown Company"}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {exp?.dateRange || ""} {exp?.location ? `· ${exp.location}` : ""}
                          </p>
                          
                          {/* Render Deskripsi jika ada */}
                          {descriptions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {descriptions.map((item, j) => {
                                if (!item || typeof item !== 'string') return null;
                                const trimmed = item.trim();

                                // detect bullet manual
                                const isBullet = /^-\s+/.test(trimmed);

                                // clean text dari bullet lama
                                const cleaned = trimmed
                                  .replace(/^•\s*/, "")
                                  .replace(/^\u2022\s*/, "")
                                  .replace(/^-\s*/, "");

                                if (isBullet) {
                                  return (
                                    <div key={j} className="flex items-start gap-3">
                                      <span className="mt-[6px] text-primary text-base font-semibold leading-none flex-shrink-0">
                                        •
                                      </span>
                                      <p className="text-muted-foreground text-sm leading-relaxed">
                                        {cleaned}
                                      </p>
                                    </div>
                                  );
                                }

                                // normal text (no bullet)
                                return (
                                  <p key={j} className="text-muted-foreground text-sm leading-relaxed">
                                    {cleaned}
                                  </p>
                                );
                              })}
                            </div>
                          )}

                          {/* Render Skills jika ada */}
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {skills.map((skill) => (
                                skill ? <span key={skill} className="badge-skill hover:scale-105 transition-transform duration-150">{skill}</span> : null
                              ))}
                            </div>
                          )}

                          {/* Render Images jika ada */}
                          {images.length > 0 && (
                            <div className="mt-4">
                              <div className="flex items-center gap-1.5 mb-2">
                                <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-medium">
                                  {images.length} {images.length > 1 ? t.photosPlural : t.photos}
                                </span>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {images.slice(0, 5).map((img, j) => (
                                  img ? (
                                    <button key={j} onClick={() => setLightbox({ images: images, index: j })} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border group cursor-pointer hover:scale-105 hover:-translate-y-1 active:scale-95 transition-transform duration-200">
                                      <img loading="lazy" src={img} alt={`${exp?.title || "Project"} — foto ${j + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors rounded-xl" />
                                      {j === 4 && images.length > 5 && (
                                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center rounded-xl">
                                          <span className="text-primary-foreground font-bold text-sm">+{images.length - 5}</span>
                                        </div>
                                      )}
                                    </button>
                                  ) : null
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
      {lightbox && (
        <Suspense fallback={null}>
          <Lightbox images={lightbox.images} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />
        </Suspense>
      )}
    </>
  );
}