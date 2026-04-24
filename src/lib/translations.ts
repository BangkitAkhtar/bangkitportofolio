import { PortfolioData } from "./data";

export interface ContentTranslations {
  profile: {
    headline: string;
    about: string;
  };
  experiences: Record<string, { description: string[] }>;
  projects: Record<string, { description: string; role: string }>;
  volunteers: Record<string, { description: string }>;
  awards: Record<string, { description: string }>;
  languages: Record<string, { level: string }>;
}

const TRANSLATIONS_KEY = "portfolio_translations_id";

const defaultTranslations: ContentTranslations = {
  profile: {
    headline: "Undergraduate Computer Science Student at BINUS University | Web Developer | Tech Enthusiast",
    about: "Sebagai mahasiswa Computer Science, saya merasa beruntung dapat mengeksplorasi minat saya dalam Web Development dan UI/UX Design. Saya percaya setiap tantangan adalah peluang untuk berkembang, dan saya selalu mencari cara untuk menerapkan pengetahuan saya dalam menciptakan pengalaman digital yang intuitif, user-friendly, dan impactful.",
  },
  experiences: {
    "1": { description: ["Memimpin dan mengawasi operasional keseluruhan serta strategic management dari divisi HIMTI Band"] },
    "2": { description: ["Content generation untuk platform Social Media", "Team Leader untuk tim Instagram Story"] },
    "3": { description: ["Membina kolaborasi dengan organisasi eksternal untuk media partnerships"] },
    "4": { description: ["Membuat Company Profile Website untuk PLN ULTG TANGSEL", "Mengembangkan aplikasi digital guest reception", "Role: Development Team Lead, Frontend Developer, UI/UX Designer"] },
    "5": { description: ["Mempelajari Figma, design thinking, dan teknik prototyping"] },
    "6": { description: ["Mendampingi partisipan internasional dan nasional selama acara kompetisi"] },
  },
  projects: {
    "1": { description: "Mobile app yang dirancang untuk mendukung bisnis UMKM, dibuat sebagai Figma prototype untuk kompetisi desain.", role: "UI/UX Designer" },
    "2": { description: "User research dan interface design yang komprehensif untuk platform advertising management.", role: "UI/UX Designer" },
  },
  volunteers: {
    "1": { description: "Mengedukasi masyarakat tentang pengelolaan sampah dan prinsip 5R (Reduce, Reuse, Recycle, Replace, Replant)." },
    "2": { description: "Bakti sosial di panti asuhan, mengajarkan anak-anak tentang pemilahan sampah yang benar dan tanggung jawab lingkungan." },
  },
  awards: {
    "1": { description: "Penghargaan untuk final project terbaik menggunakan Laravel, PHP, dan MySQL dalam membangun digital library system yang lengkap." },
    "2": { description: "Menerima predikat tertinggi dalam ujian kompetensi akhir." },
  },
  languages: {
    "Bahasa Indonesia": { level: "Bahasa Ibu" },
    "English": { level: "Kemampuan Kerja Terbatas" },
  },
};

export function getTranslations(): ContentTranslations {
  try {
    const stored = localStorage.getItem(TRANSLATIONS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultTranslations, ...parsed };
    }
  } catch {}
  return defaultTranslations;
}

export function saveTranslations(translations: ContentTranslations): void {
  localStorage.setItem(TRANSLATIONS_KEY, JSON.stringify(translations));
}

// 🔥 INI ADALAH BAGIAN YANG SAYA PERBAIKI 🔥
export function translateData(data: PortfolioData, lang: "en" | "id"): PortfolioData {
  if (lang === "en") return data;

  // Prioritaskan mengambil dari data.translations (API) 
  // Jika API kosong, fallback ke getTranslations() lokal agar tidak error
  const apiTranslations = data.translations && Object.keys(data.translations).length > 0 
    ? data.translations 
    : getTranslations();

  // Gabungkan dengan defaultTranslations agar struktur datanya terjamin aman
  const t: ContentTranslations = {
    ...defaultTranslations,
    ...apiTranslations,
    profile: { ...defaultTranslations.profile, ...(apiTranslations.profile || {}) },
    experiences: { ...defaultTranslations.experiences, ...(apiTranslations.experiences || {}) },
    projects: { ...defaultTranslations.projects, ...(apiTranslations.projects || {}) },
    volunteers: { ...defaultTranslations.volunteers, ...(apiTranslations.volunteers || {}) },
    awards: { ...defaultTranslations.awards, ...(apiTranslations.awards || {}) },
    languages: { ...defaultTranslations.languages, ...(apiTranslations.languages || {}) },
  };

  return {
    ...data,
    profile: {
      ...data.profile,
      headline: t.profile?.headline || data.profile.headline,
      about: t.profile?.about || data.profile.about,
    },
    experiences: data.experiences.map((exp) => {
      const tr = t.experiences?.[exp.id];
      return tr ? { ...exp, description: tr.description || exp.description } : exp;
    }),
    projects: data.projects.map((proj) => {
      const tr = t.projects?.[proj.id];
      return tr ? { ...proj, description: tr.description || proj.description, role: tr.role || proj.role } : proj;
    }),
    volunteers: data.volunteers.map((vol) => {
      const tr = t.volunteers?.[vol.id];
      return tr ? { ...vol, description: tr.description || vol.description } : vol;
    }),
    awards: data.awards.map((award) => {
      const tr = t.awards?.[award.id];
      return tr ? { ...award, description: tr.description || award.description } : award;
    }),
    languages: data.languages.map((lang) => {
      const tr = t.languages?.[lang.name];
      return tr ? { ...lang, level: tr.level || lang.level } : lang;
    }),
  };
}