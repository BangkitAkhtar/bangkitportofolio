import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "Bangkit Akhtar Fahd | Full-Stack Developer Portfolio Undergraduate Computer Science Student BINUS University",
  description = "Portfolio profesional Bangkit Akhtar Fahd, mahasiswa Computer Science Binus University yang berfokus pada Full-Stack Web Development dan Manajerial IT Digital Transformation.",
  image = "https://api.bangkitakhtar.com/storage/uploads/bangkitfoto.webp",
  url = "https://bangkitakhtar.com",
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Bangkit Akhtar Fahd, Portfolio, Full-Stack Developer, Computer Science, BINUS University, Web Developer, IT Digital Transformation" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
