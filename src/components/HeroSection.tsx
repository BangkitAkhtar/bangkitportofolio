import { User, Linkedin, Mail, MapPin, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingElement } from "./AnimatedSection";
import { PortfolioData } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import defaultProfilePhoto from "@/assets/profile-photo.jpeg";

export function HeroSection({ data }: { data: PortfolioData }) {
  const { profile } = data;
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center" style={{ background: "var(--gradient-hero)" }}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <motion.div animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <motion.div animate={{ x: [0, 15, 0], y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <FloatingElement className="absolute top-20 right-[20%] text-primary/30" duration={4}><Sparkles className="w-6 h-6" /></FloatingElement>
      <FloatingElement className="absolute bottom-32 left-[15%] text-primary/20" duration={5}><div className="w-3 h-3 rounded-full bg-primary/30" /></FloatingElement>
      <FloatingElement className="absolute top-[40%] right-[10%] text-primary/20" duration={3.5}><div className="w-2 h-2 rounded-full bg-primary/40" /></FloatingElement>

      <div className="section-container relative z-10 py-20 sm:py-28">
        <div className="flex flex-col items-center text-center gap-8">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 p-1 overflow-hidden">
              <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-200 cursor-pointer">

                {profile.image ? <img src={profile.image} alt={`Foto profil ${profile.name}`} className="w-full h-full object-cover" /> : <img src={defaultProfilePhoto} alt={`Foto profil ${profile.name}`} className="w-full h-full object-cover" />}
              </div>
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }} className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg shadow-lg">👋</motion.div>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground tracking-tight">{profile.name}</h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed px-2">{profile.headline}</p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4" /><span className="text-sm">{t.location}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Mail className="w-4 h-4" /><span className="text-sm">bangkitfahd@gmail.com</span>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="flex flex-col sm:flex-row items-center gap-3">
            <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(217,91%,50%)] to-[hsl(217,91%,60%)] text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </motion.a>
            {profile.cvLink && (
              <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} href={profile.cvLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(200,80%,45%)] to-[hsl(190,75%,50%)] text-primary-foreground font-semibold text-sm shadow-lg shadow-[hsl(195,70%,45%)]/25 hover:shadow-xl hover:shadow-[hsl(195,70%,45%)]/30 transition-shadow">
                <Download className="w-4 h-4" /> {t.downloadCv}
              </motion.a>
            )}
            <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[hsl(222,47%,11%)] font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow border border-border">
              <Mail className="w-4 h-4" /> {t.contactMe}
            </motion.a>
          </motion.div>
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
