import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import FormField from "../components/FormField";
import PageHero from "../components/PageHero";
import SocialLinks from "../components/SocialLinks";
import { useAuth } from "../context/AuthContext";
import { translateApiError, translateRegistrationStatus } from "../utils/i18nHelpers";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [postUrl, setPostUrl] = useState("");
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    instagram: user?.instagram || "",
    twitter: user?.twitter || "",
    youtube: user?.youtube || "",
    tiktok: user?.tiktok || "",
    website: user?.website || "",
    share_social_in_feed: user?.share_social_in_feed ?? true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .myRegistrations()
      .then((data) => setRegistrations(data.results || data))
      .catch(console.error);
    api
      .getMySocialPosts()
      .then((data) => setSocialPosts(Array.isArray(data) ? data : data.results || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      instagram: user?.instagram || "",
      twitter: user?.twitter || "",
      youtube: user?.youtube || "",
      tiktok: user?.tiktok || "",
      website: user?.website || "",
      share_social_in_feed: user?.share_social_in_feed ?? true,
    });
  }, [user]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.updateMe(form);
      await refreshUser();
      setMessage(t("profile.updated"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  async function handleAddPost(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const post = await api.addSocialPost(postUrl);
      setSocialPosts((current) => [post, ...current.filter((item) => item.id !== post.id)]);
      setPostUrl("");
      setMessage(t("profile.postAdded"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  async function handleRemovePost(id) {
    setMessage("");
    setError("");
    try {
      await api.deleteSocialPost(id);
      setSocialPosts((current) => current.filter((item) => item.id !== id));
      setMessage(t("profile.postRemoved"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  return (
    <div className="page-readable profile-page">
      <PageHero
        label={t("profile.eyebrow")}
        title={t("profile.welcome", { username: user.username })}
        tone="red"
      />

      <SocialLinks user={user} className="profile-social-links" />

      <div className="profile-grid">
        <section className="panel">
          <h2>{t("profile.yourDetails")}</h2>
          <form className="stack-form" onSubmit={handleSubmit}>
            <FormField
              label={t("auth.firstName")}
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />
            <FormField
              label={t("auth.lastName")}
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />
            <FormField
              label={t("profile.phone")}
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <FormField
              label={t("profile.bio")}
              name="bio"
              as="textarea"
              value={form.bio}
              onChange={handleChange}
            />

            <h3>{t("profile.socialLinks")}</h3>
            <FormField
              label={t("profile.instagram")}
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="@tinkolektif"
            />
            <FormField
              label={t("profile.twitter")}
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              placeholder="@tinkolektif"
            />
            <FormField
              label={t("profile.youtube")}
              name="youtube"
              value={form.youtube}
              onChange={handleChange}
            />
            <FormField
              label={t("profile.tiktok")}
              name="tiktok"
              value={form.tiktok}
              onChange={handleChange}
            />
            <FormField
              label={t("profile.website")}
              name="website"
              value={form.website}
              onChange={handleChange}
            />
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="share_social_in_feed"
                checked={form.share_social_in_feed}
                onChange={handleChange}
              />
              <span>{t("profile.share_social_in_feed")}</span>
            </label>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary">
              {t("profile.saveProfile")}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>{t("profile.socialFeed")}</h2>
          <p className="panel-copy">{t("profile.socialFeedHelp")}</p>
          <form className="stack-form social-post-form" onSubmit={handleAddPost}>
            <FormField
              label={t("profile.postUrl")}
              name="post_url"
              value={postUrl}
              onChange={(event) => setPostUrl(event.target.value)}
              placeholder="https://www.instagram.com/p/..."
              required
            />
            <button type="submit" className="btn btn-secondary">
              {t("profile.addPost")}
            </button>
          </form>

          {socialPosts.length === 0 ? (
            <p>{t("profile.noSocialPosts")}</p>
          ) : (
            <ul className="social-post-list">
              {socialPosts.map((post) => (
                <li key={post.id}>
                  <div>
                    <strong>{post.caption || post.post_url}</strong>
                    <p>{post.platform}</p>
                  </div>
                  <div className="social-post-actions">
                    <a href={post.post_url} target="_blank" rel="noreferrer" className="text-link">
                      {t("common.view")}
                    </a>
                    <button type="button" className="text-link" onClick={() => handleRemovePost(post.id)}>
                      {t("profile.removePost")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>{t("profile.yourRegistrations")}</h2>
          {registrations.length === 0 ? (
            <p>{t("profile.noRegistrations")}</p>
          ) : (
            <ul className="registration-list">
              {registrations.map((registration) => (
                <li key={registration.id}>
                  <div>
                    <strong>{registration.education_title}</strong>
                    <p>{translateRegistrationStatus(t, registration.status)}</p>
                  </div>
                  <Link to={`/educations/${registration.education_slug}`} className="text-link">
                    {t("common.view")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
