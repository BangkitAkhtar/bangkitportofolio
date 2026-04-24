import { useLang } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "id" : "en")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 text-sm font-medium transition-all"
      title={lang === "en" ? "Switch to Bahasa Indonesia" : "Switch to English"}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase text-xs font-bold">{lang === "en" ? "ID" : "EN"}</span>
    </button>
  );
}
