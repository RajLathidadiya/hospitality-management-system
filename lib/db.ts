import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

function parseJson<T>(value: unknown, fallback: T): T {
  return value == null ? fallback : (value as T);
}

function toIso(value: Date | string | null | undefined) {
  return value instanceof Date ? value.toISOString() : value || new Date().toISOString();
}

export async function readCollection<T>(name: string, fallback: T[] = [], options: { includeUnpublished?: boolean } = {}): Promise<T[]> {
  const includeUnpublished = options.includeUnpublished === true;
  switch (name) {
    case "properties.json": {
      const rows = await prisma.property.findMany({
        where: includeUnpublished ? undefined : { status: "APPROVED" },
        include: { rooms: { where: includeUnpublished ? undefined : { status: "APPROVED" } } },
        orderBy: { createdAt: "asc" },
      });
      return rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        type: p.type,
        location: p.location,
        city: p.city,
        state: p.state,
        price: p.price,
        rating: p.rating,
        guests: p.guests,
        featured: p.featured,
        status: p.status,
        image: p.image,
        description: p.description,
        amenities: parseJson<string[]>(p.amenities, []),
        rooms: p.rooms.map((r) => ({
          id: r.id,
          name: r.name,
          price: r.price,
          capacity: r.capacity,
          bed: r.bed,
          size: r.size,
          image: r.image,
          status: r.status,
        })),
      })) as T[];
    }

    case "packages.json": {
      const rows = await prisma.package.findMany({ where: includeUnpublished ? undefined : { status: "APPROVED" }, orderBy: { createdAt: "asc" } });
      return rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        image: p.image,
        status: p.status,
      })) as T[];
    }

    case "events.json": {
      const rows = await prisma.event.findMany({ where: includeUnpublished ? undefined : { status: "APPROVED" }, orderBy: { createdAt: "asc" } });
      return rows.map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        kicker: e.kicker,
        text: e.text,
        image: e.image,
        status: e.status,
        services: parseJson<string[]>(e.services, []),
      })) as T[];
    }

    case "gallery.json": {
      const rows = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        image: g.image,
        featured: g.featured,
        createdAt: toIso(g.createdAt),
      })) as T[];
    }

    case "reviews.json": {
      const rows = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        rating: r.rating,
        text: r.text,
        property: r.property,
        propertyId: r.propertyId || undefined,
        status: r.status,
        createdAt: toIso(r.createdAt),
      })) as T[];
    }

    case "customers.json": {
      const rows = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone || "",
        email: c.email || "",
        city: c.city || "",
        notes: c.notes || "",
        createdAt: toIso(c.createdAt),
      })) as T[];
    }

    case "inquiries.json": {
      const rows = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map((i) => ({
        id: i.id,
        name: i.name,
        phone: i.phone,
        email: i.email || "",
        inquiryType: i.inquiryType,
        destination: i.destination || "",
        checkIn: i.checkIn || "",
        checkOut: i.checkOut || "",
        guests: i.guests || "",
        message: i.message || "",
        status: i.status,
        createdAt: toIso(i.createdAt),
      })) as T[];
    }

    case "settings.json": {
      const row = await prisma.setting.findUnique({ where: { id: "site-settings" } });
      if (!row) return fallback;
      return [{
        id: row.id,
        businessName: row.businessName,
        phone: row.phone,
        whatsapp: row.whatsapp,
        email: row.email,
        address: row.address,
        instagram: row.instagram,
        facebook: row.facebook,
        footerText: row.footerText,
      }] as T[];
    }

    default:
      return fallback;
  }
}

export async function writeCollection<T extends Record<string, any>>(
  name: string,
  data: T[]
): Promise<void> {
  switch (name) {
    case "properties.json":
      await prisma.$transaction(async (tx) => {
        await tx.room.deleteMany({});
        await tx.property.deleteMany({});
        for (const p of data) {
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
              status: String(p.status || "APPROVED"),
              image: String(p.image || ""),
              description: String(p.description || ""),
              amenities: Array.isArray(p.amenities) ? p.amenities : [],
              rooms: {
                create: (Array.isArray(p.rooms) ? p.rooms : []).map((r: any) => ({
                  id: String(r.id || r.slug || r.name || `room-${Date.now()}`),
                  name: String(r.name || "New Room"),
                  price: Number(r.price || 0),
                  capacity: Number(r.capacity || 2),
                  bed: String(r.bed || "King Bed"),
                  size: String(r.size || ""),
                  image: String(r.image || ""),
                  status: String(r.status || "APPROVED"),
                })),
              },
            },
          });
        }
      });
      return;

    case "packages.json":
      await prisma.$transaction(async (tx) => {
        await tx.package.deleteMany({});
        for (const p of data) {
          await tx.package.create({
            data: {
              id: String(p.id || p.slug),
              slug: String(p.slug),
              title: String(p.title || ""),
              description: String(p.description || ""),
              image: String(p.image || ""),
              status: String(p.status || "APPROVED"),
            },
          });
        }
      });
      return;

    case "events.json":
      await prisma.$transaction(async (tx) => {
        await tx.event.deleteMany({});
        for (const e of data) {
          await tx.event.create({
            data: {
              id: String(e.id || e.slug),
              slug: String(e.slug),
              title: String(e.title || ""),
              kicker: String(e.kicker || ""),
              text: String(e.text || ""),
              image: String(e.image || ""),
              status: String(e.status || "APPROVED"),
              services: Array.isArray(e.services) ? e.services : [],
            },
          });
        }
      });
      return;

    case "gallery.json":
      await prisma.$transaction(async (tx) => {
        await tx.galleryItem.deleteMany({});
        for (const g of data) {
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
      });
      return;

    case "reviews.json":
      await prisma.$transaction(async (tx) => {
        await tx.review.deleteMany({});
        for (const r of data) {
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
      });
      return;

    case "customers.json":
      await prisma.$transaction(async (tx) => {
        await tx.customer.deleteMany({});
        for (const c of data) {
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
      });
      return;

    case "inquiries.json":
      await prisma.$transaction(async (tx) => {
        await tx.inquiry.deleteMany({});
        for (const i of data) {
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
      });
      return;

    case "settings.json": {
      const s = data[0];
      if (!s) return;
      await prisma.setting.upsert({
        where: { id: "site-settings" },
        create: {
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
        update: {
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
      return;
    }

    default:
      throw new Error(`Unsupported collection: ${name}`);
  }
}
