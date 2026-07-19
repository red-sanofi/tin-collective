import { useState } from "react";
import { api } from "../api/client";
import FormField from "../components/FormField";

const emptyEducation = {
  title: "",
  summary: "",
  description: "",
  category: "Workshop",
  delivery_mode: "online",
  location: "",
  start_at: "",
  end_at: "",
  capacity: 20,
  is_published: true,
};

const emptyAnnouncement = {
  title: "",
  summary: "",
  body: "",
  is_published: true,
  published_at: "",
};

export default function AdminPage() {
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleEducationChange(event) {
    const { name, value, type, checked } = event.target;
    setEducationForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAnnouncementChange(event) {
    const { name, value, type, checked } = event.target;
    setAnnouncementForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function createEducation(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.createEducation({
        ...educationForm,
        capacity: Number(educationForm.capacity),
        end_at: educationForm.end_at || null,
      });
      setEducationForm(emptyEducation);
      setMessage("Education created.");
    } catch (err) {
      setError(err.data ? JSON.stringify(err.data) : err.message);
    }
  }

  async function createAnnouncement(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.createAnnouncement({
        ...announcementForm,
        published_at: announcementForm.published_at || null,
      });
      setAnnouncementForm(emptyAnnouncement);
      setMessage("Announcement created.");
    } catch (err) {
      setError(err.data ? JSON.stringify(err.data) : err.message);
    }
  }

  return (
    <div>
      <header className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Create educations and announcements</h1>
      </header>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-grid">
        <section className="panel">
          <h2>New education</h2>
          <form className="stack-form" onSubmit={createEducation}>
            <FormField
              label="Title"
              name="title"
              value={educationForm.title}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label="Summary"
              name="summary"
              value={educationForm.summary}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label="Description"
              name="description"
              as="textarea"
              value={educationForm.description}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label="Category"
              name="category"
              value={educationForm.category}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label="Delivery mode"
              name="delivery_mode"
              as="select"
              value={educationForm.delivery_mode}
              onChange={handleEducationChange}
              options={[
                { value: "online", label: "Online" },
                { value: "in_person", label: "In person" },
                { value: "hybrid", label: "Hybrid" },
              ]}
            />
            <FormField
              label="Location"
              name="location"
              value={educationForm.location}
              onChange={handleEducationChange}
            />
            <FormField
              label="Start at"
              name="start_at"
              type="datetime-local"
              value={educationForm.start_at}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label="End at"
              name="end_at"
              type="datetime-local"
              value={educationForm.end_at}
              onChange={handleEducationChange}
            />
            <FormField
              label="Capacity"
              name="capacity"
              type="number"
              value={educationForm.capacity}
              onChange={handleEducationChange}
              required
            />
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="is_published"
                checked={educationForm.is_published}
                onChange={handleEducationChange}
              />
              Published
            </label>
            <button type="submit" className="btn btn-primary">
              Create education
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>New announcement</h2>
          <form className="stack-form" onSubmit={createAnnouncement}>
            <FormField
              label="Title"
              name="title"
              value={announcementForm.title}
              onChange={handleAnnouncementChange}
              required
            />
            <FormField
              label="Summary"
              name="summary"
              value={announcementForm.summary}
              onChange={handleAnnouncementChange}
              required
            />
            <FormField
              label="Body"
              name="body"
              as="textarea"
              value={announcementForm.body}
              onChange={handleAnnouncementChange}
              required
            />
            <FormField
              label="Published at"
              name="published_at"
              type="datetime-local"
              value={announcementForm.published_at}
              onChange={handleAnnouncementChange}
            />
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="is_published"
                checked={announcementForm.is_published}
                onChange={handleAnnouncementChange}
              />
              Published
            </label>
            <button type="submit" className="btn btn-primary">
              Create announcement
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
