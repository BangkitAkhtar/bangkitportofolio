import { useState, useEffect, useMemo } from "react";
import { getData, PortfolioData } from "@/lib/data";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import {
  CertificationsSection,
  ProjectsSection,
  VolunteerSection,
  AwardsSection,
  SkillsSection,
} from "@/components/PortfolioSections";
import { ContactSection } from "@/components/ContactSection";
import { BackToTop } from "@/components/BackToTop";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { translateData } from "@/lib/translations";
import { SEO } from "@/components/SEO";

const Index = () => {
  const [rawData, setRawData] = useState<PortfolioData | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, lang } = useLang();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const result = await getData();
        setRawData(result);
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    const handler = async () => {
      try {
        const result = await getData();
        setRawData(result);
      } catch (error) {
        console.error("Failed to refresh portfolio data:", error);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const data = useMemo(() => {
    if (!rawData) return null;
    return translateData(rawData, lang);
  }, [rawData, lang]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading portfolio...</p>
      </div>
    );
  }

  const navItems = [
    { label: t.about, href: "#about" },
    { label: t.experience, href: "#experience" },
    { label: t.education, href: "#education" },
    { label: t.projects, href: "#projects" },
    { label: t.skills, href: "#skills" },
    { label: t.contact, href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEO 
        title={`${data.profile.name} | Portfolio`} 
        description={data.profile.headline} 
      />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-card/50 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
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
            >
              {mobileNav ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

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
      </nav>

      <div className="h-14" />
      <HeroSection data={data} />
      <AboutSection data={data} />
      <ExperienceSection data={data} />
      <EducationSection data={data} />
      <CertificationsSection data={data} />
      <ProjectsSection data={data} />
      <VolunteerSection data={data} />
      <AwardsSection data={data} />
      <SkillsSection data={data} />
      <ContactSection />

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