    'use client';

    import { useEffect, useMemo, useState } from 'react';

    type Room = {
    id: string;
    name: string;
    price: number;
    capacity: number;
    bed: string;
    size: string;
    image: string;
    status?: string;
    };

    type Property = {
    id: string;
    slug: string;
    name: string;
    type: string;
    location: string;
    price: number;
    guests: number;
    image: string;
    description: string;
    amenities: string[];
    rooms: Room[];
    status?: string;
    };

    type Event = {
    id: string;
    slug: string;
    title: string;
    kicker: string;
    text: string;
    image: string;
    services: string[];
    status?: string;
    };

    type PackageItem = {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    services: string[];
    status?: string;
    };

    type GalleryItem = {
    id: string;
    title: string;
    category: string;
    image: string;
    featured: boolean;
    createdAt: string;
    };

    type Review = {
    id: string;
    name: string;
    rating: number;
    text: string;
    property: string;
    status: string;
    createdAt: string;
    };

    type SiteSettings = {
    id: string;
    businessName: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
    footerText: string;
    };

    type Inquiry = {
    id: string;
    name?: string;
    phone?: string;
    email?: string;
    type?: string;
    item?: string;
    status?: string;
    createdAt?: string;
    };

    type Customer = {
    key: string;
    name: string;
    phone: string;
    email: string;
    inquiries: number;
    lastInquiry: string;
    status: string;
    };

    const nav = [
    'Dashboard',
    'Properties',
    'Rooms',
    'Events',
    'Packages',
    'Inquiries',
    'Customers',
    'Gallery',
    'Reviews',
    'Settings',
    ];

    const blankProperty = {
    name: '',
    type: 'Resort',
    location: 'Udaipur, Rajasthan',
    price: 4999,
    guests: 2,
    image: '',
    description: '',
    amenities: 'WiFi, Parking',
    };

    const blankRoom = {
    name: '',
    price: 4999,
    capacity: 2,
    bed: 'King Bed',
    size: '',
    image: '',
    };

    const blankEvent = {
    title: '',
    kicker: 'EVENT EXPERIENCE',
    text: '',
    image: '',
    services: 'Venue selection, Catering, Event support',
    };

    const blankPackage = {
    title: '',
    description: '',
    image: '',
    services: '',
    };

    const blankGallery = {
    title: '',
    category: 'General',
    image: '',
    featured: false,
    };

    const blankReview = {
    name: '',
    rating: 5,
    text: '',
    property: '',
    status: 'Published',
    };

    const blankSettings: SiteSettings = {
    id: 'site-settings',
    businessName: 'Sawariya Event',
    phone: '+91 9116667045',
    whatsapp: '+91 9116667045',
    email: 'Sawariyaevent00@gmail.com',
    address: 'Udaipur, Rajasthan',
    instagram: '',
    facebook: '',
    footerText: 'Event Management & Hotel Booking',
    };

    const statuses = [
    'New',
    'Contacted',
    'Quotation Sent',
    'Confirmed',
    'Completed',
    'Cancelled',
    ];

    const approvalBadge = (status?: string) => status && status !== 'APPROVED' ? <span style={{ display: 'inline-block', marginTop: 6, padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: status === 'PENDING' ? '#fff7ed' : '#fef2f2', color: status === 'PENDING' ? '#c2410c' : '#b91c1c' }}>{status === 'PENDING' ? 'PENDING APPROVAL' : status}</span> : null;

    export default function Admin() {
    const [active, setActive] = useState('Dashboard');

    const [properties, setProperties] = useState<Property[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [packages, setPackages] = useState<PackageItem[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [settings, setSettings] = useState<SiteSettings>(blankSettings);

    const [showProp, setShowProp] = useState(false);
    const [showEvent, setShowEvent] = useState(false);
    const [showRoom, setShowRoom] = useState(false);
    const [showPackage, setShowPackage] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const [editingProp, setEditingProp] = useState<Property | null>(null);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [editingPackage, setEditingPackage] =
        useState<PackageItem | null>(null);
    const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const [propForm, setPropForm] = useState<any>(blankProperty);
    const [eventForm, setEventForm] = useState<any>(blankEvent);
    const [roomForm, setRoomForm] = useState<any>(blankRoom);
    const [packageForm, setPackageForm] =
        useState<any>(blankPackage);
    const [galleryForm, setGalleryForm] = useState<any>(blankGallery);
    const [propImageFile, setPropImageFile] = useState<File | null>(null);
    const [eventImageFile, setEventImageFile] = useState<File | null>(null);
    const [roomImageFile, setRoomImageFile] = useState<File | null>(null);
    const [packageImageFile, setPackageImageFile] = useState<File | null>(null);
    const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
    const [reviewForm, setReviewForm] = useState<any>(blankReview);
    const [settingsForm, setSettingsForm] = useState<SiteSettings>(blankSettings);

    const [roomProperty, setRoomProperty] =
        useState<Property | null>(null);
    const [editingRoom, setEditingRoom] =
        useState<Room | null>(null);

    const [message, setMessage] = useState('');

    async function load() {
        try {
        const [p, e, pk, i, g, r, s] = await Promise.all([
            fetch('/api/properties'),
            fetch('/api/events'),
            fetch('/api/packages'),
            fetch('/api/inquiries'),
            fetch('/api/gallery'),
            fetch('/api/reviews'),
            fetch('/api/settings'),
        ]);

        if (p.ok) {
            const data = await p.json();
            setProperties(data);
        }

        if (e.ok) {
            const data = await e.json();
            setEvents(data);
        }

        if (pk.ok) {
            const data = await pk.json();

            const normalizedPackages = Array.isArray(data)
            ? data.map((item: any) => ({
                ...item,
                title:
                    item.title ||
                    item.name ||
                    '',
                description:
                    item.description ||
                    item.text ||
                    '',
                image: item.image || '',
                services: Array.isArray(item.services)
                    ? item.services
                    : [],
                }))
            : [];

            setPackages(normalizedPackages);
        }

        if (i.ok) {
            const data = await i.json();
            setInquiries(data);
        }

        if (g.ok) {
            const data = await g.json();
            setGallery(Array.isArray(data) ? data : []);
        }

        if (r.ok) {
            const data = await r.json();
            setReviews(Array.isArray(data) ? data : []);
        }

        if (s.ok) {
            const data = await s.json();
            setSettings(data);
            setSettingsForm(data);
        }
        } catch (error) {
        console.error('Admin load error:', error);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const stats = useMemo(
        () => ({
        properties: properties.length,
        rooms: properties.reduce(
            (n, p) => n + (p.rooms?.length || 0),
            0
        ),
        events: events.length,
        newInquiries: inquiries.filter(
            (i) => (i.status || 'New') === 'New'
        ).length,
        }),
        [properties, events, inquiries]
    );

    /*
    * CUSTOMERS
    * Customers are automatically created/grouped from inquiries.
    * Phone is used as the primary key when available.
    * Email is used when phone is unavailable.
    */
    const customers = useMemo<Customer[]>(() => {
        const map = new Map<string, Customer>();

        inquiries.forEach((inquiry) => {
        const phone = (inquiry.phone || '').trim();
        const email = (inquiry.email || '')
            .trim()
            .toLowerCase();

        const key =
            phone ||
            email ||
            `guest-${inquiry.id}`;

        const existing = map.get(key);

        const inquiryDate = inquiry.createdAt
            ? new Date(inquiry.createdAt)
            : null;

        const existingDate = existing?.lastInquiry
            ? new Date(existing.lastInquiry)
            : null;

        const latestDate =
            inquiryDate &&
            !Number.isNaN(inquiryDate.getTime())
            ? inquiryDate
            : existingDate;

        if (!existing) {
            map.set(key, {
            key,
            name: inquiry.name?.trim() || 'Guest',
            phone: phone || '-',
            email: email || '-',
            inquiries: 1,
            lastInquiry: inquiry.createdAt || '',
            status: inquiry.status || 'New',
            });
        } else {
            existing.inquiries += 1;

            if (
            inquiry.name?.trim() &&
            existing.name === 'Guest'
            ) {
            existing.name = inquiry.name.trim();
            }

            if (
            phone &&
            (!existing.phone || existing.phone === '-')
            ) {
            existing.phone = phone;
            }

            if (
            email &&
            (!existing.email || existing.email === '-')
            ) {
            existing.email = email;
            }

            if (
            latestDate &&
            (!existingDate ||
                latestDate.getTime() >
                existingDate.getTime())
            ) {
            existing.lastInquiry =
                inquiry.createdAt || '';
            existing.status =
                inquiry.status || 'New';
            }
        }
        });

        return Array.from(map.values()).sort(
        (a, b) => {
            const aDate = a.lastInquiry
            ? new Date(a.lastInquiry).getTime()
            : 0;

            const bDate = b.lastInquiry
            ? new Date(b.lastInquiry).getTime()
            : 0;

            return bDate - aDate;
        }
        );
    }, [inquiries]);

    function editProperty(p: Property) {
        setEditingProp(p);

        setPropForm({
        ...p,
        amenities: p.amenities.join(', '),
        });
        setPropImageFile(null);
        setShowProp(true);
    }

    function editEvent(x: Event) {
        setEditingEvent(x);

        setEventForm({
        ...x,
        services: x.services.join(', '),
        });

        setEventImageFile(null);
        setShowEvent(true);
    }

    function editPackage(x: PackageItem) {
        setEditingPackage(x);

        setPackageForm({
        title: x.title,
        description: x.description,
        image: x.image,
        services: x.services.join(', '),
        });

        setPackageImageFile(null);
        setShowPackage(true);
    }

    function editGallery(x: GalleryItem) {
        setEditingGallery(x);
        setGalleryForm({ title: x.title, category: x.category, image: x.image, featured: x.featured });
        setGalleryImageFile(null);
        setShowGallery(true);
    }

    function editReview(x: Review) {
        setEditingReview(x);
        setReviewForm({ name: x.name, rating: x.rating, text: x.text, property: x.property, status: x.status });
        setShowReview(true);
    }

    async function saveGallery(e: any) {
        e.preventDefault();
        try {
            let image = galleryForm.image || '';
            if (galleryImageFile) {
                setMessage('Uploading gallery image...');
                image = await uploadImage(galleryImageFile);
            }
            if (!image) {
                setMessage('Please choose an image file.');
                return;
            }
            const url = editingGallery ? `/api/gallery/${editingGallery.id}` : '/api/gallery';
            const r = await fetch(url, {
                method: editingGallery ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ ...galleryForm, image, featured: Boolean(galleryForm.featured) }),
            });
            const d = await r.json();
            if (!r.ok) { setMessage(d.error || 'Could not save gallery item'); return; }
            setMessage(editingGallery ? 'Gallery item updated successfully' : 'Gallery item added successfully');
            setShowGallery(false); setEditingGallery(null); setGalleryForm(blankGallery); setGalleryImageFile(null); load();
        } catch (error: any) {
            setMessage(error?.message || 'Could not save gallery item');
        }
    }

    async function saveReview(e: any) {
        e.preventDefault();
        const r = await fetch(editingReview ? `/api/reviews/${editingReview.id}` : '/api/reviews', { method: editingReview ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...reviewForm, rating: Number(reviewForm.rating) }) });
        const d = await r.json();
        if (!r.ok) { setMessage(d.error || 'Could not save review'); return; }
        setMessage(editingReview ? 'Review updated successfully' : 'Review added successfully');
        setShowReview(false); setEditingReview(null); setReviewForm(blankReview); load();
    }

    async function removeGallery(id: string) {
        if (!confirm('Delete this gallery item?')) return;
        const r = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (!r.ok) { setMessage('Could not delete gallery item'); return; }
        setMessage('Gallery item deleted successfully'); load();
    }

    async function removeReview(id: string) {
        if (!confirm('Delete this review?')) return;
        const r = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
        if (!r.ok) { setMessage('Could not delete review'); return; }
        setMessage('Review deleted successfully'); load();
    }

    async function saveSettings(e: any) {
        e.preventDefault();
        const r = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsForm) });
        const d = await r.json();
        if (!r.ok) { setMessage(d.error || 'Could not save settings'); return; }
        setSettings(d); setSettingsForm(d); setMessage('Settings saved successfully');
    }

    function updateSettings(key: keyof SiteSettings, value: string) {
        setSettingsForm((prev) => ({ ...prev, [key]: value }));
    }

    function openRoom(p: Property, r?: Room) {
        setRoomProperty(p);
        setEditingRoom(r || null);
        setRoomForm(r || blankRoom);
        setRoomImageFile(null);
        setShowRoom(true);
    }

    async function adminRequest(url: string, method: string, body: any) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        const raw = await response.text();
        let data: any = {};
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch {
            data = { error: raw || 'Unexpected server response' };
        }

        if (!response.ok) {
            throw new Error(
            data.error ||
                data.message ||
                `Request failed (${response.status})`
            );
        }

        return data;
        } catch (error: any) {
        if (error?.name === 'AbortError') {
            throw new Error('Request timed out. Please check the database/server connection.');
        }
        throw error;
        } finally {
        clearTimeout(timeout);
        }
    }

    async function uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'same-origin' });
        const raw = await response.text();
        let data: any = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw || 'Upload failed' }; }
        if (!response.ok) throw new Error(data.error || 'Could not upload image');
        return String(data.url || '');
    }

    async function saveProperty(e: any) {
        e.preventDefault();
        setMessage('Saving property...');

        try {
        let image = propForm.image || '';
        if (propImageFile) {
            setMessage('Uploading property image...');
            image = await uploadImage(propImageFile);
        }
        const body = {
            ...propForm,
            image,
            price: Number(propForm.price) || 0,
            guests: Number(propForm.guests) || 0,
            amenities: String(propForm.amenities || '')
            .split(',')
            .map((x: string) => x.trim())
            .filter(Boolean),
        };

        const url = editingProp
            ? `/api/properties/${editingProp.slug}`
            : '/api/properties';

        await adminRequest(url, editingProp ? 'PUT' : 'POST', body);

        setMessage(
            editingProp
            ? 'Property updated successfully'
            : 'Property submitted for Superadmin approval'
        );
        setShowProp(false);
        setEditingProp(null);
        setPropForm(blankProperty);
        setPropImageFile(null);
        await load();
        } catch (error: any) {
        console.error('Save property error:', error);
        setMessage(error?.message || 'Could not save property');
        }
    }

    async function saveEvent(e: any) {
        e.preventDefault();
        setMessage('Saving event...');

        try {
        let image = eventForm.image || '';
        if (eventImageFile) {
            setMessage('Uploading event image...');
            image = await uploadImage(eventImageFile);
        }
        const body = {
            ...eventForm,
            image,
            services: String(eventForm.services || '')
            .split(',')
            .map((x: string) => x.trim())
            .filter(Boolean),
        };

        const url = editingEvent
            ? `/api/events/${editingEvent.slug}`
            : '/api/events';

        await adminRequest(url, editingEvent ? 'PUT' : 'POST', body);

        setMessage(
            editingEvent
            ? 'Event updated successfully'
            : 'Event submitted for Superadmin approval'
        );
        setShowEvent(false);
        setEditingEvent(null);
        setEventForm(blankEvent);
        setEventImageFile(null);
        await load();
        } catch (error: any) {
        console.error('Save event error:', error);
        setMessage(error?.message || 'Could not save event');
        }
    }

    async function savePackage(e: any) {
        e.preventDefault();
        setMessage('Saving package...');

        try {
        const services = String(packageForm.services || '')
            .split(',')
            .map((x: string) => x.trim())
            .filter(Boolean);

        let image = packageForm.image || '';
        if (packageImageFile) {
            setMessage('Uploading package image...');
            image = await uploadImage(packageImageFile);
        }
        const body = {
            title: packageForm.title,
            name: packageForm.title,
            description: packageForm.description,
            text: packageForm.description,
            image,
            services,
        };

        const url = editingPackage
            ? `/api/packages/${editingPackage.slug}`
            : '/api/packages';

        await adminRequest(url, editingPackage ? 'PUT' : 'POST', body);

        setMessage(
            editingPackage
            ? 'Package updated successfully'
            : 'Package submitted for Superadmin approval'
        );
        setShowPackage(false);
        setEditingPackage(null);
        setPackageForm(blankPackage);
        setPackageImageFile(null);
        await load();
        } catch (error: any) {
        console.error('Save package error:', error);
        setMessage(error?.message || 'Could not save package');
        }
    }

    async function saveRoom(e: any) {
        e.preventDefault();

        if (!roomProperty) return;

        let image = roomForm.image || '';
        if (roomImageFile) {
            setMessage('Uploading room image...');
            image = await uploadImage(roomImageFile);
        }
        const body = {
        ...roomForm,
        image,
        id: editingRoom?.id,
        price: Number(roomForm.price),
        capacity: Number(roomForm.capacity),
        };

        const r = await fetch(
        `/api/properties/${roomProperty.slug}/rooms`,
        {
            method: editingRoom ? 'PUT' : 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
        );

        const d = await r.json();

        if (!r.ok) {
        setMessage(d.error || 'Could not save');
        return;
        }

        setMessage(
        editingRoom
            ? 'Room updated successfully'
            : 'Room submitted for Superadmin approval'
        );

        setShowRoom(false);
        setEditingRoom(null);
        setRoomProperty(null);
        setRoomForm(blankRoom);
        setRoomImageFile(null);

        load();
    }

    async function removeProperty(slug: string) {
        if (!confirm('Delete this property?')) return;

        await fetch(`/api/properties/${slug}`, {
        method: 'DELETE',
        });

        setMessage('Property deleted successfully');
        load();
    }

    async function removeEvent(slug: string) {
        if (!confirm('Delete this event?')) return;

        await fetch(`/api/events/${slug}`, {
        method: 'DELETE',
        });

        setMessage('Event deleted successfully');
        load();
    }

    async function removePackage(slug: string) {
        if (!confirm('Delete this package?')) return;

        const r = await fetch(
        `/api/packages/${slug}`,
        {
            method: 'DELETE',
        }
        );

        if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setMessage(
            d.error || 'Could not delete package'
        );
        return;
        }

        setMessage('Package deleted successfully');
        load();
    }

    async function removeRoom(
        p: Property,
        r: Room
    ) {
        if (!confirm(`Delete ${r.name}?`)) return;

        await fetch(
        `/api/properties/${p.slug}/rooms?roomId=${encodeURIComponent(
            r.id
        )}`,
        {
            method: 'DELETE',
        }
        );

        setMessage('Room deleted successfully');
        load();
    }

    async function updateInquiry(
        id: string,
        status: string
    ) {
        const r = await fetch(
        `/api/inquiries/${id}`,
        {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        }
        );

        if (r.ok) {
        setMessage('Inquiry status updated');
        load();
        }
    }

    async function logout() {
        await fetch('/api/admin/logout', {
        method: 'POST',
        });

        window.location.href = '/admin/login';
    }

    return (
        <main className="admin-shell">
        <aside className="admin-sidebar">
            <div className="admin-brand-wrap">
            <img
                src="/sawariya-logo.jpeg"
                className="admin-logo"
                alt="Sawariya Event"
            />
            </div>

            <div className="admin-label">
            MANAGEMENT
            </div>

            <nav className="admin-nav">
            {nav.map((x) => (
                <button
                key={x}
                className={
                    active === x ? 'active' : ''
                }
                onClick={() => setActive(x)}
                >
                <span className="nav-dot" />
                {x}
                </button>
            ))}
            </nav>

            <button
            className="admin-site-link"
            onClick={logout}
            >
            Logout
            </button>
        </aside>

        <section className="admin-main">
            <header className="admin-topbar">
            <div>
                <p className="admin-kicker">
                SAWARIYA EVENT
                </p>

                <h1>{active}</h1>
            </div>

            <div className="admin-user">
                <span className="admin-avatar">
                A
                </span>

                <div>
                <strong>Administrator</strong>
                <small>Super Admin</small>
                </div>
            </div>
            </header>

            {message && (
            <div className="admin-toast">
                {message}

                <button
                onClick={() => setMessage('')}
                >
                ×
                </button>
            </div>
            )}

            {active === 'Dashboard' && (
            <Dashboard
                stats={stats}
                inquiries={inquiries}
                onGo={setActive}
            />
            )}

            {active === 'Properties' && (
            <PropertyPanel
                properties={properties}
                onAdd={() => {
                setEditingProp(null);
                setPropForm(blankProperty);
                setPropImageFile(null);
                setShowProp(true);
                }}
                onEdit={editProperty}
                onDelete={removeProperty}
            />
            )}

            {active === 'Rooms' && (
            <RoomPanel
                properties={properties}
                onAdd={(p) => openRoom(p)}
                onEdit={openRoom}
                onDelete={removeRoom}
            />
            )}

            {active === 'Events' && (
            <EventPanel
                events={events}
                onAdd={() => {
                setEditingEvent(null);
                setEventForm(blankEvent);
                setEventImageFile(null);
                setShowEvent(true);
                }}
                onEdit={editEvent}
                onDelete={removeEvent}
            />
            )}

            {active === 'Packages' && (
            <PackagePanel
                packages={packages}
                onAdd={() => {
                setEditingPackage(null);
                setPackageForm(blankPackage);
                setPackageImageFile(null);
                setShowPackage(true);
                }}
                onEdit={editPackage}
                onDelete={removePackage}
            />
            )}

            {active === 'Inquiries' && (
            <InquiryPanel
                inquiries={inquiries}
                onStatus={updateInquiry}
            />
            )}

               {active === 'Customers' && (
                 <CustomerPanel
                 customers={customers}
                inquiries={inquiries}
                 />
            )}

            {active === 'Gallery' && (
              <GalleryPanel gallery={gallery} onAdd={() => { setEditingGallery(null); setGalleryForm(blankGallery); setGalleryImageFile(null); setShowGallery(true); }} onEdit={editGallery} onDelete={removeGallery} />
            )}

            {active === 'Reviews' && (
              <ReviewPanel reviews={reviews} onAdd={() => { setEditingReview(null); setReviewForm(blankReview); setShowReview(true); }} onEdit={editReview} onDelete={removeReview} />
            )}

            {active === 'Settings' && (
              <SettingsPanel settings={settingsForm} onChange={updateSettings} onSave={saveSettings} />
            )}

            {![
            'Dashboard',
            'Properties',
            'Rooms',
            'Events',
            'Packages',
            'Inquiries',
            'Customers',
            'Gallery',
            'Reviews',
            'Settings',
            ].includes(active) && (
            <div className="admin-placeholder">
                <div>
                <div className="placeholder-icon">
                    ✦
                </div>

                <h2>
                    {active} Management
                </h2>

                <p>
                    This section is reserved for
                    the next CMS module. Core
                    inventory, rooms, events,
                    packages, customers and inquiry
                    management are now connected.
                </p>
                </div>
            </div>
            )}

            {showGallery && (
              <Modal title={editingGallery ? 'Edit Gallery Item' : 'Add Gallery Item'} onClose={() => { setShowGallery(false); setEditingGallery(null); }}>
                <form className="admin-form" onSubmit={saveGallery}>
                  <label>Title<input value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="Pool, Room, Wedding setup..." /></label>
                  <label>Category<select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}><option>General</option><option>Properties</option><option>Rooms</option><option>Events</option><option>Weddings</option><option>Food</option></select></label>
                  <label>Image File<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" required={!galleryImageFile && !galleryForm.image} onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)} /><small className="admin-file-help">JPG, PNG, WEBP or GIF · max 10 MB · choose a new file only if you want to replace the current image</small>{!galleryImageFile && galleryForm.image ? <img className="admin-image-preview" src={galleryForm.image} alt="Current gallery image" /> : null}</label>
                  <label className="admin-check"><input type="checkbox" checked={Boolean(galleryForm.featured)} onChange={(e) => setGalleryForm({ ...galleryForm, featured: e.target.checked })} /> Featured image</label>
                  <button className="admin-primary">{editingGallery ? 'Update Gallery Item' : 'Save Gallery Item'}</button>
                </form>
              </Modal>
            )}

            {showReview && (
              <Modal title={editingReview ? 'Edit Review' : 'Add Review'} onClose={() => { setShowReview(false); setEditingReview(null); }}>
                <form className="admin-form" onSubmit={saveReview}>
                  <label>Customer Name<input required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} /></label>
                  <div className="form-two"><label>Rating<select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}><option value="5">5 / 5</option><option value="4">4 / 5</option><option value="3">3 / 5</option><option value="2">2 / 5</option><option value="1">1 / 5</option></select></label><label>Status<select value={reviewForm.status} onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}><option>Published</option><option>Hidden</option></select></label></div>
                  <label>Property / Service<input value={reviewForm.property} onChange={(e) => setReviewForm({ ...reviewForm, property: e.target.value })} placeholder="Property or service name" /></label>
                  <label>Review<textarea required value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} rows={5} /></label>
                  <button className="admin-primary">{editingReview ? 'Update Review' : 'Save Review'}</button>
                </form>
              </Modal>
            )}

            {/* PROPERTY MODAL */}

            {showProp && (
            <Modal
                title={
                editingProp
                    ? 'Edit Property'
                    : 'Add Property'
                }
                onClose={() => {
                setShowProp(false);
                setEditingProp(null);
                }}
            >
                <form
                className="admin-form"
                onSubmit={saveProperty}
                >
                <label>
                    Name

                    <input
                    required
                    value={propForm.name}
                    onChange={(e) =>
                        setPropForm({
                        ...propForm,
                        name: e.target.value,
                        })
                    }
                    />
                </label>

                <label>
                    Type

                    <select
                    value={propForm.type}
                    onChange={(e) =>
                        setPropForm({
                        ...propForm,
                        type: e.target.value,
                        })
                    }
                    >
                    <option>Hotel</option>
                    <option>Resort</option>
                    <option>Villa</option>
                    <option>Homestay</option>
                    <option>
                        Event Venue
                    </option>
                    </select>
                </label>

                <label>
                    Location

                    <input
                    value={propForm.location}
                    onChange={(e) =>
                        setPropForm({
                        ...propForm,
                        location:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <div className="form-two">
                    <label>
                    Starting price

                    <input
                        type="number"
                        value={propForm.price}
                        onChange={(e) =>
                        setPropForm({
                            ...propForm,
                            price:
                            e.target.value,
                        })
                        }
                    />
                    </label>

                    <label>
                    Guests

                    <input
                        type="number"
                        value={propForm.guests}
                        onChange={(e) =>
                        setPropForm({
                            ...propForm,
                            guests:
                            e.target.value,
                        })
                        }
                    />
                    </label>
                </div>

                <label>
                    Image File
                    <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required={!propImageFile && !propForm.image}
                    onChange={(e) => setPropImageFile(e.target.files?.[0] || null)}
                    />
                    <small className="admin-file-help">JPG, PNG, WEBP or GIF · max 10 MB · choose a new file only if you want to replace the current image</small>
                    {!propImageFile && propForm.image ? <img className="admin-image-preview" src={propForm.image} alt="Current image" /> : null}
                </label>

                <label>
                    Description

                    <textarea
                    value={propForm.description}
                    onChange={(e) =>
                        setPropForm({
                        ...propForm,
                        description:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <label>
                    Amenities{' '}
                    <small>
                    (comma separated)
                    </small>

                    <input
                    value={propForm.amenities}
                    onChange={(e) =>
                        setPropForm({
                        ...propForm,
                        amenities:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <button className="admin-primary">
                    {editingProp
                    ? 'Update Property'
                    : 'Save Property'}
                </button>
                </form>
            </Modal>
            )}

            {/* EVENT MODAL */}

            {showEvent && (
            <Modal
                title={
                editingEvent
                    ? 'Edit Event'
                    : 'Add Event'
                }
                onClose={() => {
                setShowEvent(false);
                setEditingEvent(null);
                }}
            >
                <form
                className="admin-form"
                onSubmit={saveEvent}
                >
                <label>
                    Title

                    <input
                    required
                    value={eventForm.title}
                    onChange={(e) =>
                        setEventForm({
                        ...eventForm,
                        title:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <label>
                    Kicker

                    <input
                    value={eventForm.kicker}
                    onChange={(e) =>
                        setEventForm({
                        ...eventForm,
                        kicker:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <label>
                    Description

                    <textarea
                    value={eventForm.text}
                    onChange={(e) =>
                        setEventForm({
                        ...eventForm,
                        text:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <label>
                    Image File
                    <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required={!eventImageFile && !eventForm.image}
                    onChange={(e) => setEventImageFile(e.target.files?.[0] || null)}
                    />
                    <small className="admin-file-help">JPG, PNG, WEBP or GIF · max 10 MB · choose a new file only if you want to replace the current image</small>
                    {!eventImageFile && eventForm.image ? <img className="admin-image-preview" src={eventForm.image} alt="Current image" /> : null}
                </label>

                <label>
                    Services{' '}
                    <small>
                    (comma separated)
                    </small>

                    <input
                    value={eventForm.services}
                    onChange={(e) =>
                        setEventForm({
                        ...eventForm,
                        services:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <button className="admin-primary">
                    {editingEvent
                    ? 'Update Event'
                    : 'Save Event'}
                </button>
                </form>
            </Modal>
            )}

            {/* PACKAGE MODAL */}

            {showPackage && (
            <Modal
                title={
                editingPackage
                    ? 'Edit Package'
                    : 'Add Package'
                }
                onClose={() => {
                setShowPackage(false);
                setEditingPackage(null);
                }}
            >
                <form
                className="admin-form"
                onSubmit={savePackage}
                >
                <label>
                    Package Title

                    <input
                    required
                    value={packageForm.title}
                    onChange={(e) =>
                        setPackageForm({
                        ...packageForm,
                        title:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <label>
                    Description

                    <textarea
                    required
                    value={
                        packageForm.description
                    }
                    onChange={(e) =>
                        setPackageForm({
                        ...packageForm,
                        description:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <label>
                    Image File
                    <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required={!packageImageFile && !packageForm.image}
                    onChange={(e) => setPackageImageFile(e.target.files?.[0] || null)}
                    />
                    <small className="admin-file-help">JPG, PNG, WEBP or GIF · max 10 MB · choose a new file only if you want to replace the current image</small>
                    {!packageImageFile && packageForm.image ? <img className="admin-image-preview" src={packageForm.image} alt="Current image" /> : null}
                </label>

                <label>
                    Services{' '}
                    <small>
                    (comma separated)
                    </small>

                    <input
                    value={packageForm.services}
                    onChange={(e) =>
                        setPackageForm({
                        ...packageForm,
                        services:
                            e.target.value,
                        })
                    }
                    />
                </label>

                <button className="admin-primary">
                    {editingPackage
                    ? 'Update Package'
                    : 'Save Package'}
                </button>
                </form>
            </Modal>
            )}

            {/* ROOM MODAL */}

            {showRoom && roomProperty && (
            <Modal
                title={`${editingRoom ? 'Edit' : 'Add'} Room — ${roomProperty.name}`}
                onClose={() => {
                setShowRoom(false);
                setEditingRoom(null);
                setRoomProperty(null);
                }}
            >
                <form
                className="admin-form"
                onSubmit={saveRoom}
                >
                <label>
                    Room Name

                    <input
                    required
                    value={roomForm.name}
                    onChange={(e) =>
                        setRoomForm({
                        ...roomForm,
                        name: e.target.value,
                        })
                    }
                    />
                </label>

                <div className="form-two">
                    <label>
                    Price / night

                    <input
                        type="number"
                        value={roomForm.price}
                        onChange={(e) =>
                        setRoomForm({
                            ...roomForm,
                            price:
                            e.target.value,
                        })
                        }
                    />
                    </label>

                    <label>
                    Capacity

                    <input
                        type="number"
                        value={
                        roomForm.capacity
                        }
                        onChange={(e) =>
                        setRoomForm({
                            ...roomForm,
                            capacity:
                            e.target.value,
                        })
                        }
                    />
                    </label>
                </div>

                <div className="form-two">
                    <label>
                    Bed

                    <input
                        value={roomForm.bed}
                        onChange={(e) =>
                        setRoomForm({
                            ...roomForm,
                            bed:
                            e.target.value,
                        })
                        }
                    />
                    </label>

                    <label>
                    Size

                    <input
                        value={roomForm.size}
                        onChange={(e) =>
                        setRoomForm({
                            ...roomForm,
                            size:
                            e.target.value,
                        })
                        }
                    />
                    </label>
                </div>

                <label>
                    Image File
                    <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required={!roomImageFile && !roomForm.image}
                    onChange={(e) => setRoomImageFile(e.target.files?.[0] || null)}
                    />
                    <small className="admin-file-help">JPG, PNG, WEBP or GIF · max 10 MB · choose a new file only if you want to replace the current image</small>
                    {!roomImageFile && roomForm.image ? <img className="admin-image-preview" src={roomForm.image} alt="Current image" /> : null}
                </label>

                <button className="admin-primary">
                    {editingRoom
                    ? 'Update Room'
                    : 'Save Room'}
                </button>
                </form>
            </Modal>
            )}
        </section>
        </main>
    );
    }

    /* =========================
    GALLERY PANEL
    ========================= */

    function GalleryPanel({ gallery, onAdd, onEdit, onDelete }: { gallery: GalleryItem[]; onAdd: () => void; onEdit: (x: GalleryItem) => void; onDelete: (id: string) => void; }) {
      return (
        <section className="admin-panel">
          <div className="panel-head"><div><p className="admin-kicker">MEDIA LIBRARY</p><h2>Gallery</h2></div><button className="admin-primary" onClick={onAdd}>＋ Add Image</button></div>
          {gallery.length ? <div className="gallery-admin-grid">{gallery.map((x) => <article className="gallery-admin-card" key={x.id}><img src={x.image} alt={x.title || 'Gallery image'} /><div className="gallery-admin-info"><div><strong>{x.title || 'Untitled'}</strong><small>{x.category}{x.featured ? ' · Featured' : ''}</small></div><div className="row-actions"><button className="admin-edit" onClick={() => onEdit(x)}>Edit</button><button className="admin-danger" onClick={() => onDelete(x.id)}>Delete</button></div></div></article>)}</div> : <p className="admin-muted">No gallery images added yet.</p>}
        </section>
      );
    }

    /* =========================
    REVIEWS PANEL
    ========================= */

    function ReviewPanel({ reviews, onAdd, onEdit, onDelete }: { reviews: Review[]; onAdd: () => void; onEdit: (x: Review) => void; onDelete: (id: string) => void; }) {
      return (
        <section className="admin-panel">
          <div className="panel-head"><div><p className="admin-kicker">CUSTOMER FEEDBACK</p><h2>Reviews</h2></div><button className="admin-primary" onClick={onAdd}>＋ Add Review</button></div>
          <div className="admin-list">{reviews.length ? reviews.map((x) => <div className="admin-list-row review-admin-row" key={x.id}><div className="review-stars">{'★'.repeat(Math.max(0, Math.min(5, x.rating)))}</div><div><strong>{x.name}</strong><small>{x.property || 'General'} · {x.status}</small><p>{x.text}</p></div><div className="row-actions"><button className="admin-edit" onClick={() => onEdit(x)}>Edit</button><button className="admin-danger" onClick={() => onDelete(x.id)}>Delete</button></div></div>) : <p className="admin-muted">No reviews added yet.</p>}</div>
        </section>
      );
    }

    /* =========================
    SETTINGS PANEL
    ========================= */

    function SettingsPanel({ settings, onChange, onSave }: { settings: SiteSettings; onChange: (key: keyof SiteSettings, value: string) => void; onSave: (e: any) => void; }) {
      return (
        <section className="admin-panel">
          <div className="panel-head"><div><p className="admin-kicker">SITE CONFIGURATION</p><h2>Settings</h2></div></div>
          <form className="admin-form settings-form" onSubmit={onSave}>
            <div className="form-two"><label>Business Name<input value={settings.businessName} onChange={(e) => onChange('businessName', e.target.value)} /></label><label>Phone<input value={settings.phone} onChange={(e) => onChange('phone', e.target.value)} /></label></div>
            <div className="form-two"><label>WhatsApp<input value={settings.whatsapp} onChange={(e) => onChange('whatsapp', e.target.value)} /></label><label>Email<input type="email" value={settings.email} onChange={(e) => onChange('email', e.target.value)} /></label></div>
            <label>Address<input value={settings.address} onChange={(e) => onChange('address', e.target.value)} /></label>
            <div className="form-two"><label>Instagram URL<input value={settings.instagram} onChange={(e) => onChange('instagram', e.target.value)} /></label><label>Facebook URL<input value={settings.facebook} onChange={(e) => onChange('facebook', e.target.value)} /></label></div>
            <label>Footer Text<input value={settings.footerText} onChange={(e) => onChange('footerText', e.target.value)} /></label>
            <button className="admin-primary">Save Settings</button>
          </form>
        </section>
      );
    }

    /* =========================
    PROPERTY PANEL
    ========================= */

    function PropertyPanel({
    properties,
    onAdd,
    onEdit,
    onDelete,
    }: {
    properties: Property[];
    onAdd: () => void;
    onEdit: (p: Property) => void;
    onDelete: (s: string) => void;
    }) {
    return (
        <section className="admin-panel">
        <div className="panel-head">
            <div>
            <p className="admin-kicker">
                INVENTORY
            </p>

            <h2>Properties</h2>
            </div>

            <button
            className="admin-primary"
            onClick={onAdd}
            >
            ＋ Add Property
            </button>
        </div>

        <div className="admin-list">
            {properties.map((p) => (
            <div
                className="admin-list-row"
                key={p.slug}
            >
                <img
                src={p.image}
                alt=""
                />

                <div>
                <strong>{p.name}</strong>
                {approvalBadge(p.status)}

                <small>
                    {p.type} · {p.location} · ₹
                    {Number(
                    p.price || 0
                    ).toLocaleString('en-IN')}{' '}
                    · {p.rooms?.length || 0}{' '}
                    rooms
                </small>
                </div>

                <div className="row-actions">
                <button
                    className="admin-edit"
                    onClick={() => onEdit(p)}
                >
                    Edit
                </button>

                <button
                    className="admin-danger"
                    onClick={() =>
                    onDelete(p.slug)
                    }
                >
                    Delete
                </button>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    }

    /* =========================
    ROOM PANEL
    ========================= */

    function RoomPanel({
    properties,
    onAdd,
    onEdit,
    onDelete,
    }: {
    properties: Property[];
    onAdd: (p: Property) => void;
    onEdit: (
        p: Property,
        r: Room
    ) => void;
    onDelete: (
        p: Property,
        r: Room
    ) => void;
    }) {
    return (
        <section className="admin-panel">
        <div className="panel-head">
            <div>
            <p className="admin-kicker">
                ROOM INVENTORY
            </p>

            <h2>Rooms</h2>
            </div>
        </div>

        {properties.map((p) => (
            <div
            className="room-group"
            key={p.slug}
            >
            <div className="room-group-head">
                <div>
                <strong>{p.name}</strong>

                <small>
                    {p.location} ·{' '}
                    {p.rooms?.length || 0}{' '}
                    rooms
                </small>
                </div>

                <button
                className="admin-primary"
                onClick={() => onAdd(p)}
                >
                ＋ Add Room
                </button>
            </div>

            {p.rooms?.length ? (
                <div className="admin-list">
                {p.rooms.map((r) => (
                    <div
                    className="admin-list-row"
                    key={r.id}
                    >
                    <img
                        src={r.image}
                        alt=""
                    />

                    <div>
                        <strong>
                        {r.name}
                        </strong>
                        {approvalBadge(r.status)}

                        <small>
                        ₹
                        {Number(
                            r.price || 0
                        ).toLocaleString(
                            'en-IN'
                        )}{' '}
                        / night ·{' '}
                        {r.capacity}{' '}
                        guests ·{' '}
                        {r.bed} · {r.size}
                        </small>
                    </div>

                    <div className="row-actions">
                        <button
                        className="admin-edit"
                        onClick={() =>
                            onEdit(p, r)
                        }
                        >
                        Edit
                        </button>

                        <button
                        className="admin-danger"
                        onClick={() =>
                            onDelete(p, r)
                        }
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="admin-muted">
                No rooms added yet.
                </p>
            )}
            </div>
        ))}
        </section>
    );
    }

    /* =========================
    EVENT PANEL
    ========================= */

    function EventPanel({
    events,
    onAdd,
    onEdit,
    onDelete,
    }: {
    events: Event[];
    onAdd: () => void;
    onEdit: (e: Event) => void;
    onDelete: (s: string) => void;
    }) {
    return (
        <section className="admin-panel">
        <div className="panel-head">
            <div>
            <p className="admin-kicker">
                EVENT CATALOG
            </p>

            <h2>Events</h2>
            </div>

            <button
            className="admin-primary"
            onClick={onAdd}
            >
            ＋ Add Event
            </button>
        </div>

        <div className="admin-list">
            {events.map((x) => (
            <div
                className="admin-list-row"
                key={x.slug}
            >
                <img
                src={x.image}
                alt=""
                />

                <div>
                <strong>
                    {x.title}
                </strong>
                {approvalBadge(x.status)}

                <small>
                    {x.kicker} ·{' '}
                    {x.services.length}{' '}
                    services
                </small>
                </div>

                <div className="row-actions">
                <button
                    className="admin-edit"
                    onClick={() =>
                    onEdit(x)
                    }
                >
                    Edit
                </button>

                <button
                    className="admin-danger"
                    onClick={() =>
                    onDelete(x.slug)
                    }
                >
                    Delete
                </button>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    }

    /* =========================
    PACKAGE PANEL
    ========================= */

    function PackagePanel({
    packages,
    onAdd,
    onEdit,
    onDelete,
    }: {
    packages: PackageItem[];
    onAdd: () => void;
    onEdit: (
        p: PackageItem
    ) => void;
    onDelete: (
        slug: string
    ) => void;
    }) {
    return (
        <section className="admin-panel">
        <div className="panel-head">
            <div>
            <p className="admin-kicker">
                PACKAGE CATALOG
            </p>

            <h2>Packages</h2>
            </div>

            <button
            className="admin-primary"
            onClick={onAdd}
            >
            ＋ Add Package
            </button>
        </div>

        <div className="admin-list">
            {packages.length ? (
            packages.map((x) => (
                <div
                className="admin-list-row"
                key={x.slug || x.id}
                >
                <img
                    src={x.image}
                    alt=""
                />

                <div>
                    <strong>
                    {x.title}
                    </strong>
                    {approvalBadge(x.status)}

                    <small>
                    {x.services?.length || 0}{' '}
                    services
                    </small>

                    <p
                    style={{
                        margin:
                        '8px 0 0',
                        color:
                        '#64748b',
                        fontSize:
                        '14px',
                    }}
                    >
                    {x.description}
                    </p>
                </div>

                <div className="row-actions">
                    <button
                    className="admin-edit"
                    onClick={() =>
                        onEdit(x)
                    }
                    >
                    Edit
                    </button>

                    <button
                    className="admin-danger"
                    onClick={() =>
                        onDelete(
                        x.slug
                        )
                    }
                    >
                    Delete
                    </button>
                </div>
                </div>
            ))
            ) : (
            <p className="admin-muted">
                No packages added yet.
            </p>
            )}
        </div>
        </section>
    );
    }

    /* =========================
    INQUIRY PANEL
    ========================= */

    function InquiryPanel({
    inquiries,
    onStatus,
    }: {
    inquiries: Inquiry[];
    onStatus: (
        id: string,
        status: string
    ) => void;
    }) {
    return (
        <section className="admin-panel">
        <div className="panel-head">
            <div>
            <p className="admin-kicker">
                LEADS
            </p>

            <h2>Inquiries</h2>
            </div>
        </div>

        <div className="inquiry-table">
            <div className="table-row table-head">
            <span>ID</span>
            <span>Customer</span>
            <span>Request</span>
            <span>Status</span>
            </div>

            {inquiries.length ? (
            inquiries.map((q) => (
                <div
                className="table-row"
                key={q.id}
                >
                <span>{q.id}</span>

                <span>
                    <strong>
                    {q.name || 'Guest'}
                    </strong>

                    <small>
                    {q.phone || ''}
                    </small>
                </span>

                <span>
                    {q.item || '-'}

                    <small>
                    {q.type || '-'}
                    </small>
                </span>

                <span>
                    <select
                    className="status-select"
                    value={
                        q.status || 'New'
                    }
                    onChange={(e) =>
                        onStatus(
                        q.id,
                        e.target.value
                        )
                    }
                    >
                    {statuses.map(
                        (s) => (
                        <option
                            key={s}
                        >
                            {s}
                        </option>
                        )
                    )}
                    </select>
                </span>
                </div>
            ))
            ) : (
            <p className="admin-muted">
                No inquiries yet.
            </p>
            )}
        </div>
        </section>
    );
    }

    /* =========================
    CUSTOMERS PANEL
    ========================= */

    function CustomerPanel({
    customers,
    inquiries,
    }: {
    customers: Customer[];
    inquiries: Inquiry[];
    }) {
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);

    const filteredCustomers = customers.filter((customer) => {
        const query = search.trim().toLowerCase();

        if (!query) return true;

        return (
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
        );
    });

    const customerInquiries = selectedCustomer
        ? inquiries.filter((inquiry) => {
            const phone =
            (inquiry.phone || "").trim();

            const email =
            (inquiry.email || "")
                .trim()
                .toLowerCase();

            return (
            (selectedCustomer.phone !== "-" &&
                phone === selectedCustomer.phone) ||
            (selectedCustomer.email !== "-" &&
                email === selectedCustomer.email)
            );
        })
        : [];

    return (
        <section className="admin-panel">
        <div className="panel-head">
            <div>
            <p className="admin-kicker">
                CUSTOMER DATABASE
            </p>

            <h2>Customers</h2>
            </div>

            <div className="customer-count">
            {customers.length} Customers
            </div>
        </div>

        {/* SEARCH */}

        <div
            style={{
            marginBottom: "24px",
            }}
        >
            <input
            type="search"
            placeholder="Search customer by name, phone or email..."
            value={search}
            onChange={(e) =>
                setSearch(e.target.value)
            }
            style={{
                width: "100%",
                maxWidth: "500px",
                padding: "14px 16px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "14px",
                boxSizing: "border-box",
            }}
            />
        </div>

        {filteredCustomers.length ? (
            <div className="inquiry-table">
            <div className="table-row table-head">
                <span>Customer</span>
                <span>Contact</span>
                <span>Inquiries</span>
                <span>Last Inquiry</span>
            </div>

            {filteredCustomers.map((customer) => (
                <div
                className="table-row customer-row"
                key={customer.key}
                style={{
                    cursor: "pointer",
                }}
                onClick={() =>
                    setSelectedCustomer(customer)
                }
                >
                <span>
                    <strong>
                    {customer.name}
                    </strong>

                    <small>
                    {customer.status}
                    </small>
                </span>

                <span>
                    <strong>
                    {customer.phone}
                    </strong>

                    <small>
                    {customer.email}
                    </small>
                </span>

                <span>
                    <strong>
                    {customer.inquiries}
                    </strong>

                    <small>
                    {customer.inquiries === 1
                        ? "Inquiry"
                        : "Inquiries"}
                    </small>
                </span>

                <span>
                    {customer.lastInquiry
                    ? new Date(
                        customer.lastInquiry
                        ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                        )
                    : "-"}
                </span>
                </div>
            ))}
            </div>
        ) : (
            <div className="admin-placeholder">
            <div>
                <div className="placeholder-icon">
                👤
                </div>

                <h2>
                {search
                    ? "No Customer Found"
                    : "No Customers Yet"}
                </h2>

                <p>
                {search
                    ? "Try another name, phone number or email."
                    : "Customers will automatically appear here when inquiries are received."}
                </p>
            </div>
            </div>
        )}

        {/* CUSTOMER DETAIL */}

        {selectedCustomer && (
            <div
            className="admin-modal-backdrop"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                setSelectedCustomer(null);
                }
            }}
            >
            <div
                className="admin-modal"
                onMouseDown={(e) =>
                e.stopPropagation()
                }
            >
                <div className="panel-head">
                <div>
                    <p className="admin-kicker">
                    CUSTOMER PROFILE
                    </p>

                    <h2>
                    {selectedCustomer.name}
                    </h2>
                </div>

                <button
                    className="modal-close"
                    onClick={() =>
                    setSelectedCustomer(null)
                    }
                >
                    ×
                </button>
                </div>

                <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                    "repeat(2, 1fr)",
                    gap: "16px",
                    marginBottom: "30px",
                }}
                >
                <div>
                    <small>PHONE</small>

                    <p>
                    {selectedCustomer.phone}
                    </p>
                </div>

                <div>
                    <small>EMAIL</small>

                    <p>
                    {selectedCustomer.email}
                    </p>
                </div>

                <div>
                    <small>STATUS</small>

                    <p>
                    {selectedCustomer.status}
                    </p>
                </div>

                <div>
                    <small>TOTAL INQUIRIES</small>

                    <p>
                    {selectedCustomer.inquiries}
                    </p>
                </div>
                </div>

                <div>
                <p className="admin-kicker">
                    INQUIRY HISTORY
                </p>

                <h3
                    style={{
                    marginBottom: "16px",
                    }}
                >
                    Previous Inquiries
                </h3>

                {customerInquiries.length ? (
                    <div className="inquiry-table">
                    {customerInquiries.map(
                        (inquiry) => (
                        <div
                            className="table-row"
                            key={inquiry.id}
                        >
                            <span>
                            <strong>
                                {inquiry.item ||
                                "-"}
                            </strong>

                            <small>
                                {inquiry.type ||
                                "-"}
                            </small>
                            </span>

                            <span>
                            {inquiry.status ||
                                "New"}
                            </span>

                            <span>
                            {inquiry.createdAt
                                ? new Date(
                                    inquiry.createdAt
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                    day: "2-digit",
                                    month:
                                        "short",
                                    year:
                                        "numeric",
                                    }
                                )
                                : "-"}
                            </span>

                            <span>
                            {inquiry.id}
                            </span>
                        </div>
                        )
                    )}
                    </div>
                ) : (
                    <p className="admin-muted">
                    No inquiry history found.
                    </p>
                )}
                </div>
            </div>
            </div>
        )}
        </section>
    );
    }

    /* =========================
    DASHBOARD
    ========================= */

    function Dashboard({
    stats,
    inquiries,
    onGo,
    }: {
    stats: any;
    inquiries: Inquiry[];
    onGo: (x: string) => void;
    }) {
    return (
        <>
        <section className="admin-stats">
            <article>
            <span>
                Total Properties
            </span>

            <strong>
                {stats.properties}
            </strong>

            <small>
                Live inventory
            </small>
            </article>

            <article>
            <span>
                New Inquiries
            </span>

            <strong>
                {stats.newInquiries}
            </strong>

            <small>
                Needs follow-up
            </small>
            </article>

            <article>
            <span>Events</span>

            <strong>
                {stats.events}
            </strong>

            <small>
                Published event types
            </small>
            </article>

            <article>
            <span>
                Active Rooms
            </span>

            <strong>
                {stats.rooms}
            </strong>

            <small>
                Across properties
            </small>
            </article>
        </section>

        <section className="admin-grid-two">
            <div className="admin-panel">
            <div className="panel-head">
                <div>
                <p className="admin-kicker">
                    LEADS
                </p>

                <h2>
                    Recent Inquiries
                </h2>
                </div>

                <button
                className="panel-link"
                onClick={() =>
                    onGo('Inquiries')
                }
                >
                View all →
                </button>
            </div>

            <div className="inquiry-table">
                {inquiries
                .slice(0, 6)
                .map((q) => (
                    <div
                    className="table-row"
                    key={q.id}
                    >
                    <span>
                        <strong>
                        {q.name ||
                            'Guest'}
                        </strong>

                        <small>
                        {q.id}
                        </small>
                    </span>

                    <span>
                        {q.item || '-'}

                        <small>
                        {q.type || '-'}
                        </small>
                    </span>

                    <span>
                        {q.createdAt
                        ? new Date(
                            q.createdAt
                            ).toLocaleDateString(
                            'en-IN'
                            )
                        : '-'}
                    </span>

                    <span>
                        <b className="status">
                        {q.status ||
                            'New'}
                        </b>
                    </span>
                    </div>
                ))}

                {!inquiries.length && (
                <p className="admin-muted">
                    No inquiries yet.
                </p>
                )}
            </div>
            </div>

            <div className="admin-panel quick-panel">
            <div className="panel-head">
                <div>
                <p className="admin-kicker">
                    SHORTCUTS
                </p>

                <h2>
                    Quick Actions
                </h2>
                </div>
            </div>

            <button
                onClick={() =>
                onGo('Properties')
                }
            >
                ＋ Add Property
                <span>→</span>
            </button>

            <button
                onClick={() =>
                onGo('Rooms')
                }
            >
                ＋ Add Room
                <span>→</span>
            </button>

            <button
                onClick={() =>
                onGo('Events')
                }
            >
                ＋ Add Event
                <span>→</span>
            </button>

            <button
                onClick={() =>
                onGo('Packages')
                }
            >
                View Packages
                <span>→</span>
            </button>

            <button
                onClick={() =>
                onGo('Customers')
                }
            >
                View Customers
                <span>→</span>
            </button>

            <button
                onClick={() =>
                onGo('Inquiries')
                }
            >
                View Inquiries
                <span>→</span>
            </button>
            </div>
        </section>
        </>
    );
    }

    /* =========================
    MODAL
    ========================= */

    function Modal({
    title,
    onClose,
    children,
    }: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    }) {
    return (
        <div
        className="admin-modal-backdrop"
        onMouseDown={onClose}
        >
        <div
            className="admin-modal"
            onMouseDown={(e) =>
            e.stopPropagation()
            }
        >
            <div className="panel-head">
            <h2>{title}</h2>

            <button
                className="modal-close"
                onClick={onClose}
            >
                ×
            </button>
            </div>

            {children}
        </div>
        </div>
    );
    }