import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.bangkitakhtar.com/api";

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const token = sessionStorage.getItem("admin_session_token");

  const response = await axios.post(`${API_BASE}/upload`, formData, {
    timeout: 30000,
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Admin-Token": token || "",
    },
  });

  return response.data.url;
}