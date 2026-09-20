import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice } from '../../../lib/properties';
import { getProperties } from '../../../lib/property-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WHATSAPP_NUMBER = '9116667045';

const whatsapp = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type Room = {
  name: string;
  image: string;
  capacity: number;
  bed: string;
  size: string;
  price: number;
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const properties = await getProperties();

  const property = properties.find((item: any) => item.slug === slug);

  if (!property) notFound();

  return (
    <main>
      {/* HEADER */}
      <header className="site-header properties-header">
        <Link
          className="brand"
          href="/"
          aria-label="Sawariya Event home"
        >
          <img
            src="/sawariya-logo.jpeg"
            alt="Sawariya Event"
          />
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          <Link href="/">Home</Link>
          <Link
            className="active-nav"
            href="/properties"
          >
            Properties
          </Link>
          <Link href="/events">Events</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <a
          className="header-whatsapp"
          href={whatsapp(
            `Hello Sawariya Hospitality, I am interested in ${property.name}. Please help me with availability.`
          )}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp <span>↗</span>
        </a>
      </header>

      {/* HERO */}
      <section className="property-detail-hero">
        <div
          className="property-detail-image"
          style={{
            backgroundImage: `url(${property.image})`,
          }}
        />

        <div className="property-detail-overlay" />

        <div className="property-detail-title">
          <Link
            href="/properties"
            className="back-link"
          >
            ← All Properties
          </Link>

          <p className="eyebrow gold">
            {property.type}
          </p>

          <h1>{property.name}</h1>

          <p>
            ⌖ {property.location} &nbsp; · &nbsp; ★{' '}
            {property.rating}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="property-detail-content">
        <div className="property-detail-main">

          {/* ABOUT */}
          <div className="detail-intro">
            <p className="eyebrow">
              ABOUT THE PROPERTY
            </p>

            <h2>
              Comfort, hospitality &{' '}
              <span>memorable stays.</span>
            </h2>

            <p>{property.description}</p>
          </div>

          {/* AMENITIES */}
          <div className="detail-section">
            <p className="eyebrow">
              AMENITIES
            </p>

            <div className="amenities-grid">
              {property.amenities.map(
                (amenity: string) => (
                  <div
                    className="amenity-item"
                    key={amenity}
                  >
                    ✓ <span>{amenity}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ROOMS */}
          <div className="detail-section">
            <div className="rooms-heading">
              <div>
                <p className="eyebrow">
                  ROOMS
                </p>

                <h2>
                  Choose your <span>room.</span>
                </h2>
              </div>

              <span>
                {property.rooms.length}{' '}
                room{' '}
                {property.rooms.length === 1
                  ? 'type'
                  : 'types'}
              </span>
            </div>

            {property.rooms.length ? (
              <div className="detail-room-list">
                {property.rooms.map(
                  (room: Room) => (
                    <article
                      className="detail-room-card"
                      key={room.name}
                    >
                      <div
                        className="detail-room-image"
                        style={{
                          backgroundImage: `url(${room.image})`,
                        }}
                      />

                      <div className="detail-room-info">
                        <p className="eyebrow">
                          ROOM
                        </p>

                        <h3>{room.name}</h3>

                        <p>
                          {room.capacity} Guests ·{' '}
                          {room.bed} · {room.size}
                        </p>

                        <strong>
                          {formatPrice(room.price)}{' '}
                          <small>/ night</small>
                        </strong>

                        <a
                          className="button button-navy"
                          href={whatsapp(
                            `Hello Sawariya Hospitality, I am interested in ${property.name} - ${room.name}. Check-in: [date], Check-out: [date], Guests: ${room.capacity}. Please share availability and the best available rate.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Inquire on WhatsApp ↗
                        </a>
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="venue-note">
                This is an event venue. For capacity,
                availability and package details, please
                send an event inquiry.
              </div>
            )}
          </div>

          {/* LOCATION */}
          <div className="detail-section">
            <p className="eyebrow">
              LOCATION
            </p>

            <div className="map-embed">
              <iframe
                title={`Map of ${property.location}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  property.location
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              className="map-open-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                property.location
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>

        {/* INQUIRY SIDEBAR */}
        <aside className="inquiry-sidebar">
          <div className="inquiry-card">
            <p className="eyebrow gold">
              QUICK INQUIRY
            </p>

            <h3>
              Planning a stay at{' '}
              <span>{property.name}?</span>
            </h3>

            <p>
              Send us your dates and guest details.
              Our team will confirm availability and
              the best available rate on WhatsApp.
            </p>

            <a
              className="button button-gold full-button"
              href={whatsapp(
                `Hello Sawariya Hospitality, I am interested in ${property.name} in ${property.location}. Check-in: [date], Check-out: [date], Guests: [number]. Please share availability and the best available rate.`
              )}
              target="_blank"
              rel="noreferrer"
            >
              Send Inquiry on WhatsApp ↗
            </a>

            <div className="inquiry-divider" />

            <a
              href="tel:+919116667045"
              className="contact-mini"
            >
              📞 +91 9116667045
            </a>

            <a
              href="mailto:Sawariyaevent00@gmail.com"
              className="contact-mini"
            >
              ✉ Sawariyaevent00@gmail.com
            </a>
          </div>
        </aside>
      </section>

      {/* FOOTER */}
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
            <Link href="/properties">
              Properties
            </Link>
            <Link href="/events">
              Events
            </Link>
            <Link href="/packages">
              Packages
            </Link>
          </div>

          <div>
            <strong>Company</strong>
            <Link href="/about">
              About Us
            </Link>
            <Link href="/contact">
              Contact
            </Link>
          </div>

          <div>
            <strong>Connect</strong>

            <a
              href={whatsapp(
                'Hello Sawariya Hospitality, I would like to make an inquiry.'
              )}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>

            <a href="mailto:Sawariyaevent00@gmail.com">
              Email
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Sawariya Event. All rights reserved.
          </span>

          <span>
            Privacy · Terms
          </span>
        </div>
      </footer>
    </main>
  );
}