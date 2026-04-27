import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (path: string) => {
  if (!path) return "";
  
  // 1. Perbaiki jika ada link localhost yang nyasar dari database
  if (path.includes("localhost") || path.includes("127.0.0.1")) {
    path = path.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, "https://api.bangkitakhtar.com");
  }

  // 2. Jika sudah URL lengkap, biarkan
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // 3. Bersihkan slash depan
  let cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // 4. Tambahkan prefix storage jika belum ada
  if (!cleanPath.startsWith("storage/")) {
    cleanPath = `storage/${cleanPath}`;
  }

  return `https://api.bangkitakhtar.com/${cleanPath}`;
};