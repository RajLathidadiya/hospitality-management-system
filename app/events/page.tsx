'use client';

import { useEffect, useState } from 'react';

const WHATSAPP_NUMBER = '9116667045';
const wa = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type EventItem = { slug:string; title:string; kicker:string; text:string; image:string; services:string[] };


export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch('/api/events', { cache: 'no-store' }).then(r => r.json()).then(data => { if (active) setEvents(Array.isArray(data) ? data : []); }).catch(() => { if (active) setEvents([]); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <main>
    <header className="site-header properties-header">
      <a className="brand" href="/"><img src="/sawariya-logo.jpeg" alt="Sawariya Event" /></a>
      <nav className="desktop-nav"><a href="/">Home</a><a href="/properties">Properties</a><a className="active-nav" href="/events">Events</a><a href="/packages">Packages</a><a href="/about">About</a></nav>
      <a className="header-whatsapp" href={wa('Hello Sawariya Hospitality, I want to plan an event. Please share your event management options.')} target="_blank" rel="noreferrer">WhatsApp ↗</a>
    </header>

    <section className="events-hero">
      <div>
        <p className="eyebrow gold">SAWARIYA EVENT</p>
        <h1>Make every moment <em>memorable.</em></h1>
        <p>Event management, venues and hospitality support for celebrations that deserve to be done properly.</p>
        <a className="button button-gold" href={wa('Hello Sawariya Hospitality, I want to plan an event. Please share your options and process.')} target="_blank" rel="noreferrer">Plan Your Event ↗</a>
      </div>
    </section>

    <section className="section section-light event-catalog">
      <div className="center-heading"><p className="eyebrow">EVENT CATEGORIES</p><h2>Choose your <span>occasion.</span></h2><p>Tell us the occasion, guest count and preferred date. We’ll help you shortlist the right option.</p></div>
      <div className="event-catalog-grid">
        {loading ? <p className="muted">Loading events…</p> : events.map((event, i) => <a className="event-catalog-card" href={`/events/${event.slug}`} key={event.slug}>
          <div className="event-catalog-image" style={{backgroundImage:`url(${event.image})`}}><span>0{i+1}</span></div>
          <div className="event-catalog-body"><p className="eyebrow">{event.kicker}</p><h3>{event.title}</h3><p>{event.text}</p><b>Explore event →</b></div>
        </a>)}
      </div>
    </section>

    <section className="events-process">
      <div className="center-heading"><p className="eyebrow gold">HOW IT WORKS</p><h2>One inquiry. <em>One team.</em></h2></div>
      <div className="process-grid">
        {[['01','Share your requirement','Date, guest count, city and what you need.'],['02','Get curated options','We shortlist suitable venues, stays and services.'],['03','Coordinate with you','We connect the pieces and keep the process moving.'],['04','Celebrate','You focus on your guests. We handle the coordination.']].map(([n,t,d]) => <div className="process-item" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
      </div>
    </section>

    <section className="cta-section"><div><p className="eyebrow gold">LET'S PLAN IT</p><h2>Your event starts with<br/><em>one simple inquiry.</em></h2><p>WhatsApp your date, city and guest count. Our team will take it from there.</p><a className="button button-gold" href={wa('Hello Sawariya Hospitality, I want to plan an event. Date: __ City: __ Guests: __ Requirement: __')} target="_blank" rel="noreferrer">Start WhatsApp Inquiry ↗</a></div></section>

    <footer className="footer"><div className="footer-brand"><img src="/sawariya-logo.jpeg" alt="Sawariya Event"/><p>Event Management & Hotel Booking</p></div><div className="footer-links"><div><strong>Explore</strong><a href="/">Home</a><a href="/properties">Properties</a><a href="/events">Events</a></div><div><strong>Contact</strong><a href={wa('Hello Sawariya Hospitality, I need assistance.')} target="_blank" rel="noreferrer">WhatsApp</a><a href="tel:+919116667045">+91 911667045</a><a href="mailto:Sawariyaevent00@gmail.com">Sawariyaevent00@gmail.com</a></div></div><div className="footer-bottom"><span>© 2026 Sawariya Event</span><span>Event Management & Hotel Booking</span></div></footer>
  </main>;
}
