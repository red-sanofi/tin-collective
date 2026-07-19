const platformLabels = {
  instagram: "Instagram",
  twitter: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
  website: "Web",
};

export default function SocialLinks({ user, className = "" }) {
  if (!user) {
    return null;
  }

  const links = [
    { key: "instagram", href: user.instagram },
    { key: "twitter", href: user.twitter },
    { key: "youtube", href: user.youtube },
    { key: "tiktok", href: user.tiktok },
    { key: "website", href: user.website },
  ].filter((item) => item.href);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className={`social-links ${className}`.trim()}>
      {links.map((item) => (
        <a key={item.key} href={item.href} target="_blank" rel="noreferrer" className="social-link-chip">
          {platformLabels[item.key]}
        </a>
      ))}
    </div>
  );
}
