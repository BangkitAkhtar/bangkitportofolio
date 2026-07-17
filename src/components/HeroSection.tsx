import { Linkedin, Mail, MapPin, Sparkles, Download } from "lucide-react";
import { PortfolioData } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import defaultProfilePhoto from "@/assets/profile-photo.webp";

export function HeroSection({ data }: { data: PortfolioData }) {
  const { profile } = data;
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center" style={{ background: "var(--gradient-hero)" }}>
      {/* Animated background blobs — CSS/compositor (motion-reduce aman) */}
      <div className="absolute inset-0 overflow-hidden motion-reduce:hidden" aria-hidden="true">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/15 blur-3xl animate-blob" style={{ animationDuration: "10s", animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-blob" style={{ animationDuration: "6s", animationDelay: "-4s" }} />
      </div>

      {/* Floating decorations */}
      <div className="absolute top-20 right-[20%] text-primary/30 animate-float motion-reduce:animate-none" aria-hidden="true"><Sparkles className="w-6 h-6" /></div>
      <div className="absolute bottom-32 left-[15%] text-primary/20 animate-float motion-reduce:animate-none" style={{ animationDuration: "5s" }} aria-hidden="true"><div className="w-3 h-3 rounded-full bg-primary/30" /></div>
      <div className="absolute top-[40%] right-[10%] text-primary/20 animate-float motion-reduce:animate-none" style={{ animationDuration: "3.5s" }} aria-hidden="true"><div className="w-2 h-2 rounded-full bg-primary/40" /></div>

      <div className="section-container relative z-10 py-20 sm:py-28">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Foto = elemen LCP → render seketika, tanpa fade opacity yang menunda LCP */}
          <div className="relative">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 p-1 overflow-hidden">
              <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-200 cursor-pointer">

                {profile.image ? <img fetchPriority="high" src={profile.image} alt={`Foto profil ${profile.name}`} className="w-full h-full object-cover" /> : <img fetchPriority="high" src={defaultProfilePhoto} alt={`Foto profil ${profile.name}`} className="w-full h-full object-cover" />}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg shadow-lg animate-scale-in" style={{ animationDelay: "0.5s" }}>👋</div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground tracking-tight">{profile.name}</h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed px-2">{profile.headline}</p>
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <MapPin className="w-4 h-4" /><span className="text-sm">{t.location}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground animate-fade-in" style={{ animationDelay: "0.65s" }}>
              <Mail className="w-4 h-4" /><span className="text-sm">bangkitfahd@gmail.com</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(217,91%,50%)] to-[hsl(217,91%,60%)] text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
            {profile.cvLink && (
              <a href={profile.cvLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(200,80%,45%)] to-[hsl(190,75%,50%)] text-primary-foreground font-semibold text-sm shadow-lg shadow-[hsl(195,70%,45%)]/25 hover:shadow-xl hover:shadow-[hsl(195,70%,45%)]/30 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all">
                <Download className="w-4 h-4" /> {t.downloadCv}
              </a>
            )}
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[hsl(222,47%,11%)] font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all border border-border">
              <Mail className="w-4 h-4" /> {t.contactMe}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 26C672 32 768 40 864 42C960 44 1056 40 1152 34C1248 28 1344 20 1392 16L1440 12V60H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}
