import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "id";

const translations = {
  en: {
    // Nav
    about: "About",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    // Hero
    location: "Tangerang Selatan, Indonesia",
    contactMe: "Contact Me",
    downloadCv: "Download CV",
    // About
    aboutMe: "About Me ✨",
    // Experience
    experienceTitle: "Experience 💼",
    photos: "photo",
    photosPlural: "photos",
    // Education
    educationTitle: "Education 🎓",
    // Certifications
    certifications: "Certifications 📜",
    viewDetail: "View Detail",
    // Projects
    projectsTitle: "Projects 🚀",
    // Volunteer
    volunteer: "Volunteer Work 💖",
    // Awards
    awards: "Awards & Honors 🏆",
    // Skills
    skillsTitle: "Skills & Languages 🛠️",
    languages: "Languages",
    technicalSkills: "Technical Skills",
    // Contact
    contactTitle: "Contact Me",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    sendMessage: "Send Message",
    sending: "Sending...",
    sent: "Sent!",
    spamProtected: "Protected against spam",
    namePlaceholder: "Your name",
    emailPlaceholder: "your@email.com",
    subjectPlaceholder: "Subject",
    messagePlaceholder: "Write your message...",
    toastSuccess: "Message Sent! 🎉",
    toastSuccessDesc: "Thank you for reaching out. I will reply to your message soon.",
    toastError: "Failed to Send Message 😥",
    toastErrorDesc: "An error occurred. Please try again later.",
    toastRateLimit: "Too fast! ⏳",
    toastRateLimitDesc: (secs: number) => `Wait ${secs} more seconds before sending another message.`,
    // Footer
    madeWith: "Made with 💙",
  },
  id: {
    about: "Tentang",
    experience: "Pengalaman",
    education: "Pendidikan",
    projects: "Proyek",
    skills: "Keahlian",
    contact: "Kontak",
    location: "Tangerang Selatan, Indonesia",
    contactMe: "Hubungi Saya",
    downloadCv: "Unduh CV",
    aboutMe: "Tentang Saya ✨",
    experienceTitle: "Pengalaman 💼",
    photos: "foto",
    photosPlural: "foto",
    educationTitle: "Pendidikan 🎓",
    certifications: "Sertifikasi 📜",
    viewDetail: "Lihat Detail",
    projectsTitle: "Proyek 🚀",
    volunteer: "Kegiatan Sukarela 💖",
    awards: "Penghargaan 🏆",
    skillsTitle: "Keahlian & Bahasa 🛠️",
    languages: "Bahasa",
    technicalSkills: "Keahlian Teknis",
    contactTitle: "Hubungi Saya",
    name: "Nama",
    email: "Email",
    subject: "Subjek",
    message: "Pesan",
    sendMessage: "Kirim Pesan",
    sending: "Mengirim...",
    sent: "Terkirim!",
    spamProtected: "Dilindungi dari spam",
    namePlaceholder: "Nama kamu",
    emailPlaceholder: "email@kamu.com",
    subjectPlaceholder: "Subjek",
    messagePlaceholder: "Tulis pesan kamu...",
    toastSuccess: "Pesan Terkirim! 🎉",
    toastSuccessDesc: "Terima kasih sudah menghubungi. Saya akan segera membalas pesan kamu.",
    toastError: "Gagal Mengirim Pesan 😥",
    toastErrorDesc: "Terjadi kesalahan. Silakan coba lagi nanti.",
    toastRateLimit: "Terlalu cepat! ⏳",
    toastRateLimitDesc: (secs: number) => `Tunggu ${secs} detik lagi sebelum mengirim pesan berikutnya.`,
    madeWith: "Dibuat dengan 💙",
  },
} as const;

type Translations = {
  [K in keyof typeof translations.en]: (typeof translations.en)[K] extends (...args: any[]) => any
    ? (typeof translations.en)[K]
    : string;
};

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
