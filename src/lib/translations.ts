import { PortfolioData, Profile, Experience, Education, Certification, Project, Volunteer, Award, Language, SkillCategory } from "./data";

/**
 * Fungsi ini bertugas untuk meniban (replace) data asli (Bahasa Indonesia)
 * dengan data terjemahan (Bahasa Inggris) jika bahasa 'en' sedang aktif
 * dan datanya tersedia di dalam objek `data.translations.en`.
 */
export function translateData(data: PortfolioData, lang: "en" | "id"): PortfolioData {
  // Jika bahasa Indonesia atau data API tidak memiliki slot translations, kembalikan data asli
  if (lang === "id" || !data.translations || !data.translations.en) {
    return data;
  }

  const en = data.translations.en; // Ambil kumpulan terjemahan bahasa Inggris

  // 1. Terjemahkan Profile
  const profile: Profile = {
    ...data.profile,
    headline: en.profile?.headline || data.profile.headline,
    about: en.profile?.about || data.profile.about,
  };

  // 2. Terjemahkan Experiences
  const experiences: Experience[] = data.experiences.map((exp) => {
    const tExp = en.experiences?.[exp.id];
    if (!tExp) return exp;
    return {
      ...exp,
      title: tExp.title || exp.title,
      description: tExp.description || exp.description,
    };
  });

  // 3. Terjemahkan Education
  const education: Education[] = data.education.map((edu) => {
    const tEdu = en.education?.[edu.id];
    if (!tEdu) return edu;
    return {
      ...edu,
      degree: tEdu.degree || edu.degree,
      field: tEdu.field || edu.field,
      description: tEdu.description || edu.description,
    };
  });

  // 4. Terjemahkan Certifications
  const certifications: Certification[] = data.certifications.map((cert) => {
    const tCert = en.certifications?.[cert.id];
    if (!tCert) return cert;
    return {
      ...cert,
      title: tCert.title || cert.title,
      description: tCert.description || cert.description,
    };
  });

  // 5. Terjemahkan Projects
  const projects: Project[] = data.projects.map((proj) => {
    const tProj = en.projects?.[proj.id];
    if (!tProj) return proj;
    return {
      ...proj,
      title: tProj.title || proj.title,
      description: tProj.description || proj.description,
      role: tProj.role || proj.role,
    };
  });

  // 6. Terjemahkan Volunteers
  const volunteers: Volunteer[] = data.volunteers.map((vol) => {
    const tVol = en.volunteers?.[vol.id];
    if (!tVol) return vol;
    return {
      ...vol,
      title: tVol.title || vol.title,
      description: tVol.description || vol.description,
    };
  });

  // 7. Terjemahkan Awards
  const awards: Award[] = data.awards.map((awa) => {
    const tAwa = en.awards?.[awa.id];
    if (!tAwa) return awa;
    return {
      ...awa,
      title: tAwa.title || awa.title,
      description: tAwa.description || awa.description,
    };
  });

  // Gabungkan semua data yang sudah diterjemahkan
  return {
    ...data,
    profile,
    experiences,
    education,
    certifications,
    projects,
    volunteers,
    awards,
  };
}