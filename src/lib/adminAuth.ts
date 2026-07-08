const ADMIN_HASH_KEY = "admin_password_hash";
const RATE_LIMIT_KEY = "admin_login_attempts";
const SESSION_TOKEN_KEY = "admin_session_token";

// Rate limiting config
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Obfuscated default password (not plaintext in source)
const _dp = [115, 105, 110, 103, 97, 49, 50, 51]; // char codes
function getDefaultPassword(): string {
  return String.fromCharCode(..._dp);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "bangkit_portfolio_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Generate a cryptographic session token
function generateSessionToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Rate limiting helpers
interface RateLimitData {
  attempts: number;
  lockedUntil: number | null;
}

function getRateLimitData(): RateLimitData {
  try {
    const stored = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { attempts: 0, lockedUntil: null };
}

function setRateLimitData(data: RateLimitData): void {
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}

export function isRateLimited(): { limited: boolean; remainingSeconds: number } {
  const data = getRateLimitData();
  if (data.lockedUntil && Date.now() < data.lockedUntil) {
    return { limited: true, remainingSeconds: Math.ceil((data.lockedUntil - Date.now()) / 1000) };
  }
  if (data.lockedUntil && Date.now() >= data.lockedUntil) {
    setRateLimitData({ attempts: 0, lockedUntil: null });
  }
  return { limited: false, remainingSeconds: 0 };
}

function recordFailedAttempt(): void {
  const data = getRateLimitData();
  data.attempts += 1;
  if (data.attempts >= MAX_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
  setRateLimitData(data);
}

function resetAttempts(): void {
  setRateLimitData({ attempts: 0, lockedUntil: null });
}

export async function initializePassword(): Promise<void> {
  // Obsolete: Password is now handled securely in the backend .env
}

export async function verifyPassword(password: string): Promise<boolean> {
  const { limited } = isRateLimited();
  if (limited) return false;

  try {
    const API_URL = import.meta.env.VITE_API_URL || "https://api.bangkitakhtar.com/api";
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem(SESSION_TOKEN_KEY, data.token);
        resetAttempts();
        return true;
      }
    }
  } catch (e) {
    console.error("Login API error:", e);
  }

  recordFailedAttempt();
  return false;
}

// Session management
export function isSessionValid(): boolean {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  return !!token; // As long as we have a token, we consider session valid. Backend will verify actual validity.
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: "Untuk keamanan, password admin kini dikelola langsung melalui file .env di panel hosting (cPanel) Anda." };
}
