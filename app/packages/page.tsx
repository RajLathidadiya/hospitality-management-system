'use client';

import { useEffect, useState } from 'react';

type PackageItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
};

const WHATSAPP_NUMBER = '9116667045';

const wa = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/packages', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPackages(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setPackages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <header className="site-header properties-header">
        <a className="brand" href="/">
          <img src="/sawariya-logo.jpeg" alt="Sawariya Event" />
        </a>

        <nav className="desktop-nav">
          <a href="/">Home</a>
          <a href="/properties">Properties</a>
          <a href="/events">Events</a>
          <a className="active-nav" href="/packages">
            Packages
          </a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>

        <a
          className="header-whatsapp"
          href={wa(
            'Hello Sawariya Hospitality, I want to know about your event packages.'
          )}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp ↗
        </a>
      </header>

      <section className="events-hero">
        <div>
          <p className="eyebrow gold">SAWARIYA EVENT</p>

          <h1>
            Event packages, <em>made simple.</em>
          </h1>

          <p>
            Choose a starting package and tell us your date, guest count and
            requirements. We will tailor the details with you.
          </p>

          <a
            className="button button-gold"
            href={wa(
              'Hello Sawariya Hospitality, I want to discuss an event package.'
            )}
            target="_blank"
            rel="noreferrer"
          >
            Discuss a Package ↗
          </a>
        </div>
      </section>

      <section className="section section-light">
        <div className="center-heading">
          <p className="eyebrow">PACKAGES</p>
          <h2>
            Start with the <span>right fit.</span>
          </h2>
        </div>

        {loading ? (
          <div className="empty-properties">
            <h3>Loading packages…</h3>
            <p>Please wait while we load the latest packages.</p>
          </div>
        ) : packages.length ? (
          <div className="event-catalog-grid">
            {packages.map((item, index) => (
              <article className="event-catalog-card" key={item.slug}>
                <div
                  className="event-catalog-image"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                >
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="event-catalog-body">
                  <p className="eyebrow">EVENT PACKAGE</p>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <a
                    href={wa(
                      `Hello Sawariya Hospitality, I am interested in the ${item.title}. Please share details.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <b>Inquire on WhatsApp →</b>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-properties">
            <h3>No packages available</h3>
            <p>Please check back soon.</p>
          </div>
        )}
      </section>

      <section className="cta-section">
        <div>
          <p className="eyebrow gold">CUSTOM REQUIREMENTS</p>

          <h2>
            Need something <em>different?</em>
          </h2>

          <p>
            Send us your event date, city, guest count and requirements. We
            will build the right option with you.
          </p>

          <a
            className="button button-gold"
            href={wa(
              'Hello Sawariya Hospitality, I need a custom event package. Date: __ City: __ Guests: __ Requirement: __'
            )}
            target="_blank"
            rel="noreferrer"
          >
            Custom Inquiry ↗
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <img src="/sawariya-logo.jpeg" alt="Sawariya Event" />
          <p>Event Management & Hotel Booking</p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <a href="/properties">Properties</a>
            <a href="/events">Events</a>
            <a href="/packages">Packages</a>
          </div>

          <div>
            <strong>Company</strong>
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Sawariya Event</span>
          <span>Event Management & Hotel Booking</span>
        </div>
      </footer>
    </main>
 
);
}