import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "id";

const translations = {
  en: {
    about: "About",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    location: "Tangerang Selatan, Indonesia",
    contactMe: "Contact Me",
    downloadCv: "Download CV",
    aboutMe: "About Me ✨",
    experienceTitle: "Experience 💼",
    photos: "photo",
    photosPlural: "photos",
    educationTitle: "Education 🎓",
    certifications: "Certifications 📜",
    trainings: "Training and Courses 📚",
    viewDetail: "View Detail",
    projectsTitle: "Projects 🚀",
    volunteer: "Volunteer Work 💖",
    awards: "Awards & Honors 🏆",
    skillsTitle: "Skills & Languages 🛠️",
    languages: "Languages",
    technicalSkills: "Technical Skills",
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
    trainings: "Pelatihan dan Kursus 📚",
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
  lang: "id",
  setLang: () => {},
  t: translations.id,
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Ambil bahasa dari localStorage jika ada, jika tidak default ke "id"
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("ui_language") as Lang;
      if (savedLang === "en" || savedLang === "id") return savedLang;
    }
    return "id";
  });

  // Fungsi khusus untuk set bahasa sekaligus menyimpan ke localStorage
  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ui_language", newLang);
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}