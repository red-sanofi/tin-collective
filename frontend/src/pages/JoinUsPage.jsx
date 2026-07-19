import { useState } from "react";
import { api } from "../api/client";
import FormField from "../components/FormField";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  interest_area: "Education",
  message: "",
  portfolio_url: "",
};

export default function JoinUsPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await api.submitJoinApplication(form);
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="split-page">
      <section>
        <p className="eyebrow">Join Us</p>
        <h1>Become part of Tin Kolektif</h1>
        <p>
          We welcome educators, artists, technologists, and community builders who want
          to co-create workshops, events, and open calls.
        </p>
        <ul className="feature-list">
          <li>Lead or co-host educations</li>
          <li>Collaborate on cultural programming</li>
          <li>Join our volunteer and mentor network</li>
        </ul>
      </section>
      <section className="panel">
        {submitted ? (
          <div className="alert alert-success">
            Thank you. Your application has been received.
          </div>
        ) : (
          <form className="stack-form" onSubmit={handleSubmit}>
            <FormField
              label="Full name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <FormField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <FormField
              label="Interest area"
              name="interest_area"
              as="select"
              value={form.interest_area}
              onChange={handleChange}
              options={[
                { value: "Education", label: "Education" },
                { value: "Workshop", label: "Workshop" },
                { value: "Technology", label: "Technology" },
                { value: "Culture", label: "Culture" },
                { value: "Volunteer", label: "Volunteer" },
              ]}
            />
            <FormField
              label="Portfolio or social link"
              name="portfolio_url"
              value={form.portfolio_url}
              onChange={handleChange}
            />
            <FormField
              label="Tell us about yourself"
              name="message"
              as="textarea"
              value={form.message}
              onChange={handleChange}
              required
            />
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary">
              Submit application
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
