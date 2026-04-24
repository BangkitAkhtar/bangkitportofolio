import React, { useState, useRef, Children, useEffect } from "react";
import {
  Award,
  FolderOpen,
  Heart,
  Trophy,
  Globe,
  Wrench,
  Sparkles,
  Eye,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { PortfolioData, Certification, Project, Volunteer } from "@/lib/data";
import { DetailDialog } from "./DetailDialog";
import { useLang } from "@/lib/i18n";

/* =========================
   HELPERS & NATIVE SCROLL
========================= */

// Komponen HorizontalScroll (Native CSS Snap, Smart Dots, Anti-Drag/Copy)
const NativeScrollWithDots = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const items = Children.toArray(children);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Cek apakah konten benar-benar butuh di-scroll (lebih lebar dari container)
    // Ditambah buffer 5px untuk menghindari bug pembulatan pixel di browser
    const canScroll = scrollWidth > clientWidth + 5;
    setIsScrollable(canScroll);

    if (!canScroll) {
      setShowLeft(false);
      setShowRight(false);
      setActiveIndex(0);
      return;
    }
    
    setShowLeft(scrollLeft > 0);
    setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);

    const maxScroll = scrollWidth - clientWidth;
    const progress = scrollLeft / maxScroll;
    const currentIndex = Math.round(progress * (items.length - 1));
    setActiveIndex(currentIndex);
  };

  useEffect(() => {
    // Jalankan cek scroll saat komponen dirender dan saat ukuran layar berubah
    checkScroll();
    window.addEventListener("resize", checkScroll);
    
    // Timeout kecil untuk memastikan gambar/font sudah terload dan ukuran valid
    const timeoutId = setTimeout(checkScroll, 100);
    
    return () => {
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeoutId);
    };
  }, [children]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    const scrollAmount = direction === "left" ? -(clientWidth - 40) : (clientWidth - 40);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const target = (maxScroll / (items.length - 1)) * index;
    scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col items-center group relative">
      <div className="relative w-full">
        {/* Tombol Panah Kiri (Hanya muncul jika bisa discroll ke kiri) */}
        {showLeft && (
          <button
            onClick={() => scrollByAmount("left")}
            className="flex absolute left-0 sm:-left-5 top-[40%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-card border shadow-lg rounded-full items-center justify-center text-foreground hover:scale-110 transition-all duration-200"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-4 pt-2 px-2 sm:px-4"
        >
          {children}
        </div>

        {/* Tombol Panah Kanan (Hanya muncul jika bisa discroll ke kanan) */}
        {showRight && (
          <button
            onClick={() => scrollByAmount("right")}
            className="flex absolute right-0 sm:-right-5 top-[40%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-card border shadow-lg rounded-full items-center justify-center text-foreground hover:scale-110 transition-all duration-200"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Indikator Titik (HANYA MUNCUL JIKA KONTEN BISA DI-SCROLL / OVERFLOW) */}
      {isScrollable && (
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-3 px-4 w-full max-w-md">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-5 sm:w-6 bg-primary"
                  : "w-1.5 sm:w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
              }`}
              aria-label={`Ke halaman ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ensureLines = (value?: string | string[]) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split("\n").filter(Boolean);
};

const formatInlineText = (text: string) => {
  if (!text) return text;
  let formatted = text;
  formatted = formatted
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  return formatted;
};

const renderDescriptionLines = (
  lines: string[] | string | undefined,
  clamp = false
) => {
  const normalized = ensureLines(lines);
  if (!normalized.length) return null;

  return (
    <div className={`space-y-2 ${clamp ? "line-clamp-3 overflow-hidden" : ""}`}>
      {normalized.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        const cleaned = trimmed
          .replace(/^•\s*/, "")
          .replace(/^\u2022\s*/, "")
          .replace(/^-\s*/, "");

        const isBullet = /^-\s+/.test(trimmed);

        if (isBullet) {
          return (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-[6px] text-[#2563eb] text-base font-semibold leading-none flex-shrink-0">
                •
              </span>
              <p
                className="text-muted-foreground leading-relaxed text-sm"
                dangerouslySetInnerHTML={{
                  __html: formatInlineText(cleaned),
                }}
              />
            </div>
          );
        }

        return (
          <p
            key={index}
            className="text-muted-foreground leading-relaxed text-sm"
            dangerouslySetInnerHTML={{
              __html: formatInlineText(cleaned),
            }}
          />
        );
      })}
    </div>
  );
};

const renderPlainDescription = (text?: string | string[]) => {
  const normalized = ensureLines(text);
  if (!normalized.length) return null;

  return (
    <div className="space-y-2">
      {normalized.map((line, i) => (
        <p
          key={i}
          className="text-muted-foreground text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: formatInlineText(line),
          }}
        />
      ))}
    </div>
  );
};

/* =========================
   CERTIFICATIONS
========================= */

export function CertificationsSection({ data }: { data: PortfolioData }) {
  const [selected, setSelected] = useState<Certification | null>(null);
  const { t } = useLang();

  return (
    <section id="certifications" className="border-b border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">
            <Award className="w-7 h-7 text-primary" />
            {t.certifications}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <NativeScrollWithDots>
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                // Tambahan select-none agar seluruh kartu kebal blok teks biru
                className="card-elevated min-w-[240px] sm:min-w-[300px] max-w-[320px] flex-shrink-0 snap-center overflow-hidden cursor-pointer group hover:-translate-y-1.5 transition-transform duration-200 select-none"
                onClick={() => setSelected(cert)}
              >
                <div className="w-full h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={`Sertifikat ${cert.title} dari ${cert.issuer}`}
                      draggable={false} // Mencegah gambar ikut ditarik (ghost drag)
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Award className="w-12 h-12 text-primary/40" />
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {cert.issuerLogo ? (
                      <img
                        src={cert.issuerLogo}
                        alt={`Logo ${cert.issuer}`}
                        draggable={false}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-primary/60" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        {cert.issuer}
                      </p>

                      {cert.year && (
                        <p className="text-primary text-xs font-semibold mt-1">
                          {cert.year}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    {renderDescriptionLines(cert.description, true)}
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all duration-200">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.viewDetail}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </NativeScrollWithDots>
        </AnimatedSection>
      </div>

      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ""}
        subtitle={[selected?.issuer, selected?.year].filter(Boolean).join(" • ")}
        description={
          Array.isArray(selected?.description)
            ? selected?.description.join("\n")
            : selected?.description
        }
        images={[
          ...(selected?.image ? [selected.image] : []),
          ...(selected?.images || []),
        ]}
      />
    </section>
  );
}

/* =========================
   PROJECTS
========================= */

export function ProjectsSection({ data }: { data: PortfolioData }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const { t } = useLang();

  return (
    <section id="projects" className="bg-card/50 border-b border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">
            <FolderOpen className="w-7 h-7 text-primary" />
            {t.projectsTitle}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <NativeScrollWithDots>
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="card-elevated min-w-[260px] sm:min-w-[340px] max-w-[360px] flex-shrink-0 snap-center overflow-hidden cursor-pointer group hover:-translate-y-1.5 transition-transform duration-200 select-none"
                onClick={() => setSelected(project)}
              >
                <div className="w-full h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`Proyek ${project.title}`}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <FolderOpen className="w-14 h-14 text-primary/30" />
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {project.companyLogo ? (
                      <img
                        src={project.companyLogo}
                        alt={`Logo ${project.company || project.title}`}
                        draggable={false}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border"
                        loading="lazy"
                      />
                    ) : null}

                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground leading-snug">
                        {project.title}
                      </h3>

                      {project.company && (
                        <p className="text-primary text-sm font-semibold mt-1">
                          {project.company}
                        </p>
                      )}

                      {project.year && (
                        <p className="text-muted-foreground text-xs mt-1">
                          {project.year}
                        </p>
                      )}
                    </div>
                  </div>

                  {project.role && (
                    <p className="text-primary text-sm font-semibold mt-3">
                      {project.role}
                    </p>
                  )}

                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tags.map((tag) => (
                        <span key={tag} className="badge-skill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all duration-200">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.viewDetail}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </NativeScrollWithDots>
        </AnimatedSection>
      </div>

      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ""}
        subtitle={[selected?.company, selected?.role, selected?.year].filter(Boolean).join(" • ")}
        description={
          Array.isArray(selected?.description)
            ? selected?.description.join("\n")
            : selected?.description
        }
        images={[
          ...(selected?.image ? [selected.image] : []),
          ...(selected?.images || []),
        ]}
      >
        {selected && selected.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selected.tags.map((tag) => (
              <span key={tag} className="badge-skill">
                {tag}
              </span>
            ))}
          </div>
        )}
      </DetailDialog>
    </section>
  );
}

/* =========================
   VOLUNTEER
========================= */

export function VolunteerSection({ data }: { data: PortfolioData }) {
  const [selected, setSelected] = useState<Volunteer | null>(null);
  const { t } = useLang();

  return (
    <section id="volunteer" className="border-b border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">
            <Heart className="w-7 h-7 text-primary" />
            {t.volunteer}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <NativeScrollWithDots>
            {data.volunteers.map((vol) => (
              <div
                key={vol.id}
                className="card-elevated min-w-[250px] sm:min-w-[340px] max-w-[380px] flex-shrink-0 snap-center overflow-hidden cursor-pointer group hover:-translate-y-1.5 transition-transform duration-200 select-none"
                onClick={() => setSelected(vol)}
              >
                <div className="w-full h-44 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                  {vol.image ? (
                    <img
                      src={vol.image}
                      alt={`Volunteer ${vol.title} di ${vol.organization}`}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Heart className="w-14 h-14 text-primary/30" />
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {vol.organizationLogo ? (
                      <img
                        src={vol.organizationLogo}
                        alt={`Logo ${vol.organization}`}
                        draggable={false}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground leading-snug">
                        {vol.title}
                      </h3>
                      <p className="text-primary text-sm font-semibold mt-1">
                        {vol.organization}
                      </p>

                      {vol.year && (
                        <p className="text-muted-foreground text-xs mt-1">
                          {vol.year}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all duration-200">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.viewDetail}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </NativeScrollWithDots>
        </AnimatedSection>
      </div>

      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ""}
        subtitle={[selected?.organization, selected?.year].filter(Boolean).join(" • ")}
        description={
          Array.isArray(selected?.description)
            ? selected?.description.join("\n")
            : selected?.description
        }
        images={[
          ...(selected?.image ? [selected.image] : []),
          ...(selected?.images || []),
        ]}
      />
    </section>
  );
}

/* =========================
   AWARDS
========================= */

export function AwardsSection({ data }: { data: PortfolioData }) {
  const { t } = useLang();

  return (
    <section id="awards" className="bg-card/50 border-b border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">
            <Trophy className="w-7 h-7 text-primary" />
            {t.awards}
          </h2>
        </AnimatedSection>

        <StaggerContainer className="space-y-4">
          {data.awards.map((award) => (
            <StaggerItem key={award.id}>
              <div className="card-elevated p-5 flex gap-4 items-start hover:translate-x-1.5 transition-transform duration-200">
                {award.issuerLogo ? (
                  <img
                    src={award.issuerLogo}
                    alt={`Logo ${award.issuer}`}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-foreground">{award.title}</h3>
                  <p className="text-primary text-sm font-semibold mt-0.5">
                    {award.issuer}
                  </p>

                  {award.year && (
                    <p className="text-muted-foreground text-xs mt-1">
                      {award.year}
                    </p>
                  )}

                  <div className="mt-2">
                    {renderPlainDescription(award.description)}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* =========================
   SKILLS
========================= */

export function SkillsSection({ data }: { data: PortfolioData }) {
  const { t } = useLang();

  return (
    <section id="skills" className="border-b border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">
            <Wrench className="w-7 h-7 text-primary" />
            {t.skillsTitle}
          </h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-6">
          <AnimatedSection delay={0.1} direction="left">
            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> {t.languages}
              </h3>

              <div className="space-y-3">
                {data.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex justify-between items-center"
                  >
                    <span className="text-foreground font-medium text-sm">
                      {lang.name}
                    </span>
                    <span className="badge-skill">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} direction="right">
            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> {t.technicalSkills}
              </h3>

              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-foreground text-sm font-medium cursor-default hover:scale-105 hover:-translate-y-0.5 transition-transform duration-150"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}