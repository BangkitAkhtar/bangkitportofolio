import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getData,
  saveData,
  PortfolioData,
  Experience,
  Project,
  Certification,
  Volunteer,
  Award,
  Education,
} from "@/lib/data";
import {
  getTranslations,
  saveTranslations,
  ContentTranslations,
} from "@/lib/translations";
import { uploadFile } from "@/lib/fileUpload";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Briefcase,
  GraduationCap,
  Award as AwardIcon,
  FolderOpen,
  Heart,
  Trophy,
  Wrench,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Menu,
  X,
  Upload,
  ChevronUp,
  ChevronDown,
  Languages,
  KeyRound,
  Moon,
  Sun,
  Bold,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";
import { changePassword, isSessionValid, clearSession } from "@/lib/adminAuth";
import { useTheme } from "next-themes";

// 👇 HELPER BARU: Untuk memastikan path gambar selalu valid dengan API kamu
const getImageUrl = (path: string) => {
  if (!path) return "";
  
  // 1. Paksa ubah jika API tidak sengaja mengirimkan URL localhost
  if (path.includes("localhost") || path.includes("127.0.0.1")) {
    path = path.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, "https://api.bangkitakhtar.com");
  }

  // 2. Jika sudah full URL yang benar (mengandung http/https/data), kembalikan utuh
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // 3. Bersihkan slash "/" di bagian paling depan jika ada
  let cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // 4. Jika Laravel mengembalikan path seperti "uploads/..." tanpa "/storage/", kita pakaikan otomatis
  if (!cleanPath.startsWith("storage/")) {
    cleanPath = `storage/${cleanPath}`;
  }

  return `https://api.bangkitakhtar.com/${cleanPath}`;
};

function ThemeToggleAdmin() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

type Section =
  | "profile"
  | "experiences"
  | "education"
  | "certifications"
  | "projects"
  | "volunteers"
  | "awards"
  | "skills"
  | "translations"
  | "security";

const sidebarItems: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "experiences", label: "Experiences", icon: Briefcase },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "certifications", label: "Certifications", icon: AwardIcon },
  { key: "projects", label: "Projects", icon: FolderOpen },
  { key: "volunteers", label: "Volunteer", icon: Heart },
  { key: "awards", label: "Awards", icon: Trophy },
  { key: "skills", label: "Skills", icon: Wrench },
  { key: "translations", label: "Translations 🇮🇩", icon: Languages },
  { key: "security", label: "Security", icon: KeyRound },
];

type TranslationSubSection =
  | "profile"
  | "experiences"
  | "projects"
  | "volunteers"
  | "awards"
  | "languages";

function RichTextEditor({
  label,
  value,
  onChange,
  inputClass,
  labelClass,
  rows = 5,
  id,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  inputClass: string;
  labelClass: string;
  rows?: number;
  id?: string;
}) {
  const editorId = `editor-${id || label.replace(/\s+/g, "-").toLowerCase()}`;

  const wrapSelection = (tagStart: string, tagEnd: string = "") => {
    const textarea = document.getElementById(
      editorId
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const newValue =
      value.slice(0, start) +
      tagStart +
      selected +
      tagEnd +
      value.slice(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = end;
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = document.getElementById(
      editorId
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);

    const selectedText = selected || "Item";
    const lines = selectedText.split("\n");
    const formatted = lines.map((line, i) => {
      if (prefix === "1. ") return `${i + 1}. ${line.replace(/^\d+\.\s*/, "")}`;
      return `${prefix}${line.replace(/^-\s*/, "")}`;
    }).join("\n");

    const newValue = before + formatted + after;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="flex items-center gap-1.5 mb-2 p-2 rounded-xl border bg-card w-fit">
        <button
          type="button"
          onClick={() => wrapSelection("**", "**")}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => wrapSelection("*", "*")}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertLinePrefix("- ")}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertLinePrefix("1. ")}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <textarea
        id={editorId}
        className={`${inputClass} min-h-[120px]`}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className="text-xs text-muted-foreground mt-2">
        Format: <code>**bold**</code>, <code>*italic*</code>,{" "}
        <code>- bullet</code>, <code>1. numbered</code>
      </p>
    </div>
  );
}

function TranslationsEditor({
  tData,
  tTranslations,
  tSetTranslations,
  tInputClass,
  tLabelClass,
}: {
  tData: PortfolioData;
  tTranslations: ContentTranslations;
  tSetTranslations: React.Dispatch<React.SetStateAction<ContentTranslations>>;
  tInputClass: string;
  tLabelClass: string;
}) {
  const [sub, setSub] = useState<TranslationSubSection>("profile");

  const subTabs: { key: TranslationSubSection; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "experiences", label: `Experiences (${tData.experiences.length})` },
    { key: "projects", label: `Projects (${tData.projects.length})` },
    { key: "volunteers", label: `Volunteer (${tData.volunteers.length})` },
    { key: "awards", label: `Awards (${tData.awards.length})` },
    { key: "languages", label: `Languages (${tData.languages.length})` },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">
        🇮🇩 Indonesian Translations
      </h2>
      <p className="text-sm text-muted-foreground">
        Edit terjemahan Bahasa Indonesia. Kosongkan field jika ingin
        menggunakan teks English asli.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSub(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sub === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {sub === "profile" && (
        <div className="card-elevated w-full p-6 space-y-4">
          <div>
            <label className={tLabelClass}>Headline (ID)</label>
            <input
              className={tInputClass}
              value={tTranslations.profile.headline}
              onChange={(e) =>
                tSetTranslations({
                  ...tTranslations,
                  profile: {
                    ...tTranslations.profile,
                    headline: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={tLabelClass}>About (ID)</label>
            <textarea
              className={`${tInputClass} min-h-[100px]`}
              value={tTranslations.profile.about}
              onChange={(e) =>
                tSetTranslations({
                  ...tTranslations,
                  profile: { ...tTranslations.profile, about: e.target.value },
                })
              }
            />
          </div>
        </div>
      )}

      {sub === "experiences" && (
        <div className="space-y-3">
          {tData.experiences.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Belum ada experience. Tambahkan di section Experiences dulu.
            </p>
          )}
          {tData.experiences.map((exp) => (
            <div key={exp.id} className="card-elevated p-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                🇬🇧 {exp.title} — {exp.company}
              </p>
              <div>
                <label className={tLabelClass}>
                  Description (ID) — satu per baris
                </label>
                <textarea
                  className={`${tInputClass} min-h-[60px]`}
                  value={
                    tTranslations.experiences[exp.id]?.description?.join("\n") ||
                    ""
                  }
                  onChange={(e) =>
                    tSetTranslations({
                      ...tTranslations,
                      experiences: {
                        ...tTranslations.experiences,
                        [exp.id]: { description: e.target.value.split("\n") },
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {sub === "projects" && (
        <div className="space-y-3">
          {tData.projects.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Belum ada project. Tambahkan di section Projects dulu.
            </p>
          )}
          {tData.projects.map((proj) => (
            <div key={proj.id} className="card-elevated p-4 space-y-2">
              <p className="text-xs text-muted-foreground">🇬🇧 {proj.title}</p>
              <div>
                <label className={tLabelClass}>Description (ID)</label>
                <textarea
                  className={`${tInputClass} min-h-[60px]`}
                  value={tTranslations.projects[proj.id]?.description || ""}
                  onChange={(e) =>
                    tSetTranslations({
                      ...tTranslations,
                      projects: {
                        ...tTranslations.projects,
                        [proj.id]: {
                          description: e.target.value,
                          role: tTranslations.projects[proj.id]?.role || "",
                        },
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className={tLabelClass}>Role (ID)</label>
                <input
                  className={tInputClass}
                  value={tTranslations.projects[proj.id]?.role || ""}
                  onChange={(e) =>
                    tSetTranslations({
                      ...tTranslations,
                      projects: {
                        ...tTranslations.projects,
                        [proj.id]: {
                          description:
                            tTranslations.projects[proj.id]?.description || "",
                          role: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {sub === "volunteers" && (
        <div className="space-y-3">
          {tData.volunteers.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Belum ada volunteer. Tambahkan di section Volunteer dulu.
            </p>
          )}
          {tData.volunteers.map((vol) => (
            <div key={vol.id} className="card-elevated p-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                🇬🇧 {vol.title} — {vol.organization}
              </p>
              <div>
                <label className={tLabelClass}>Description (ID)</label>
                <textarea
                  className={`${tInputClass} min-h-[60px]`}
                  value={tTranslations.volunteers[vol.id]?.description || ""}
                  onChange={(e) =>
                    tSetTranslations({
                      ...tTranslations,
                      volunteers: {
                        ...tTranslations.volunteers,
                        [vol.id]: { description: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {sub === "awards" && (
        <div className="space-y-3">
          {tData.awards.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Belum ada award. Tambahkan di section Awards dulu.
            </p>
          )}
          {tData.awards.map((award) => (
            <div key={award.id} className="card-elevated p-4 space-y-2">
              <p className="text-xs text-muted-foreground">🇬🇧 {award.title}</p>
              <div>
                <label className={tLabelClass}>Description (ID)</label>
                <textarea
                  className={`${tInputClass} min-h-[60px]`}
                  value={tTranslations.awards[award.id]?.description || ""}
                  onChange={(e) =>
                    tSetTranslations({
                      ...tTranslations,
                      awards: {
                        ...tTranslations.awards,
                        [award.id]: { description: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {sub === "languages" && (
        <div className="space-y-3">
          {tData.languages.map((lang) => (
            <div
              key={lang.name}
              className="card-elevated p-4 flex items-center gap-3"
            >
              <span className="text-sm text-foreground min-w-[140px]">
                {lang.name} ({lang.level})
              </span>
              <input
                className={tInputClass}
                placeholder="Level dalam Bahasa Indonesia"
                value={tTranslations.languages[lang.name]?.level || ""}
                onChange={(e) =>
                  tSetTranslations({
                    ...tTranslations,
                    languages: {
                      ...tTranslations.languages,
                      [lang.name]: { level: e.target.value },
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SecuritySection({
  inputClass,
  labelClass,
  toast,
}: {
  inputClass: string;
  labelClass: string;
  toast: any;
}) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast({ title: "Password baru tidak cocok", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await changePassword(currentPw, newPw);
      if (result.success) {
        toast({ title: "Password berhasil diubah!" });
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      } else {
        toast({ title: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">
        🔒 Change Admin Password
      </h2>
      <p className="text-sm text-muted-foreground">
        Ubah password admin dashboard kamu di sini.
      </p>

      <div className="card-elevated w-full max-w-xl mx-auto p-6 space-y-5">
        <form onSubmit={handleChange} className="space-y-4">
          <div>
            <label className={labelClass}>Password Lama</label>
            <input
              type="password"
              className={inputClass}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Password Baru (min. 6 karakter)</label>
            <input
              type="password"
              className={inputClass}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className={labelClass}>Konfirmasi Password Baru</label>
            <input
              type="password"
              className={inputClass}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <KeyRound className="w-4 h-4" />
            {loading ? "Mengubah..." : "Ubah Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<PortfolioData | null>(null);
  const [translations, setTranslations] = useState<ContentTranslations>(
    getTranslations()
  );
  const [section, setSection] = useState<Section>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSessionValid()) {
      clearSession();
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const portfolio = await getData();
      setData(portfolio);
      
      if (portfolio.translations && Object.keys(portfolio.translations).length > 0) {
        setTranslations(portfolio.translations);
      }
    };

    fetchPortfolio();
  }, []);

  // INITIAL GUARD
  if (!data) {
    return <div className="p-10 text-center">Loading portfolio data...</div>;
  }

  const save = async () => {
    if (!data) return; // Guard

    // 👇 PEMBERSIHAN OTOMATIS: Merapikan tags dan spasi hanya ketika tombol "Save" ditekan
    const cleanArray = (arr: string[]) => arr.map((s) => s.trim()).filter((s) => s.length > 0);

    const cleanedData = {
      ...data,
      skills: cleanArray(data.skills),
      languages: data.languages
        .map((l) => ({ name: l.name.trim(), level: l.level.trim() }))
        .filter((l) => l.name.length > 0),
      experiences: data.experiences.map((exp) => ({
        ...exp,
        skills: cleanArray(exp.skills),
      })),
      education: data.education.map((edu) => ({
        ...edu,
        focus: cleanArray(edu.focus),
      })),
      projects: data.projects.map((proj) => ({
        ...proj,
        tags: cleanArray(proj.tags),
      })),
      translations: translations,
    };

    try {
      await saveData(cleanedData);
      setData(cleanedData); // Update layar dengan data yang sudah rapi
      toast({
        title: "Success",
        description: "Data berhasil disimpan!",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data!",
        variant: "destructive",
      });
    }
  };

  const updateProfile = (field: string, value: string) => {
    if (!data) return; // Guard
    setData({ ...data, profile: { ...data.profile, [field]: value } });
  };

  const addExperience = () => {
    if (!data) return; // Guard
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      companyLogo: "",
      dateRange: "",
      location: "",
      description: [""],
      skills: [],
      images: [],
    };
    setData({ ...data, experiences: [newExp, ...data.experiences] });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    if (!data) return; // Guard
    setData({
      ...data,
      experiences: data.experiences.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  const removeExperience = (id: string) => {
    if (!data) return; // Guard
    setData({
      ...data,
      experiences: data.experiences.filter((e) => e.id !== id),
    });
  };

  const addEducation = () => {
    if (!data) return; // Guard
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      dateRange: "",
      focus: [],
      logo: "",
    };
    setData({ ...data, education: [newEdu, ...data.education] });
  };

  const updateEducation = (id: string, field: string, value: any) => {
    if (!data) return; // Guard
    setData({
      ...data,
      education: data.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  const removeEducation = (id: string) => {
    if (!data) return; // Guard
    setData({
      ...data,
      education: data.education.filter((e) => e.id !== id),
    });
  };

  const addCertification = () => {
    if (!data) return; // Guard
    setData({
      ...data,
      certifications: [
        {
          id: Date.now().toString(),
          title: "",
          issuer: "",
          issuerLogo: "",
          year: "",
          description: [""],
          image: "",
          images: [],
        },
        ...data.certifications,
      ],
    });
  };

  const updateCertification = (id: string, field: string, value: any) => {
    if (!data) return; // Guard
    setData({
      ...data,
      certifications: data.certifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const removeCertification = (id: string) => {
    if (!data) return; // Guard
    setData({
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id),
    });
  };

  const addProject = () => {
    if (!data) return; // Guard
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      company: "",
      companyLogo: "",
      year: "",
      description: [""],
      role: "",
      image: "",
      tags: [],
      images: [],
    };
    setData({ ...data, projects: [newProject, ...data.projects] });
  };

  const updateProject = (id: string, field: string, value: any) => {
    if (!data) return; // Guard
    setData({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const removeProject = (id: string) => {
    if (!data) return; // Guard
    setData({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  const addVolunteer = () => {
    if (!data) return; // Guard
    const newVolunteer: Volunteer = {
      id: Date.now().toString(),
      title: "",
      organization: "",
      organizationLogo: "",
      year: "",
      description: [""],
      image: "",
      images: [],
    };
    setData({ ...data, volunteers: [newVolunteer, ...data.volunteers] });
  };

  const updateVolunteer = (id: string, field: string, value: any) => {
    if (!data) return; // Guard
    setData({
      ...data,
      volunteers: data.volunteers.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      ),
    });
  };

  const removeVolunteer = (id: string) => {
    if (!data) return; // Guard
    setData({
      ...data,
      volunteers: data.volunteers.filter((v) => v.id !== id),
    });
  };

  const addAward = () => {
    if (!data) return; // Guard
    const newAward: Award = {
      id: Date.now().toString(),
      title: "",
      issuer: "",
      issuerLogo: "",
      year: "",
      description: [""],
    };
    setData({ ...data, awards: [newAward, ...data.awards] });
  };

  const updateAward = (id: string, field: string, value: any) => {
    if (!data) return; // Guard
    setData({
      ...data,
      awards: data.awards.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    });
  };

  const removeAward = (id: string) => {
    if (!data) return; // Guard
    setData({
      ...data,
      awards: data.awards.filter((a) => a.id !== id),
    });
  };

  const moveItem = <T,>(arr: T[], index: number, direction: "up" | "down"): T[] => {
    const newArr = [...arr];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newArr.length) return newArr;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    return newArr;
  };

  const ReorderButtons = ({
    index,
    total,
    onMove,
  }: {
    index: number;
    total: number;
    onMove: (dir: "up" | "down") => void;
  }) => (
    <div className="flex flex-col gap-0.5 mr-2">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove("up")}
        className="p-1 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMove("down")}
        className="p-1 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );

  const inputClass =
    "w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const labelClass = "text-sm font-medium text-foreground block mb-1";

  const handleFileUpload = async (callback: (imageUrl: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imageUrl = await uploadFile(file);
          callback(imageUrl);
          toast({ title: "Image uploaded successfully!" });
        } catch (error) {
          console.error("Upload failed:", error);
          toast({
            title: "Upload failed",
            description: "Please check Laravel backend.",
            variant: "destructive",
          });
        }
      }
    };

    input.click();
  };

  const ImageUploadButton = ({
    currentImage,
    onUpload,
    onClear,
    label = "Image",
  }: {
    currentImage: string;
    onUpload: () => void;
    onClear: () => void;
    label?: string;
  }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUpload}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-80"
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
        {currentImage && (
          <>
            {/* 👇 PERUBAHAN: Gunakan fungsi Helper untuk memastikan gambar di cPanel tampil */}
            <img loading="lazy"
              src={getImageUrl(currentImage)}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border"
            />
            <button
              type="button"
              onClick={onClear}
              className="text-destructive text-xs hover:opacity-70"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );

  const ImagesUploadGrid = ({
    images,
    onUpdate,
  }: {
    images: string[];
    onUpdate: (imgs: string[]) => void;
  }) => {
    const handleMultiUpload = async () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) return;

        try {
          const uploadedUrls = await Promise.all(
            Array.from(files).map((file) => uploadFile(file))
          );
          onUpdate([...images, ...uploadedUrls]);
          toast({ title: "Gallery uploaded successfully!" });
        } catch (error) {
          console.error("Gallery upload failed:", error);
          toast({
            title: "Upload failed",
            description: "Please check Laravel backend.",
            variant: "destructive",
          });
        }
      };

      input.click();
    };

    const move = (index: number, dir: "left" | "right") => {
      const newArr = [...images];
      const target = dir === "left" ? index - 1 : index + 1;
      if (target < 0 || target >= images.length) return;
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
      onUpdate(newArr);
    };

    return (
      <div>
        <label className={labelClass}>Gallery Photos</label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {images.map((img, i) => (
            <div key={i} className="border rounded-xl overflow-hidden bg-card">
              {/* 👇 PERUBAHAN: Sama di sini juga */}
              <img loading="lazy" src={getImageUrl(img)} alt="" className="w-full h-24 object-cover" />
              <div className="p-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => move(i, "left")}
                  disabled={i === 0}
                  className="px-2 py-1 text-xs rounded border disabled:opacity-40"
                >
                  ⬅
                </button>
                <button
                  type="button"
                  onClick={() => move(i, "right")}
                  disabled={i === images.length - 1}
                  className="px-2 py-1 text-xs rounded border disabled:opacity-40"
                >
                  ➡
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(images.filter((_, idx) => idx !== i))
                  }
                  className="px-2 py-1 text-xs rounded border text-destructive"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleMultiUpload}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-80"
        >
          <Plus className="w-4 h-4" /> Upload Multiple
        </button>

        <p className="text-xs text-muted-foreground mt-2">
          {images.length} photos
        </p>
      </div>
    );
  };

  const renderContent = () => {
    if (!data) return null; // MAIN RENDER GUARD

    switch (section) {
      case "profile":
        return (
          <div className="card-elevated w-full p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground">
              Profile Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                ["name", "headline", "email", "linkedin", "cvLink"] as const
              ).map((field) => (
                <div key={field}>
                  <label className={labelClass}>
                    {field === "cvLink"
                      ? "CV Link (URL)"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    className={inputClass}
                    value={data.profile[field]}
                    onChange={(e) => updateProfile(field, e.target.value)}
                  />
                </div>
              ))}
              <ImageUploadButton
                label="Profile Photo"
                currentImage={data.profile.image}
                onUpload={() =>
                  handleFileUpload((url) => updateProfile("image", url))
                }
                onClear={() => updateProfile("image", "")}
              />
              <div>
                <label className={labelClass}>About</label>
                <textarea
                  className={`${inputClass} min-h-[120px]`}
                  value={data.profile.about}
                  onChange={(e) => updateProfile("about", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case "experiences":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Manage Experiences
              </h2>
              <button
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {data.experiences.map((exp, idx) => (
              <div key={exp.id} className="card-elevated w-full p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <ReorderButtons
                    index={idx}
                    total={data.experiences.length}
                    onMove={(dir) =>
                      setData({
                        ...data,
                        experiences: moveItem(data.experiences, idx, dir),
                      })
                    }
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        className={inputClass}
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(exp.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        className={inputClass}
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, "company", e.target.value)
                        }
                      />
                    </div>
                    <ImageUploadButton
                      label="Company Logo"
                      currentImage={exp.companyLogo}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateExperience(exp.id, "companyLogo", url)
                        )
                      }
                      onClear={() =>
                        updateExperience(exp.id, "companyLogo", "")
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Date Range</label>
                        <input
                          className={inputClass}
                          value={exp.dateRange}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "dateRange",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <input
                          className={inputClass}
                          value={exp.location}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "location",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <RichTextEditor
                      id={`experience-${exp.id}`}
                      label="Description"
                      value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description || ""}
                      onChange={(val) =>
                        updateExperience(exp.id, "description", val.split("\n"))
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />

                    <div>
                      <label className={labelClass}>
                        Skills (comma-separated)
                      </label>
                      {/* 👇 PERUBAHAN: Hapus .trim() dan .filter() agar kamu bisa ngetik spasi/koma dengan santai */}
                      <input
                        className={inputClass}
                        value={exp.skills.join(",")}
                        onChange={(e) =>
                          updateExperience(
                            exp.id,
                            "skills",
                            e.target.value.split(",")
                          )
                        }
                      />
                    </div>
                    <ImagesUploadGrid
                      images={exp.images}
                      onUpdate={(imgs) =>
                        updateExperience(exp.id, "images", imgs)
                      }
                    />
                  </div>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="ml-3 text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Manage Education
              </h2>
              <button
                onClick={addEducation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="card-elevated w-full p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <ReorderButtons
                    index={idx}
                    total={data.education.length}
                    onMove={(dir) =>
                      setData({
                        ...data,
                        education: moveItem(data.education, idx, dir),
                      })
                    }
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelClass}>School</label>
                      <input
                        className={inputClass}
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(edu.id, "school", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Degree</label>
                        <input
                          className={inputClass}
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, "degree", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Field</label>
                        <input
                          className={inputClass}
                          value={edu.field}
                          onChange={(e) =>
                            updateEducation(edu.id, "field", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Date Range</label>
                      <input
                        className={inputClass}
                        value={edu.dateRange}
                        onChange={(e) =>
                          updateEducation(edu.id, "dateRange", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Focus (comma-separated)
                      </label>
                      {/* 👇 PERUBAHAN: Memperbaiki masalah ketik spasi */}
                      <input
                        className={inputClass}
                        value={edu.focus.join(",")}
                        onChange={(e) =>
                          updateEducation(
                            edu.id,
                            "focus",
                            e.target.value.split(",")
                          )
                        }
                      />
                    </div>
                    <ImageUploadButton
                      label="Logo"
                      currentImage={edu.logo}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateEducation(edu.id, "logo", url)
                        )
                      }
                      onClear={() => updateEducation(edu.id, "logo", "")}
                    />
                  </div>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="ml-3 text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Manage Certifications
              </h2>
              <button
                onClick={addCertification}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {data.certifications.map((cert, idx) => (
              <div key={cert.id} className="card-elevated w-full p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <ReorderButtons
                    index={idx}
                    total={data.certifications.length}
                    onMove={(dir) =>
                      setData({
                        ...data,
                        certifications: moveItem(data.certifications, idx, dir),
                      })
                    }
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        className={inputClass}
                        value={cert.title}
                        onChange={(e) =>
                          updateCertification(cert.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Issuer</label>
                      <input
                        className={inputClass}
                        value={cert.issuer}
                        onChange={(e) =>
                          updateCertification(cert.id, "issuer", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        className={inputClass}
                        value={cert.year}
                        onChange={(e) =>
                          updateCertification(cert.id, "year", e.target.value)
                        }
                        placeholder="e.g. 2025"
                      />
                    </div>
                    <ImageUploadButton
                      label="Issuer Logo"
                      currentImage={cert.issuerLogo}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateCertification(cert.id, "issuerLogo", url)
                        )
                      }
                      onClear={() =>
                        updateCertification(cert.id, "issuerLogo", "")
                      }
                    />

                    <RichTextEditor
                      id={`certification-${cert.id}`}
                      label="Description"
                      value={Array.isArray(cert.description) ? cert.description.join("\n") : cert.description || ""}
                      onChange={(val) =>
                        updateCertification(cert.id, "description", val.split("\n"))
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />

                    <ImageUploadButton
                      label="Cover Image"
                      currentImage={cert.image}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateCertification(cert.id, "image", url)
                        )
                      }
                      onClear={() => updateCertification(cert.id, "image", "")}
                    />
                    <ImagesUploadGrid
                      images={cert.images}
                      onUpdate={(imgs) =>
                        updateCertification(cert.id, "images", imgs)
                      }
                    />
                  </div>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="ml-3 text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Manage Projects
              </h2>
              <button
                onClick={addProject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="card-elevated w-full p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <ReorderButtons
                    index={idx}
                    total={data.projects.length}
                    onMove={(dir) =>
                      setData({
                        ...data,
                        projects: moveItem(data.projects, idx, dir),
                      })
                    }
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        className={inputClass}
                        value={proj.title}
                        onChange={(e) =>
                          updateProject(proj.id, "title", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Company / Organization
                      </label>
                      <input
                        className={inputClass}
                        value={proj.company}
                        onChange={(e) =>
                          updateProject(proj.id, "company", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        className={inputClass}
                        value={proj.year}
                        onChange={(e) =>
                          updateProject(proj.id, "year", e.target.value)
                        }
                        placeholder="e.g. 2025"
                      />
                    </div>

                    <ImageUploadButton
                      label="Company Logo"
                      currentImage={proj.companyLogo}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateProject(proj.id, "companyLogo", url)
                        )
                      }
                      onClear={() => updateProject(proj.id, "companyLogo", "")}
                    />

                    <div>
                      <label className={labelClass}>Role</label>
                      <input
                        className={inputClass}
                        value={proj.role}
                        onChange={(e) =>
                          updateProject(proj.id, "role", e.target.value)
                        }
                      />
                    </div>

                    <RichTextEditor
                      id={`project-${proj.id}`}
                      label="Description"
                      value={Array.isArray(proj.description) ? proj.description.join("\n") : proj.description || ""}
                      onChange={(val) =>
                        updateProject(proj.id, "description", val.split("\n"))
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />

                    <div>
                      <label className={labelClass}>
                        Tags (comma-separated)
                      </label>
                      {/* 👇 PERUBAHAN: Bebas ngetik spasi untuk Tags project */}
                      <input
                        className={inputClass}
                        value={proj.tags.join(",")}
                        onChange={(e) =>
                          updateProject(
                            proj.id,
                            "tags",
                            e.target.value.split(",")
                          )
                        }
                        placeholder="e.g. React, Laravel, MySQL"
                      />
                    </div>

                    <ImageUploadButton
                      label="Cover Image"
                      currentImage={proj.image}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateProject(proj.id, "image", url)
                        )
                      }
                      onClear={() => updateProject(proj.id, "image", "")}
                    />

                    <ImagesUploadGrid
                      images={proj.images}
                      onUpdate={(imgs) =>
                        updateProject(proj.id, "images", imgs)
                      }
                    />
                  </div>
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="ml-3 text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "volunteers":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Manage Volunteer Work
              </h2>
              <button
                onClick={addVolunteer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {data.volunteers.map((vol, idx) => (
              <div key={vol.id} className="card-elevated w-full p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <ReorderButtons
                    index={idx}
                    total={data.volunteers.length}
                    onMove={(dir) =>
                      setData({
                        ...data,
                        volunteers: moveItem(data.volunteers, idx, dir),
                      })
                    }
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        className={inputClass}
                        value={vol.title}
                        onChange={(e) =>
                          updateVolunteer(vol.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Organization</label>
                      <input
                        className={inputClass}
                        value={vol.organization}
                        onChange={(e) =>
                          updateVolunteer(
                            vol.id,
                            "organization",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        className={inputClass}
                        value={vol.year}
                        onChange={(e) =>
                          updateVolunteer(vol.id, "year", e.target.value)
                        }
                        placeholder="e.g. 2025"
                      />
                    </div>

                    <ImageUploadButton
                      label="Organization Logo"
                      currentImage={vol.organizationLogo}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateVolunteer(vol.id, "organizationLogo", url)
                        )
                      }
                      onClear={() =>
                        updateVolunteer(vol.id, "organizationLogo", "")
                      }
                    />

                    <RichTextEditor
                      id={`volunteer-${vol.id}`}
                      label="Description"
                      value={Array.isArray(vol.description) ? vol.description.join("\n") : vol.description || ""}
                      onChange={(val) =>
                        updateVolunteer(vol.id, "description", val.split("\n"))
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />

                    <ImageUploadButton
                      label="Main Image"
                      currentImage={vol.image}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateVolunteer(vol.id, "image", url)
                        )
                      }
                      onClear={() => updateVolunteer(vol.id, "image", "")}
                    />

                    <ImagesUploadGrid
                      images={vol.images}
                      onUpdate={(imgs) =>
                        updateVolunteer(vol.id, "images", imgs)
                      }
                    />
                  </div>
                  <button
                    onClick={() => removeVolunteer(vol.id)}
                    className="ml-3 text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "awards":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Manage Awards
              </h2>
              <button
                onClick={addAward}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {data.awards.map((award, idx) => (
              <div key={award.id} className="card-elevated w-full p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <ReorderButtons
                    index={idx}
                    total={data.awards.length}
                    onMove={(dir) =>
                      setData({
                        ...data,
                        awards: moveItem(data.awards, idx, dir),
                      })
                    }
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        className={inputClass}
                        value={award.title}
                        onChange={(e) =>
                          updateAward(award.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Issuer</label>
                      <input
                        className={inputClass}
                        value={award.issuer}
                        onChange={(e) =>
                          updateAward(award.id, "issuer", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        className={inputClass}
                        value={award.year}
                        onChange={(e) =>
                          updateAward(award.id, "year", e.target.value)
                        }
                        placeholder="e.g. 2024"
                      />
                    </div>

                    <ImageUploadButton
                      label="Issuer Logo"
                      currentImage={award.issuerLogo}
                      onUpload={() =>
                        handleFileUpload((url) =>
                          updateAward(award.id, "issuerLogo", url)
                        )
                      }
                      onClear={() => updateAward(award.id, "issuerLogo", "")}
                    />

                    <RichTextEditor
                      id={`award-${award.id}`}
                      label="Description"
                      value={Array.isArray(award.description) ? award.description.join("\n") : award.description || ""}
                      onChange={(val) =>
                        updateAward(award.id, "description", val.split("\n"))
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                  </div>
                  <button
                    onClick={() => removeAward(award.id)}
                    className="ml-3 text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "skills":
        return (
          <div className="card-elevated w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Manage Skills & Languages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* SKILLS */}
              <div className="space-y-2">
                <label className={labelClass}>Skills (comma-separated)</label>
                {/* 👇 PERUBAHAN: Supaya ga error pas ngetik spasi/koma di skill utama */}
                <input
                  className={inputClass}
                  value={data.skills.join(",")}
                  onChange={(e) =>
                    setData({
                      ...data,
                      skills: e.target.value.split(","),
                    })
                  }
                />
              </div>

              {/* LANGUAGES */}
              <div className="space-y-2">
                <label className={labelClass}>
                  Languages (format: Name - Level, one per line)
                </label>
                {/* 👇 PERUBAHAN: Memastikan textarea bahasa tidak memaksa cursor lompat */}
                <textarea
                  className={`${inputClass} min-h-[120px] resize-none`}
                  value={data.languages
                    .map((l) => {
                      if (!l.name && !l.level) return "";
                      return l.level ? `${l.name} - ${l.level}` : l.name;
                    })
                    .join("\n")}
                  onChange={(e) =>
                    setData({
                      ...data,
                      languages: e.target.value.split("\n").map((line) => {
                        const idx = line.indexOf("-");
                        if (idx === -1) {
                          return { name: line, level: "" };
                        }
                        return {
                          name: line.substring(0, idx),
                          level: line.substring(idx + 1),
                        };
                      }),
                    })
                  }
                />
              </div>
            </div>
          </div>
        );

      case "translations":
        return (
          <TranslationsEditor
            tData={data}
            tTranslations={translations}
            tSetTranslations={setTranslations}
            tInputClass={inputClass}
            tLabelClass={labelClass}
          />
        );
      case "security":
        return (
          <SecuritySection
            inputClass={inputClass}
            labelClass={labelClass}
            toast={toast}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex relative min-h-screen w-full bg-background">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border shadow-sm"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r flex flex-col z-40 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="font-bold text-foreground text-sm">Admin Dashboard</h2>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setSection(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                section === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t space-y-2">
          <ThemeToggleAdmin />
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-h-screen">
        <div className="sticky top-0 bg-card/80 backdrop-blur-lg border-b z-20 px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground lg:ml-0 ml-12">
            {sidebarItems.find((i) => i.key === section)?.label}
          </span>
          <button
            onClick={save}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}