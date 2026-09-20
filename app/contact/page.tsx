"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP_NUMBER = "919116667045";

const wa = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type FormData = {
  name: string;
  phone: string;
  email: string;
  inquiryType: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  phone: "",
  email: "",
  inquiryType: "Hotel / Stay",
  destination: "",
  checkIn: "",
  checkOut: "",
  guests: "",
  message: "",
};

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getNextDay(dateString: string) {
  if (!dateString) return getToday();

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return getToday();
  }

  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ContactPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>(initialForm);

  const today = useMemo(() => getToday(), []);

  const checkoutMin = useMemo(() => {
    return form.checkIn ? getNextDay(form.checkIn) : today;
  }, [form.checkIn, today]);

  /*
   * POPUP
   * Opens automatically after 4 seconds.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  /*
   * FORM CHANGE
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    /*
     * PHONE:
     * Only numbers allowed.
     * Maximum 10 digits.
     */
    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        phone: onlyNumbers,
      }));

      setError("");
      return;
    }

    /*
     * CHECK-IN:
     * When check-in changes, make sure checkout
     * is not before/equal to check-in.
     */
    if (name === "checkIn") {
      setForm((prev) => ({
        ...prev,
        checkIn: value,
        checkOut:
          prev.checkOut && prev.checkOut > value
            ? prev.checkOut
            : "",
      }));

      setError("");
      return;
    }

    /*
     * CHECK-OUT:
     * Normal update.
     */
    if (name === "checkOut") {
      setForm((prev) => ({
        ...prev,
        checkOut: value,
      }));

      setError("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /*
   * VALIDATE FORM
   */
  const validateForm = () => {
    const phone = form.phone.trim();

    // Phone must be exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
      return "Please enter a valid 10-digit mobile number.";
    }

    // Check-in cannot be before today
    if (form.checkIn && form.checkIn < today) {
      return "Check-in / Event Date cannot be before today.";
    }

    // Checkout must be after check-in
    if (form.checkIn && form.checkOut) {
      if (form.checkOut <= form.checkIn) {
        return "Check-out / End Date must be after the Check-in / Event Date.";
      }
    }

    return "";
  };

  /*
   * SUBMIT INQUIRY
   */
  const submitInquiry = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Something went wrong."
        );
      }

      setSuccess(true);

      setForm(initialForm);

      setTimeout(() => {
        setShowPopup(false);
        setSuccess(false);
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit inquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {/* =========================
          HEADER
      ========================= */}

      <header className="site-header properties-header">
        <a className="brand" href="/">
          <img
            src="/sawariya-logo.jpeg"
            alt="Sawariya Event"
          />
        </a>

        <nav className="desktop-nav">
          <a href="/">Home</a>
          <a href="/properties">Properties</a>
          <a href="/events">Events</a>
          <a href="/packages">Packages</a>
          <a href="/about">About</a>

          <a
            className="active-nav"
            href="/contact"
          >
            Contact
          </a>
        </nav>

        <a
          className="header-whatsapp"
          href={wa(
            "Hello Sawariya Hospitality, I would like to make an inquiry."
          )}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp ↗
        </a>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <section className="events-hero">
        <div>
          <p className="eyebrow gold">
            CONTACT SAWARIYA EVENT
          </p>

          <h1>
            Let's talk about your{" "}
            <em>stay or event.</em>
          </h1>

          <p>
            Send us your requirement and our team
            will help you with the next step.
          </p>
        </div>
      </section>

      {/* =========================
          CONTACT CHANNELS
      ========================= */}

      <section className="section section-light">
        <div className="center-heading">
          <p className="eyebrow">
            GET IN TOUCH
          </p>

          <h2>
            Choose your <span>channel.</span>
          </h2>
        </div>

        <div className="why-grid">
          <div className="why-item">
            <span>01</span>

            <h3>WhatsApp</h3>

            <p>
              Fastest way to share your requirement.
            </p>

            <a
              className="text-link"
              href={wa(
                "Hello Sawariya Hospitality, I would like to make an inquiry."
              )}
              target="_blank"
              rel="noreferrer"
            >
              +91 9116667045 →
            </a>
          </div>

          <div className="why-item">
            <span>02</span>

            <h3>Phone</h3>

            <p>
              Speak directly with the Sawariya team.
            </p>

            <a
              className="text-link"
              href="tel:+919116667045"
            >
              +91 9116667045 →
            </a>
          </div>

          <div className="why-item">
            <span>03</span>

            <h3>Email</h3>

            <p>
              For detailed requirements and business
              enquiries.
            </p>

            <a
              className="text-link"
              href="mailto:Sawariyaevent00@gmail.com"
            >
              Sawariyaevent00@gmail.com →
            </a>
          </div>

          <div className="why-item">
            <span>04</span>

            <h3>Inquiry</h3>

            <p>
              Tell us your destination, date, guests
              and requirement.
            </p>

            <button
              type="button"
              className="text-link inquiry-button"
              onClick={() => {
                setError("");
                setSuccess(false);
                setShowPopup(true);
              }}
            >
              Start Inquiry →
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          FULL INQUIRY FORM
      ========================= */}

      <section className="section inquiry-section">
        <div className="center-heading">
          <p className="eyebrow">
            SEND YOUR REQUIREMENT
          </p>

          <h2>
            Tell us what <span>you need.</span>
          </h2>

          <p className="section-subtitle">
            Share your travel, hotel, villa or event
            requirement and our team will contact you.
          </p>
        </div>

        <form
          className="inquiry-form"
          onSubmit={submitInquiry}
        >
          <div className="form-grid">
            {/* NAME */}

            <div className="form-field">
              <label>Full Name *</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            {/* PHONE */}

            <div className="form-field">
              <label>Phone Number *</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />

              <small>
                Enter exactly 10 digits.
              </small>
            </div>

            {/* EMAIL */}

            <div className="form-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            {/* REQUIREMENT */}

            <div className="form-field">
              <label>Requirement *</label>

              <select
                name="inquiryType"
                value={form.inquiryType}
                onChange={handleChange}
                required
              >
                <option>Hotel / Stay</option>
                <option>Villa / Resort</option>
                <option>Event</option>
                <option>Wedding</option>
                <option>Corporate Event</option>
                <option>Package</option>
                <option>Other</option>
              </select>
            </div>

            {/* DESTINATION */}

            <div className="form-field">
              <label>Destination</label>

              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Udaipur"
              />
            </div>

            {/* GUESTS */}

            <div className="form-field">
              <label>Guests</label>

              <input
                name="guests"
                value={form.guests}
                onChange={handleChange}
                placeholder="e.g. 4 Adults"
              />
            </div>

            {/* CHECK-IN */}

            <div className="form-field">
              <label>
                Check-in / Event Date
              </label>

              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                min={today}
              />
            </div>

            {/* CHECK-OUT */}

            <div className="form-field">
              <label>
                Check-out / End Date
              </label>

              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                min={checkoutMin}
                disabled={!form.checkIn}
              />
            </div>

            {/* MESSAGE */}

            <div className="form-field full-width">
              <label>
                Requirement / Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your requirement..."
                rows={5}
              />
            </div>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-success">
              ✓ Inquiry submitted successfully.
              Our team will contact you shortly.
            </div>
          )}

          <button
            type="submit"
            className="button button-gold submit-button"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Inquiry →"}
          </button>
        </form>
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className="cta-section">
        <div>
          <p className="eyebrow gold">
            SAWARIYA EVENT
          </p>

          <h2>
            Ready when
            <br />
            <em>you are.</em>
          </h2>

          <a
            className="button button-gold"
            href={wa(
              "Hello Sawariya Hospitality, I would like to make an inquiry."
            )}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Us ↗
          </a>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">
        <div className="footer-brand">
          <img
            src="/sawariya-logo.jpeg"
            alt="Sawariya Event"
          />

          <p>
            Event Management & Hotel Booking
          </p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Explore</strong>

            <a href="/properties">
              Properties
            </a>

            <a href="/events">
              Events
            </a>

            <a href="/packages">
              Packages
            </a>
          </div>

          <div>
            <strong>Company</strong>

            <a href="/about">
              About Us
            </a>

            <a href="/contact">
              Contact
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Sawariya Event
          </span>

          <span>
            Event Management & Hotel Booking
          </span>
        </div>
      </footer>

      {/* =========================
          AUTO POPUP
      ========================= */}

      {showPopup && (
        <div
          className="inquiry-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowPopup(false);
            }
          }}
        >
          <div className="inquiry-modal">
            <button
              type="button"
              className="inquiry-close"
              onClick={() => setShowPopup(false)}
              aria-label="Close inquiry form"
            >
              ×
            </button>

            <p className="eyebrow gold">
              SAWARIYA EVENT
            </p>

            <h2>
              Plan your{" "}
              <span>stay or event.</span>
            </h2>

            <p className="modal-description">
              Tell us a few details and our team
              will get back to you.
            </p>

            <form onSubmit={submitInquiry}>
              <div className="modal-form-grid">
                {/* NAME */}

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  required
                />

                {/* PHONE */}

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10 digit mobile number *"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />

                {/* EMAIL */}

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                />

                {/* TYPE */}

                <select
                  name="inquiryType"
                  value={form.inquiryType}
                  onChange={handleChange}
                >
                  <option>
                    Hotel / Stay
                  </option>

                  <option>
                    Villa / Resort
                  </option>

                  <option>
                    Event
                  </option>

                  <option>
                    Wedding
                  </option>

                  <option>
                    Corporate Event
                  </option>

                  <option>
                    Package
                  </option>

                  <option>
                    Other
                  </option>
                </select>

                {/* DESTINATION */}

                <input
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="Destination"
                />

                {/* GUESTS */}

                <input
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  placeholder="Guests"
                />

                {/* CHECK-IN */}

                <input
                  type="date"
                  name="checkIn"
                  value={form.checkIn}
                  onChange={handleChange}
                  min={today}
                />

                {/* CHECK-OUT */}

                <input
                  type="date"
                  name="checkOut"
                  value={form.checkOut}
                  onChange={handleChange}
                  min={checkoutMin}
                  disabled={!form.checkIn}
                />

                {/* MESSAGE */}

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your requirement..."
                  rows={4}
                />
              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="form-success">
                  ✓ Inquiry submitted successfully!
                </div>
              )}

              <button
                type="submit"
                className="button button-gold modal-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Send Inquiry →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}