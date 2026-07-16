import axios from "axios";

/* =========================
   TYPES
========================= */

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  dateRange: string;
  location: string;
  description: string[];
  skills: string[];
  images: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  dateRange: string;
  focus: string[];
  logo: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  year: string;
  description: string;
  image: string;
  images: string[];
}

export interface Training {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  year: string;
  description: string;
  image: string;
  images: string[];
}

export interface Project {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  year: string;
  description: string;
  role: string;
  image: string;
  tags: string[];
  images: string[];
}

export interface Volunteer {
  id: string;
  title: string;
  organization: string;
  organizationLogo: string;
  year: string;
  description: string;
  image: string;
  images: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  year: string;
  description: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    headline: string;
    about: string;
    image: string;
    linkedin: string;
    github: string;
    email: string;
    cvLink: string;
  };
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  trainings: Training[];
  projects: Project[];
  volunteers: Volunteer[];
  awards: Award[];
  skills: string[];
  languages: { name: string; level: string }[];
  translations?: any; // siap untuk API nanti
  sectionOrder?: string[];
}

export const DEFAULT_SECTION_ORDER = [
  "experiences",
  "education",
  "certifications",
  "trainings",
  "projects",
  "volunteers",
  "awards",
  "skills",
];

/* =========================
   DEFAULT DATA
========================= */

export const defaultData: PortfolioData = {
  profile: {
    name: "Bangkit Akhtar Fahd",
    headline:
      "Undergraduate Computer Science Student at BINUS University | Web Developer | Tech Enthusiast",
    about:
      "As a Computer Science student, I feel fortunate to be exploring my passion for Web Development and UI/UX Design.",
    image: "",
    linkedin: "https://www.linkedin.com/in/bangkit-akhtar-fahd-a8296b287/",
    github: "https://github.com",
    email: "bangkitfahd@gmail.com",
    cvLink: "",
  },

  experiences: [],

  education: [],

  certifications: [
    {
      id: "1",
      title: "",
      issuer: "",
      issuerLogo: "",
      year: "",
      description: "",
      image: "",
      images: [],
    },
  ],

  trainings: [
    {
      id: "1",
      title: "",
      issuer: "",
      issuerLogo: "",
      year: "",
      description: "",
      image: "",
      images: [],
    },
  ],

  projects: [
    {
      id: "1",
      title: "",
      company: "",
      companyLogo: "",
      year: "",
      description: "",
      role: "",
      image: "",
      tags: [],
      images: [],
    },
  ],

  volunteers: [
    {
      id: "1",
      title: "",
      organization: "",
      organizationLogo: "",
      year: "",
      description: "",
      image: "",
      images: [],
    },
  ],

  awards: [
    {
      id: "1",
      title: "",
      issuer: "",
      issuerLogo: "",
      year: "",
      description: "",
    },
  ],

  skills: [],
  languages: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
};

/* =========================
   MIGRATE DATA (🔥 FIXED)
========================= */

function migrateData(stored: any): PortfolioData {
  if (stored.experiences) {
    stored.experiences = stored.experiences.map((e: any) => ({
      ...e,
      companyLogo: e.companyLogo || "",
      dateRange: e.dateRange || "",
      location: e.location || "",
      description: Array.isArray(e.description) ? e.description : [],
      skills: Array.isArray(e.skills) ? e.skills : [],
      images: Array.isArray(e.images) ? e.images : [],
    }));
  }

  if (stored.education) {
    stored.education = stored.education.map((e: any) => ({
      ...e,
      logo: e.logo || "",
      dateRange: e.dateRange || "",
      focus: Array.isArray(e.focus) ? e.focus : [],
    }));
  }

  if (stored.certifications) {
    stored.certifications = stored.certifications.map((c: any) => ({
      ...c,
      issuerLogo: c.issuerLogo || "",
      year: c.year || "",
      description: c.description || "",
      image: c.image || "",
      images: Array.isArray(c.images) ? c.images : [],
    }));
  }

  if (stored.trainings) {
    stored.trainings = stored.trainings.map((t: any) => ({
      ...t,
      issuerLogo: t.issuerLogo || "",
      year: t.year || "",
      description: t.description || "",
      image: t.image || "",
      images: Array.isArray(t.images) ? t.images : [],
    }));
  }

  if (stored.projects) {
    stored.projects = stored.projects.map((p: any) => ({
      ...p,
      company: p.company || "",
      companyLogo: p.companyLogo || "",
      year: p.year || "",
      description: p.description || "",
      role: p.role || "",
      image: p.image || "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      images: Array.isArray(p.images) ? p.images : [],
    }));
  }

  if (stored.volunteers) {
    stored.volunteers = stored.volunteers.map((v: any) => ({
      ...v,
      organizationLogo: v.organizationLogo || "",
      year: v.year || "",
      description: v.description || "",
      image: v.image || "",
      images: Array.isArray(v.images) ? v.images : [],
    }));
  }

  if (stored.awards) {
    stored.awards = stored.awards.map((a: any) => ({
      ...a,
      issuerLogo: a.issuerLogo || "",
      year: a.year || "",
      description: a.description || "",
    }));
  }

  if (stored.profile) {
    stored.profile = {
      ...defaultData.profile,
      ...stored.profile,
      cvLink: stored.profile.cvLink || "",
    };
  }

  stored.skills = Array.isArray(stored.skills) ? stored.skills : [];
  stored.languages = Array.isArray(stored.languages)
    ? stored.languages
    : [];

  stored.translations = stored.translations || {};
  stored.sectionOrder = stored.sectionOrder || DEFAULT_SECTION_ORDER;
  // Fallback if 'about' was accidentally saved in previous version
  if (stored.sectionOrder) {
    stored.sectionOrder = stored.sectionOrder.filter((k: string) => k !== "about");
  }

  return {
    ...defaultData,
    ...stored,
  };
}

/* =========================
   API
========================= */

const API_BASE = import.meta.env.VITE_API_URL || "https://api.bangkitakhtar.com/api";

export async function getData(): Promise<PortfolioData> {
  try {
    const res = await axios.get(`${API_BASE}/portfolio`, { timeout: 10000 });
    return migrateData(res.data);
  } catch (err) {
    console.error("Fetch error:", err);
    return defaultData;
  }
}

export async function saveData(data: PortfolioData): Promise<void> {
  try {
    const token = sessionStorage.getItem("admin_session_token");
    await axios.post(`${API_BASE}/portfolio`, data, {
      timeout: 15000,
      headers: {
        "X-Admin-Token": token || ""
      }
    });
  } catch (err) {
    console.error("Save error:", err);
    throw err;
  }
}

export function resetData(): void {
  console.warn("Reset disabled in API mode.");
}

export interface Profile {
  name: string;
  headline: string;
  headline_en?: string; // Tambahkan _en untuk bahasa Inggris
  email: string;
  linkedin: string;
  cvLink: string;
  image: string;
  about: string;
  about_en?: string;    // Tambahkan _en untuk bahasa Inggris
}