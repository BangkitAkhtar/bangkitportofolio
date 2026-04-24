import { useState, useRef } from "react";
import { Send, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { AnimatedSection } from "./AnimatedSection";
import { useLang } from "@/lib/i18n";

const SERVICE_ID = "service_r6kfd8c";
const TEMPLATE_ID = "template_oxp2pgl";
const PUBLIC_KEY = "HZeK8o59wcNi--1AY";
const RATE_LIMIT_MS = 120000; // 2 menit antar pesan
const MAX_SENDS_PER_SESSION = 5; // maksimal 5 pesan per session
const MIN_FILL_TIME_MS = 3000; // form harus diisi minimal 3 detik (bot terlalu cepat)

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastSent, setLastSent] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const [formLoadTime] = useState(Date.now());
  const { t } = useLang();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const form = formRef.current;

    const honeypot = form.querySelector<HTMLInputElement>('input[name="website"]');
    if (honeypot && honeypot.value) {
      toast.success(t.toastSuccess, { description: t.toastSuccessDesc, duration: 5000 });
      form.reset();
      return;
    }

    // Bot speed check — terlalu cepat isi form
    if (Date.now() - formLoadTime < MIN_FILL_TIME_MS) {
      toast.success(t.toastSuccess, { description: t.toastSuccessDesc, duration: 5000 });
      form.reset();
      return;
    }

    // Session limit
    if (sendCount >= MAX_SENDS_PER_SESSION) {
      toast.error(t.toastRateLimit, {
        description: t.toastRateLimitDesc(0),
        duration: 4000,
      });
      return;
    }

    const now = Date.now();
    if (now - lastSent < RATE_LIMIT_MS) {
      const secsLeft = Math.ceil((RATE_LIMIT_MS - (now - lastSent)) / 1000);
      toast.error(t.toastRateLimit, {
        description: t.toastRateLimitDesc(secsLeft),
        duration: 4000,
      });
      return;
    }

    setSending(true);

    const timeInput = form.querySelector<HTMLInputElement>('input[name="time"]');
    if (timeInput) timeInput.value = new Date().toLocaleString("id-ID");
    const subjectVal = form.querySelector<HTMLInputElement>('input[name="subject"]')?.value || "";
    const titleInput = form.querySelector<HTMLInputElement>('input[name="title"]');
    if (titleInput) titleInput.value = subjectVal;

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
      setSent(true);
      setLastSent(Date.now());
      setSendCount(prev => prev + 1);
      form.reset();
      toast.success(t.toastSuccess, { description: t.toastSuccessDesc, duration: 5000 });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error(t.toastError, { description: t.toastErrorDesc, duration: 5000 });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-card/50 border-t border-border">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">{t.contactTitle}</h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div className="max-w-xl mx-auto bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-border/50 p-6 sm:p-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <input type="hidden" name="time" value="" />
              <input type="hidden" name="title" value="" />
              <div className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10 overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="from_name" className="block text-sm font-medium text-foreground mb-1.5">{t.name}</label>
                <input id="from_name" name="from_name" type="text" required maxLength={100} className="flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" placeholder={t.namePlaceholder} />
              </div>
              <div>
                <label htmlFor="from_email" className="block text-sm font-medium text-foreground mb-1.5">{t.email}</label>
                <input id="from_email" name="from_email" type="email" required maxLength={255} className="flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" placeholder={t.emailPlaceholder} />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">{t.subject}</label>
                <input id="subject" name="subject" type="text" required maxLength={200} className="flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" placeholder={t.subjectPlaceholder} />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">{t.message}</label>
                <textarea id="message" name="message" required maxLength={2000} rows={5} className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" placeholder={t.messagePlaceholder} />
              </div>
              <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.sending}</> : sent ? <><CheckCircle className="w-4 h-4" /> {t.sent}</> : <><Send className="w-4 h-4" /> {t.sendMessage}</>}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
                <ShieldCheck className="w-3.5 h-3.5" /> {t.spamProtected}
              </p>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
