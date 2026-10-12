'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '../../lib/properties';

type Property = { slug:string; name:string; type:string; location:string; city?:string; price:number; rating:number; guests:number; featured?:boolean; image:string; description:string; amenities?:string[]; rooms?:any[] };

const whatsapp = (message: string) => `https://wa.me/9116667045?text=${encodeURIComponent(message)}`;

export default function PropertiesPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [guests, setGuests] = useState('Any');
  const [sort, setSort] = useState('Featured');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/properties', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => { if (active) setProperties(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setProperties([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const result = properties.filter((property) => {
      const matchesQuery = `${property.name} ${property.city} ${property.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = type === 'All' || property.type === type;
      const matchesGuests = guests === 'Any' || property.guests >= Number(guests);
      return matchesQuery && matchesType && matchesGuests;
    });

    if (sort === 'Price: Low to High') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') return [...result].sort((a, b) => b.price - a.price);
    if (sort === 'Rating') return [...result].sort((a, b) => b.rating - a.rating);
    return [...result].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [properties, query, type, guests, sort]);

  return (
    <main>
      <header className="site-header properties-header">
        <Link className="brand" href="/" aria-label="Sawariya Event home">
          <img src="/sawariya-logo.jpeg" alt="Sawariya Event" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link className="active-nav" href="/properties">Properties</Link>
          <Link href="/events">Events</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <a className="header-whatsapp" href={whatsapp('Hello Sawariya Hospitality, I would like to make a property inquiry.')} target="_blank" rel="noreferrer">
          WhatsApp <span>↗</span>
        </a>
      </header>

      <section className="properties-hero">
        <div>
          <p className="eyebrow gold">SAWARIYA EVENT</p>
          <h1>Find Your <em>Perfect Stay.</em></h1>
          <p>Explore curated hotels, resorts, villas and venues. Tell us what you need and our team will help you take it forward.</p>
        </div>
      </section>

      <section className="property-browser section-light">
        <div className="property-search-bar">
          <div className="property-search-main">
            <span>SEARCH</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by property or destination" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type">
            <option>All</option>
            <option>Hotel</option>
            <option>Resort</option>
            <option>Villa</option>
            <option>Homestay</option>
            <option>Event Venue</option>
          </select>
          <select value={guests} onChange={(e) => setGuests(e.target.value)} aria-label="Guest capacity">
            <option value="Any">Any guests</option>
            <option value="2">2+ guests</option>
            <option value="4">4+ guests</option>
            <option value="8">8+ guests</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort properties">
            <option>Featured</option>
            <option>Rating</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="property-results-heading">
          <div>
            <p className="eyebrow">CURATED PROPERTIES</p>
            <h2>{filtered.length} {filtered.length === 1 ? 'Property' : 'Properties'} Found</h2>
          </div>
          {(query || type !== 'All' || guests !== 'Any') && (
            <button className="clear-filters" onClick={() => { setQuery(''); setType('All'); setGuests('Any'); }}>Clear filters ×</button>
          )}
        </div>

        {loading ? (
          <div className="empty-properties"><h3>Loading properties…</h3><p>Please wait while we load the latest inventory.</p></div>
        ) : filtered.length ? (
          <div className="property-grid property-grid-page">
            {filtered.map((property) => (
              <article className="property-card" key={property.slug}>
                <Link href={`/properties/${property.slug}`} className="property-image property-image-link" style={{ backgroundImage: `url(${property.image})` }}>
                  {property.featured && <span className="image-badge">FEATURED</span>}
                </Link>
                <div className="property-body">
                  <div className="property-topline"><span className="stars">★★★★★</span><span className="rating">{property.rating}</span><span className="type-pill">{property.type}</span></div>
                  <h3>{property.name}</h3>
                  <p className="muted">⌖ {property.location}</p>
                  <p className="property-description">{property.description}</p>
                  <div className="property-footer">
                    <div><small>Starting from</small><strong>{formatPrice(property.price)} <i>{property.type === 'Event Venue' ? '/ event' : '/ night'}</i></strong></div>
                    <Link href={`/properties/${property.slug}`} className="property-details-link">View Details →</Link>
                  </div>
                  <a className="property-wa" href={whatsapp(`Hello Sawariya Hospitality, I am interested in ${property.name} in ${property.location}. Please share availability and the best available rate.`)} target="_blank" rel="noreferrer">Inquire on WhatsApp ↗</a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-properties">
            <h3>No matching properties</h3>
            <p>Try another destination, property type or guest count.</p>
            <button className="button button-navy" onClick={() => { setQuery(''); setType('All'); setGuests('Any'); }}>Reset Search</button>
          </div>
        )}
      </section>

      <section className="properties-bottom-cta">
        <p className="eyebrow gold">CAN'T FIND WHAT YOU NEED?</p>
        <h2>Tell us what you're <em>looking for.</em></h2>
        <p>Send your dates, guest count and preferred destination. Our team will help you with suitable options.</p>
        <a className="button button-gold" href={whatsapp('Hello Sawariya Hospitality, I am looking for a stay. Please help me with suitable property options.')} target="_blank" rel="noreferrer">Ask on WhatsApp ↗</a>
      </section>

      <footer className="footer">
        <div className="footer-brand"><img src="/sawariya-logo.jpeg" alt="Sawariya Event" /><p>Event Management & Hotel Booking</p></div>
        <div className="footer-links">
          <div><strong>Explore</strong><Link href="/properties">Properties</Link><Link href="/events">Events</Link><Link href="/packages">Packages</Link></div>
          <div><strong>Company</strong><Link href="/about">About Us</Link><Link href="/contact">Contact</Link></div>
          <div><strong>Connect</strong><a href={whatsapp('Hello Sawariya Hospitality, I would like to make an inquiry.')} target="_blank" rel="noreferrer">WhatsApp</a><Link href="/contact">Instagram</Link></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Sawariya Event. All rights reserved.</span><span>Privacy · Terms</span></div>
      </footer>
    </main>
  );
}
