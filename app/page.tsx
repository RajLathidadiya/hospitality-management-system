export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getProperties } from '../lib/property-data';
import { readCollection } from '../lib/db';
import InquiryPopup from './components/InquiryPopup';
type PropertyItem = {
  slug: string;
  name: string;
  type: string;
  location: string;
  city?: string;
  price: number;
  rating: number;
  guests: number;
  featured?: boolean;
  image: string;
  description: string;
  amenities?: string[];
  rooms?: any[];
};



const WHATSAPP_NUMBER = '9116667045';
const wa = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type Property = {
  name: string; slug: string; location: string; price: number; image: string; rating?: number; featured?: boolean;
};
type EventItem = { slug: string; title: string; text: string; image: string; kicker?: string };

const categories = [
  ['Hotels', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85'],
  ['Resorts', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=85'],
  ['Villas', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85'],
  ['Event Venues', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85'],
];

export default async function Home() {
  const [properties, events] = await Promise.all([
    readCollection<PropertyItem>('properties.json'),
    readCollection<EventItem>('events.json'),
  ]);
  const featuredProperties = properties.filter((p) => p.featured).slice(0, 3);
  const featuredEvents = events.slice(0, 4);

  return (
    <main>
      <InquiryPopup />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Sawariya Event home"><img src="/sawariya-logo.jpeg" alt="Sawariya Event - Event Management and Hotel Booking" /></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/properties">Properties</a><a href="/events">Events</a><a href="/packages">Packages</a><a href="/about">About</a><a href="/contact">Contact</a>
        </nav>
        <a className="header-whatsapp" href={wa('Hello Sawariya Hospitality, I would like to make an inquiry.')} target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a>
      </header>

      <section id="top" className="hero">
        <div className="hero-image" /><div className="hero-overlay" />
        <div className="hero-content"><p className="eyebrow gold">SAWARIYA EVENT</p><h1>Discover. Stay.<br /><em>Celebrate.</em></h1><p className="hero-copy">Premium stays and thoughtfully managed events — all through one trusted hospitality partner.</p><div className="hero-actions"><a className="button button-gold" href="/properties">Explore Properties</a><a className="button button-outline" href="/events">Plan Your Event</a></div></div>
        <div className="search-card" aria-label="Stay inquiry">
          <div className="search-field"><span>Destination / Property</span><strong>Where are you going?</strong></div><div className="search-field"><span>Check-in</span><strong>Select date</strong></div><div className="search-field"><span>Check-out</span><strong>Select date</strong></div><div className="search-field"><span>Guests</span><strong>2 Adults</strong></div>
          <a className="search-button" href={wa('Hello Sawariya Hospitality, I want to inquire about a stay. Please share available properties and rates.')} target="_blank" rel="noreferrer">Search / Inquiry</a>
        </div>
      </section>

      <section id="properties" className="section section-light">
        <div className="section-heading"><div><p className="eyebrow">CURATED STAYS</p><h2>Stay Somewhere <span>Special.</span></h2></div><a className="text-link" href="/properties">View all properties <b>→</b></a></div>
        <div className="property-grid">
          {featuredProperties.map((property) => <article className="property-card" key={property.slug}>
            <a className="property-image property-image-link" href={`/properties/${property.slug}`} style={{ backgroundImage: `url(${property.image})` }} aria-label={`View ${property.name}`}><span className="image-badge">FEATURED</span><span className="heart" aria-hidden="true">♡</span></a>
            <div className="property-body"><div className="property-topline"><span className="stars">★★★★★</span><span className="rating">{property.rating ?? '—'}</span></div><h3>{property.name}</h3><p className="muted">⌖ {property.location}</p><div className="property-footer"><div><small>Starting from</small><strong>₹{Number(property.price || 0).toLocaleString('en-IN')} <i>/ night</i></strong></div><a href={wa(`Hello Sawariya Hospitality, I am interested in ${property.name} in ${property.location}. Please share availability and the best available rate.`)} target="_blank" rel="noreferrer">Inquire →</a></div></div>
          </article>)}
          {!featuredProperties.length && <p className="muted">No featured properties yet. Add a property from the Admin Panel.</p>}
        </div>
      </section>

      <section className="section section-cream"><div className="center-heading"><p className="eyebrow">FIND YOUR STYLE</p><h2>Choose Your <span>Stay.</span></h2><p>From intimate villas to full-service resorts and memorable event venues.</p></div><div className="category-grid">{categories.map(([name, image]) => <a className="category-card" href="/properties" key={name}><div style={{ backgroundImage: `url(${image})` }} /><span>{name}</span><b>Explore →</b></a>)}</div></section>

      <section id="events" className="event-feature"><div className="event-feature-image" /><div className="event-feature-content"><p className="eyebrow gold">EVENT MANAGEMENT</p><h2>Make Every Moment<br /><em>Memorable.</em></h2><p>Weddings, corporate gatherings, private celebrations and more — we bring the venue, planning and hospitality together under one roof.</p><a className="button button-gold" href="/events">Explore Events</a></div></section>

      <section className="section section-light event-list" id="packages"><div className="center-heading"><p className="eyebrow">EVENT EXPERIENCES</p><h2>Celebrate It <span>Your Way.</span></h2><p>Explore our event categories and packages.</p></div><div className="event-grid">{featuredEvents.map((event, index) => <a className="event-card" key={event.slug} href={`/events/${event.slug}`}><span>0{index + 1}</span><div><h3>{event.title}</h3><p>{event.text}</p></div><b>↗</b></a>)}</div><div style={{textAlign:'center',marginTop:'28px'}}><a className="button button-navy" href="/packages">View Packages</a></div></section>

      <section className="destination-section"><div className="destination-copy"><p className="eyebrow gold">POPULAR DESTINATIONS</p><h2>Beautiful places.<br /><em>Better stays.</em></h2><p>Discover handpicked hospitality experiences across destinations that deserve more than a quick visit.</p><a className="button button-outline" href="/properties">Explore Properties</a></div><div className="destination-image" /></section>

      <section id="about" className="section section-cream why-section"><div className="center-heading"><p className="eyebrow">THE SAWARIYA DIFFERENCE</p><h2>Hospitality, <span>handled.</span></h2><p>Learn more about the team and approach behind Sawariya Event.</p><a className="text-link" href="/about">About Sawariya →</a></div><div className="why-grid">{[['01','Curated Properties','Thoughtfully selected stays and venues.'],['02','Easy Inquiry','Tell us what you need. We take it from there.'],['03','Personal Assistance','Real people helping you find the right option.'],['04','Event Expertise','From venue to celebration, managed with care.']].map(([number,title,text]) => <div className="why-item" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div></section>

      <section className="cta-section" id="contact"><div><p className="eyebrow gold">LET'S MAKE IT HAPPEN</p><h2>Ready to plan your<br /><em>stay or event?</em></h2><p>Send us your requirement on WhatsApp or visit our contact page.</p><div className="hero-actions"><a className="button button-gold" href={wa('Hello Sawariya Hospitality, I would like to make an inquiry.')} target="_blank" rel="noreferrer">Chat on WhatsApp ↗</a><a className="button button-outline" href="/contact">Contact Us</a></div></div></section>

      <footer className="footer"><div className="footer-brand"><img src="/sawariya-logo.jpeg" alt="Sawariya Event" /><p>Event Management & Hotel Booking</p></div><div className="footer-links"><div><strong>Explore</strong><a href="/properties">Properties</a><a href="/events">Events</a><a href="/packages">Packages</a></div><div><strong>Company</strong><a href="/about">About Us</a><a href="/contact">Contact</a></div><div><strong>Connect</strong><a href={wa('Hello Sawariya Hospitality, I would like to make an inquiry.')} target="_blank" rel="noreferrer">WhatsApp</a><a href="/contact">Instagram</a></div></div><div className="footer-bottom"><span>© 2026 Sawariya Event. All rights reserved.</span><span>Privacy · Terms</span></div></footer>
    </main>
  );
}
