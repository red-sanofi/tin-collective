const images = {
  ceramics: "/images/workshop-ceramics.jpg",
  chocolate: "/images/workshop-chocolate.jpg",
  ai: "/images/workshop-ai.jpg",
  cinema: "/images/workshop-cinema.jpg",
  gallery: "/images/gallery-visit.jpg",
  community: "/images/community-studio.jpg",
  journal: "/images/journal-books.jpg",
  featured: "/images/hero-brand.jpg",
  artisan: "/images/hero-brand-soft.jpg",
  brandCard: "/images/brand-card.jpg",
};

const educationSlugImages = {
  "cikolata-egitimi": images.chocolate,
  "yapay-zeka-temelleri": images.ai,
  "sinema-okumalari": images.cinema,
  "seramik-temelleri-atolyesi": images.ceramics,
  "van-gogh-u-anlamak-resim-okuma": images.gallery,
  "beyoglu-galeri-turu": images.gallery,
  "dijital-illustrasyon-atolyesi": images.ai,
  "kolektif-kitap-kulubu-modern-sanat": images.journal,
  "fotografcilikta-isik-ve-kompozisyon": images.community,
  "dokuma-ve-tekstil-atolyesi": images.ceramics,
};

const categoryImages = {
  Workshop: images.ceramics,
  Technology: images.ai,
  Culture: images.cinema,
};

const announcementSlugImages = {
  "acik-cagri-yeni-egitmenler": images.community,
  "leonardo-da-vinci-gecesi": images.journal,
  "kis-atolye-takvimi-yayinda": images.featured,
  "folia-sergileri-nasil-gezerim": images.gallery,
  "tin-kolektif-instagram-canli-yayin": images.community,
  "yeni-uyelerimizle-tanisin": images.community,
  "adana-da-acik-stuyo-gunu": images.ceramics,
  "cagdas-sanatin-dolambacli-yollari": images.gallery,
  "bookinton-ile-kitap-kulubu-raporu": images.journal,
  "mayis-atolyeleri-kayitlari-acildi": images.featured,
  "gonullu-program-basvurulari": images.community,
  "sinema-gecesi-tarkovsky-retrospektifi": images.cinema,
};

const imagePool = [
  images.ceramics,
  images.chocolate,
  images.ai,
  images.cinema,
  images.gallery,
  images.community,
  images.journal,
  images.featured,
];

export function getEducationImage(education, index = 0) {
  if (education?.slug && educationSlugImages[education.slug]) {
    return educationSlugImages[education.slug];
  }
  if (education?.category && categoryImages[education.category]) {
    return categoryImages[education.category];
  }
  return imagePool[index % imagePool.length];
}

export function getAnnouncementImage(announcement, index = 0) {
  if (announcement?.slug && announcementSlugImages[announcement.slug]) {
    return announcementSlugImages[announcement.slug];
  }
  return imagePool[(index + 2) % imagePool.length];
}

export function getFeaturedHeroImage() {
  return images.featured;
}

export function getArtisanHeroImage() {
  return images.artisan;
}

export { images };
