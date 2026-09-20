"use client";

import { useEffect, useMemo, useState } from "react";

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
  if (Number.isNaN(date.getTime())) return getToday();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function InquiryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>(initialForm);
  const today = useMemo(() => getToday(), []);

  const checkoutMin = useMemo(
    () => (form.checkIn ? getNextDay(form.checkIn) : today),
    [form.checkIn, today]
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: value.replace(/\D/g, "").slice(0, 10) }));
      setError("");
      return;
    }

    if (name === "checkIn") {
      setForm((prev) => ({
        ...prev,
        checkIn: value,
        checkOut: prev.checkOut && prev.checkOut > value ? prev.checkOut : "",
      }));
      setError("");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!/^\d{10}$/.test(form.phone.trim())) {
      return "Please enter a valid 10-digit mobile number.";
    }
    if (form.checkIn && form.checkIn < today) {
      return "Check-in / Event Date cannot be before today.";
    }
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) {
      return "Check-out / End Date must be after the Check-in / Event Date.";
    }
    return "";
  };

  const submitInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Something went wrong.");

      setSuccess(true);
      setForm(initialForm);
      setTimeout(() => {
        setShowPopup(false);
        setSuccess(false);
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div
      className="inquiry-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setShowPopup(false);
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

        <p className="eyebrow gold">SAWARIYA EVENT</p>
        <h2>Plan your <span>stay or event.</span></h2>
        <p className="modal-description">Tell us a few details and our team will get back to you.</p>

        <form onSubmit={submitInquiry}>
          <div className="modal-form-grid">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" required />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number *"
              inputMode="numeric"
              maxLength={10}
              pattern="[0-9]{10}"
              required
            />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
            <select name="inquiryType" value={form.inquiryType} onChange={handleChange}>
              <option>Hotel / Stay</option>
              <option>Villa / Resort</option>
              <option>Event</option>
              <option>Wedding</option>
              <option>Corporate Event</option>
              <option>Package</option>
              <option>Other</option>
            </select>
            <input name="destination" value={form.destination} onChange={handleChange} placeholder="Destination" />
            <input name="guests" value={form.guests} onChange={handleChange} placeholder="Guests" />
            <input type="date" name="checkIn" value={form.checkIn} min={today} onChange={handleChange} />
            <input type="date" name="checkOut" value={form.checkOut} min={checkoutMin} onChange={handleChange} />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your requirement..." rows={4} />
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">✓ Inquiry submitted successfully!</div>}

          <button type="submit" className="button button-gold modal-submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Send Inquiry →"}
          </button>
        </form>
      </div>
    </div>
  );
}
