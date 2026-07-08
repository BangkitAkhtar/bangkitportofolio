import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { verifyPassword, initializePassword, isRateLimited } from "@/lib/adminAuth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    initializePassword();
  }, []);

  // Update lockout countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const { limited, remainingSeconds } = isRateLimited();
      if (limited) {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        setLockoutMsg(`Terlalu banyak percobaan. Coba lagi dalam ${mins}:${secs.toString().padStart(2, "0")}`);
      } else {
        setLockoutMsg("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { limited } = isRateLimited();
    if (limited) return;

    setLoading(true);
    try {
      const valid = await verifyPassword(password);
      if (valid) {
        navigate("/admin/dashboard");
      } else {
        const { limited: nowLimited } = isRateLimited();
        if (nowLimited) {
          toast({ title: "Akun terkunci sementara", description: "Terlalu banyak percobaan gagal", variant: "destructive" });
        } else {
          toast({ title: "Invalid password", variant: "destructive" });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="card-elevated p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter password to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {lockoutMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{lockoutMsg}</span>
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={!!lockoutMsg}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button type="submit" disabled={loading || !!lockoutMsg} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
