import { notFound } from 'next/navigation';
import { readCollection } from '../../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WHATSAPP_NUMBER = '9116667045';

const wa = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type EventItem = {
  slug: string;
  title: string;
  kicker: string;
  text: string;
  image: string;
  services: string[];
};

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const events = await readCollection<EventItem>('events.json');

  const event = events.find((item) => item.slug === slug);

  if (!event) notFound();

  return (
    <main>
      <header className="site-header properties-header">
        <a className="brand" href="/">
          <img src="/sawariya-logo.jpeg" alt="Sawariya Event" />
        </a>

        <nav className="desktop-nav">
          <a href="/">Home</a>
          <a href="/properties">Properties</a>
          <a className="active-nav" href="/events">Events</a>
          <a href="/packages">Packages</a>
          <a href="/about">About</a>
        </nav>

        <a
          className="header-whatsapp"
          href={wa(
            `Hello Sawariya Hospitality, I am interested in ${event.title} event services.`
          )}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp ↗
        </a>
      </header>

      <section className="event-detail-hero">
        <div
          className="event-detail-image"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="event-detail-overlay" />

        <div className="property-detail-title">
          <a className="back-link" href="/events">
            ← All Events
          </a>

          <p className="eyebrow gold">{event.kicker}</p>

          <h1>{event.title}</h1>

          <p>Event Management & Hospitality Support</p>
        </div>
      </section>

      <section className="event-detail-content">
        <div>
          <p className="eyebrow">THE EXPERIENCE</p>

          <h2>
            Built around <span>your occasion.</span>
          </h2>

          <p className="event-detail-copy">{event.text}</p>

          <div className="detail-section">
            <p className="eyebrow">SERVICES</p>

            <div className="amenities-grid">
              {event.services.map((service: string) => (
                <div className="amenity-item" key={service}>
                  ✓ <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <p className="eyebrow">NEXT STEP</p>

            <div className="venue-note">
              <strong>
                Share your date, city and guest count.
              </strong>
              <br />
              We’ll discuss suitable options, availability and the services
              you need before you decide.
            </div>
          </div>
        </div>

        <aside className="inquiry-sidebar">
          <div className="inquiry-card">
            <p className="eyebrow">PLAN THIS EVENT</p>

            <h3>
              Let’s make it <span>happen.</span>
            </h3>

            <p>
              Send your requirement directly on WhatsApp. No online payment
              is required.
            </p>

            <a
              className="button button-gold full-button"
              href={wa(
                `Hello Sawariya Hospitality, I am interested in ${event.title}. Date: __ City: __ Guests: __ Requirement: __`
              )}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Inquiry ↗
            </a>

            <div className="inquiry-divider" />

            <a className="contact-mini" href="tel:+919116667045">
              ☎ +91 911667045
            </a>

            <a
              className="contact-mini"
              href="mailto:Sawariyaevent00@gmail.com"
            >
              ✉ Sawariyaevent00@gmail.com
            </a>
          </div>
        </aside>
      </section>

      <section className="properties-bottom-cta">
        <p className="eyebrow gold">SAWARIYA EVENT</p>

        <h2>
          Planning something <em>special?</em>
        </h2>

        <p>
          Tell us what you have in mind and we’ll help you find the right
          venue and hospitality setup.
        </p>

        <a
          className="button button-gold"
          href={wa(
            `Hello Sawariya Hospitality, I want to plan a ${event.title} event.`
          )}
          target="_blank"
          rel="noreferrer"
        >
          Start Inquiry ↗
        </a>
      </section>
    </main>
  );
}