import { useState, useEffect, useMemo } from "react";
import { getData, PortfolioData, DEFAULT_SECTION_ORDER, defaultData } from "@/lib/data";
import { HeroSection } from "@/components/HeroSection";
import { lazy, Suspense } from "react";

const AboutSection = lazy(() => import("@/components/AboutSection").then(m => ({ default: m.AboutSection })));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection").then(m => ({ default: m.ExperienceSection })));
const EducationSection = lazy(() => import("@/components/EducationSection").then(m => ({ default: m.EducationSection })));
const CertificationsSection = lazy(() => import("@/components/PortfolioSections").then(m => ({ default: m.CertificationsSection })));
const TrainingsSection = lazy(() => import("@/components/PortfolioSections").then(m => ({ default: m.TrainingsSection })));
const ProjectsSection = lazy(() => import("@/components/PortfolioSections").then(m => ({ default: m.ProjectsSection })));
const VolunteerSection = lazy(() => import("@/components/PortfolioSections").then(m => ({ default: m.VolunteerSection })));
const AwardsSection = lazy(() => import("@/components/PortfolioSections").then(m => ({ default: m.AwardsSection })));
const SkillsSection = lazy(() => import("@/components/PortfolioSections").then(m => ({ default: m.SkillsSection })));
const ContactSection = lazy(() => import("@/components/ContactSection").then(m => ({ default: m.ContactSection })));
import { BackToTop } from "@/components/BackToTop";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { translateData } from "@/lib/translations";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";

const Index = () => {
  const { data: rawData } = useQuery({ queryKey: ["portfolio"], queryFn: getData });
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, lang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const data = useMemo(() => translateData(rawData || defaultData, lang), [rawData, lang]);

  // Gate SELURUH halaman di belakang kesiapan data, supaya transisi loading -> selesai
  // adalah SATU swap utuh (bukan hero duluan lalu section+footer menyusul belakangan).
  // Render sebagian (hero instan, section menyusul) terbukti memicu CLS besar karena
  // puluhan elemen (section + gambar) tiba-tiba disisipkan sekaligus pertengahan.
  // Arsitektur "semua sekaligus" ini yang sebelumnya terbukti CLS 0 / skor 87 mobile.
  if (!rawData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Memuat...</p>
      </div>
    );
  }

  const sectionsMap: Record<string, JSX.Element> = {
    about: <AboutSection data={data} key="about" />,
    experiences: <ExperienceSection data={data} key="experiences" />,
    education: <EducationSection data={data} key="education" />,
    certifications: <CertificationsSection data={data} key="certifications" />,
    trainings: <TrainingsSection data={data} key="trainings" />,
    projects: <ProjectsSection data={data} key="projects" />,
    volunteers: <VolunteerSection data={data} key="volunteers" />,
    awards: <AwardsSection data={data} key="awards" />,
    skills: <SkillsSection data={data} key="skills" />,
  };

  const sectionOrder = data.sectionOrder || DEFAULT_SECTION_ORDER;

  const navItems = [
    { label: t.about, href: "#about" },
    { label: t.experience, href: "#experience" },
    { label: t.education, href: "#education" },
    { label: t.projects, href: "#projects" },
    { label: t.skills, href: "#skills" },
    { label: t.contact, href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${data.profile.name} | Portfolio`} 
        description={data.profile.headline} 
      />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-card/50 backdrop-blur-sm"
        }`}
      >
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-extrabold text-foreground text-sm tracking-tight hover:scale-105 transition-transform cursor-pointer bg-transparent border-none p-0"
          >
            {data.profile.name}
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5"
              >
                {item.label}
              </a>
            ))}
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <button
              className="text-foreground"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label={mobileNav ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileNav}
            >
              {mobileNav ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {mobileNav && (
          <div className="sm:hidden border-t border-border bg-card/95 backdrop-blur-xl animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileNav(false);
                    const id = item.href.replace("#", "");
                    setTimeout(() => {
                      document
                        .getElementById(id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 150);
                  }}
                  className="block text-muted-foreground hover:text-foreground hover:bg-secondary/50 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="h-14" />
      
      <main>
        <HeroSection data={data} />
        <Suspense fallback={null}>
          <AboutSection data={data} />
          {sectionOrder.map((key) => sectionsMap[key] || null)}
          <ContactSection />
        </Suspense>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {data.profile.name} · {t.madeWith}
          </p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
};

export default Index;