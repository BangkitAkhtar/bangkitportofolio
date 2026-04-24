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
      // Cegah jika hasil parse berupa null
      return parsed ? { ...defaultTranslations, ...parsed } : defaultTranslations;
    }
  } catch (e) {
    console.warn("Gagal membaca localStorage terjemahan", e);
  }
  return defaultTranslations;
}

export function saveTranslations(translations: ContentTranslations): void {
  localStorage.setItem(TRANSLATIONS_KEY, JSON.stringify(translations));
}

export function translateData(data: PortfolioData, lang: "en" | "id"): PortfolioData {
  // Jika sedang bahasa inggris, tidak perlu translasi
  if (lang === "en") return data;

  // 1. Ekstrak data terjemahan API dengan sangat hati-hati
  let apiTrans = data?.translations;
  
  // Jika apiTrans bernilai null, undefined, atau berupa array kosong (kasus sering terjadi di Laravel), pakai local
  if (!apiTrans || typeof apiTrans !== "object" || Array.isArray(apiTrans)) {
    apiTrans = getTranslations() || {};
  }

  // 2. Validasi setiap keys agar tidak ada yang bernilai "null" atau "undefined" 
  // (Jika null, fallback ke default)
  const tProfile = apiTrans.profile || defaultTranslations.profile || {};
  const tExperiences = apiTrans.experiences || defaultTranslations.experiences || {};
  const tProjects = apiTrans.projects || defaultTranslations.projects || {};
  const tVolunteers = apiTrans.volunteers || defaultTranslations.volunteers || {};
  const tAwards = apiTrans.awards || defaultTranslations.awards || {};
  const tLanguages = apiTrans.languages || defaultTranslations.languages || {};

  // Validasi data profil asli juga
  const safeProfile = data?.profile || {};

  // 3. Mapping data dengan aman
  return {
    ...data,
    profile: {
      ...safeProfile,
      headline: tProfile.headline || safeProfile.headline || "",
      about: tProfile.about || safeProfile.about || "",
    },
    experiences: (data?.experiences || []).map((exp) => {
      if (!exp || !exp.id) return exp;
      const tr = tExperiences[exp.id];
      return tr ? { ...exp, description: tr.description || exp.description } : exp;
    }),
    projects: (data?.projects || []).map((proj) => {
      if (!proj || !proj.id) return proj;
      const tr = tProjects[proj.id];
      return tr ? { ...proj, description: tr.description || proj.description, role: tr.role || proj.role } : proj;
    }),
    volunteers: (data?.volunteers || []).map((vol) => {
      if (!vol || !vol.id) return vol;
      const tr = tVolunteers[vol.id];
      return tr ? { ...vol, description: tr.description || vol.description } : vol;
    }),
    awards: (data?.awards || []).map((award) => {
      if (!award || !award.id) return award;
      const tr = tAwards[award.id];
      return tr ? { ...award, description: tr.description || award.description } : award;
    }),
    languages: (data?.languages || []).map((langItem) => {
      if (!langItem || !langItem.name) return langItem;
      const tr = tLanguages[langItem.name];
      return tr ? { ...langItem, level: tr.level || langItem.level } : langItem;
    }),
  };
}