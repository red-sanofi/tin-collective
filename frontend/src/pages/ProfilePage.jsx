import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.myRegistrations().then(setRegistrations).catch(console.error);
  }, []);

  useEffect(() => {
    setForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
    });
  }, [user]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.updateMe(form);
      await refreshUser();
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="profile-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>Welcome, {user.username}</h1>
        </div>
      </header>

      <div className="profile-grid">
        <section className="panel">
          <h2>Your details</h2>
          <form className="stack-form" onSubmit={handleSubmit}>
            <FormField
              label="First name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />
            <FormField
              label="Last name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />
            <FormField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <FormField
              label="Bio"
              name="bio"
              as="textarea"
              value={form.bio}
              onChange={handleChange}
            />
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary">
              Save profile
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Your registrations</h2>
          {registrations.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <ul className="registration-list">
              {registrations.map((registration) => (
                <li key={registration.id}>
                  <div>
                    <strong>{registration.education_title}</strong>
                    <p>{registration.status}</p>
                  </div>
                  <Link to={`/educations/${registration.education_slug}`} className="text-link">
                    View
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
