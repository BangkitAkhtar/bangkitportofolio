import { UserCircle, Quote } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { PortfolioData } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function AboutSection({ data }: { data: PortfolioData }) {
  const { t } = useLang();
  return (
    <section id="about" className="border-b border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">
            <UserCircle className="w-7 h-7 text-primary" />
            {t.aboutMe}
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="relative card-elevated p-6 sm:p-8 hover:scale-[1.01] transition-transform duration-300">
            <Quote className="w-8 h-8 text-primary/20 absolute top-4 left-4" />
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg pl-6 italic">{data.profile.about}</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
