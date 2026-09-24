import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

type GalleryItem = { id: string; title: string; category: string; image: string; featured: boolean; createdAt: string };

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const items = await readCollection<GalleryItem>("gallery.json", []);
  const index = items.findIndex((x) => x.id === id);
  if (index < 0) return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
  items[index] = { ...items[index], ...body, id, title: String(body.title ?? items[index].title), category: String(body.category ?? items[index].category), image: String(body.image ?? items[index].image), featured: Boolean(body.featured) };
  await writeCollection("gallery.json", items);
  return NextResponse.json(items[index]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const items = await readCollection<GalleryItem>("gallery.json", []);
  const next = items.filter((x) => x.id !== id);
  if (next.length === items.length) return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
  await writeCollection("gallery.json", next);
  return NextResponse.json({ ok: true });
}
