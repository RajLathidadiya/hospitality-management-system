import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DATA = path.join(process.cwd(), "data");

async function read(name, fallback = []) {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA, name), "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  console.log("Starting JSON → MySQL migration...");

  const properties = await read("properties.json");
  const packages = await read("packages.json");
  const events = await read("events.json");
  const gallery = await read("gallery.json");
  const reviews = await read("reviews.json");
  const customers = await read("customers.json");
  const inquiries = await read("inquiries.json");
  const settings = await read("settings.json");

  // Clear in dependency-safe order. This script is intended for the first migration.
  await prisma.$transaction(async (tx) => {
    await tx.review.deleteMany({});
    await tx.galleryItem.deleteMany({});
    await tx.room.deleteMany({});
    await tx.property.deleteMany({});
    await tx.package.deleteMany({});
    await tx.event.deleteMany({});
    await tx.customer.deleteMany({});
    await tx.inquiry.deleteMany({});
    await tx.setting.deleteMany({});

    for (const p of properties) {
      await tx.property.create({
        data: {
          id: String(p.id || p.slug),
          slug: String(p.slug),
          name: String(p.name || ""),
          type: String(p.type || "Other"),
          location: String(p.location || ""),
          city: String(p.city || ""),
          state: String(p.state || ""),
          price: Number(p.price || 0),
          rating: Number(p.rating || 0),
          guests: Number(p.guests || 0),
          featured: Boolean(p.featured),
          image: String(p.image || ""),
          description: String(p.description || ""),
          amenities: Array.isArray(p.amenities) ? p.amenities : [],
          rooms: {
            create: (Array.isArray(p.rooms) ? p.rooms : []).map((r) => ({
              id: String(r.id || r.slug || r.name),
              name: String(r.name || "New Room"),
              price: Number(r.price || 0),
              capacity: Number(r.capacity || 2),
              bed: String(r.bed || "King Bed"),
              size: String(r.size || ""),
              image: String(r.image || ""),
            })),
          },
        },
      });
    }

    for (const p of packages) {
      await tx.package.create({
        data: {
          id: String(p.id || p.slug),
          slug: String(p.slug),
          title: String(p.title || ""),
          description: String(p.description || ""),
          image: String(p.image || ""),
        },
      });
    }

    for (const e of events) {
      await tx.event.create({
        data: {
          id: String(e.id || e.slug),
          slug: String(e.slug),
          title: String(e.title || ""),
          kicker: String(e.kicker || ""),
          text: String(e.text || ""),
          image: String(e.image || ""),
          services: Array.isArray(e.services) ? e.services : [],
        },
      });
    }

    for (const g of gallery) {
      await tx.galleryItem.create({
        data: {
          id: String(g.id),
          title: String(g.title || ""),
          category: String(g.category || "General"),
          image: String(g.image || ""),
          featured: Boolean(g.featured),
          createdAt: g.createdAt ? new Date(g.createdAt) : undefined,
          propertyId: g.propertyId ? String(g.propertyId) : null,
        },
      });
    }

    for (const r of reviews) {
      await tx.review.create({
        data: {
          id: String(r.id),
          name: String(r.name || ""),
          rating: Math.min(5, Math.max(1, Number(r.rating || 5))),
          text: String(r.text || ""),
          property: String(r.property || ""),
          propertyId: r.propertyId ? String(r.propertyId) : null,
          status: String(r.status || "Published"),
          createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
        },
      });
    }

    for (const c of customers) {
      await tx.customer.create({
        data: {
          id: String(c.id),
          name: String(c.name || ""),
          phone: c.phone ? String(c.phone) : null,
          email: c.email ? String(c.email) : null,
          city: c.city ? String(c.city) : null,
          notes: c.notes ? String(c.notes) : null,
          createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
        },
      });
    }

    for (const i of inquiries) {
      await tx.inquiry.create({
        data: {
          id: String(i.id),
          name: String(i.name || ""),
          phone: String(i.phone || ""),
          email: i.email ? String(i.email) : null,
          inquiryType: String(i.inquiryType || "Other"),
          destination: i.destination ? String(i.destination) : null,
          checkIn: i.checkIn ? String(i.checkIn) : null,
          checkOut: i.checkOut ? String(i.checkOut) : null,
          guests: i.guests ? String(i.guests) : null,
          message: i.message ? String(i.message) : null,
          status: String(i.status || "New"),
          createdAt: i.createdAt ? new Date(i.createdAt) : undefined,
        },
      });
    }

    const s = settings[0];
    if (s) {
      await tx.setting.create({
        data: {
          id: "site-settings",
          businessName: String(s.businessName || ""),
          phone: String(s.phone || ""),
          whatsapp: String(s.whatsapp || ""),
          email: String(s.email || ""),
          address: String(s.address || ""),
          instagram: String(s.instagram || ""),
          facebook: String(s.facebook || ""),
          footerText: String(s.footerText || ""),
        },
      });
    }
  });

  console.log("Migration completed.");
  console.log({
    properties: properties.length,
    packages: packages.length,
    events: events.length,
    gallery: gallery.length,
    reviews: reviews.length,
    customers: customers.length,
    inquiries: inquiries.length,
    settings: settings.length,
  });
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
