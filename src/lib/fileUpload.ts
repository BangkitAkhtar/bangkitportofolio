import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.bangkitakhtar.com/api";

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const token = sessionStorage.getItem("admin_session_token");

  try {
    const response = await axios.post(`${API_BASE}/upload`, formData, {
      timeout: 60000, // PDF bisa jauh lebih besar dari gambar
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Admin-Token": token || "",
      },
    });

    return response.data.url;
  } catch (err: any) {
    // Tampilkan alasan sebenarnya dari server, bukan pesan generik — kalau tidak,
    // kegagalan validasi/limit PHP jadi tidak bisa didiagnosis sama sekali.
    const res = err?.response;
    let reason = "";

    if (res?.data?.errors) {
      // Format validasi Laravel: { errors: { image: ["..."] } }
      reason = Object.values(res.data.errors).flat().join(" ");
    } else if (res?.data?.message) {
      reason = res.data.message;
    } else if (res?.status) {
      reason = `Server membalas ${res.status}`;
    } else if (err?.code === "ECONNABORTED") {
      reason = "Waktu upload habis (file terlalu besar / koneksi lambat)";
    } else {
      reason = err?.message || "Tidak bisa menghubungi server";
    }

    throw new Error(reason);
  }
}