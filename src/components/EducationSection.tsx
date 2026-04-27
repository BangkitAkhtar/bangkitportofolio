import { GraduationCap, School } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { PortfolioData } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function EducationSection({ data }: { data: PortfolioData }) {
  const { t } = useLang();
  return (
    <section id="education" className="border-b border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">
            <GraduationCap className="w-7 h-7 text-primary" />
            {t.educationTitle}
          </h2>
        </AnimatedSection>
        <StaggerContainer className="space-y-0">
          {data.education.map((edu) => (
            <StaggerItem key={edu.id}>
              <div className="timeline-card">
                <div className="timeline-dot" />
                <div className="card-elevated p-5 sm:p-6 hover:translate-x-1 transition-transform duration-200">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden hover:rotate-[-5deg] hover:scale-110 transition-transform duration-200">
                      {edu.logo ? <img loading="lazy" src={edu.logo} alt={edu.school} className="w-full h-full object-cover" /> : <School className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base sm:text-lg">{edu.school}</h3>
                      <p className="text-primary font-semibold text-sm">{edu.degree} · {edu.field}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{edu.dateRange}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {edu.focus.map((f) => (
                          <span key={f} className="badge-skill hover:scale-110 transition-transform duration-150">{f}</span>
                        ))}
                      </div>
                    </div>
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
