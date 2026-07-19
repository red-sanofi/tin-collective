import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";

const platformLabels = {
  instagram: "Instagram",
  twitter: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export default function SocialFeed({ title, className = "" }) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSocialFeed()
      .then((data) => setPosts(Array.isArray(data) ? data : data.results || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={`social-feed ${className}`.trim()}>{t("common.loading")}</div>;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={`social-feed ${className}`.trim()}>
      <div className="social-feed-head">
        <p className="stamp-label">{t("home.socialFeedTitle")}</p>
        {title && <h2>{title}</h2>}
      </div>
      <div className="social-feed-grid">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.post_url}
            target="_blank"
            rel="noreferrer"
            className={`social-feed-card social-feed-${post.platform}`}
          >
            <div className="social-feed-media">
              {post.image_url ? (
                <img src={post.image_url} alt="" loading="lazy" />
              ) : (
                <div className="social-feed-fallback">{platformLabels[post.platform] || post.platform}</div>
              )}
            </div>
            <div className="social-feed-body">
              <span className="social-feed-platform">
                {platformLabels[post.platform] || post.platform}
              </span>
              <strong>{post.author_name || post.author_username}</strong>
              <p>{post.caption}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
