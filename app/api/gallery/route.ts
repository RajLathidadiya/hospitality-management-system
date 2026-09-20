import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";

type GalleryItem = { id: string; title: string; category: string; image: string; featured: boolean; createdAt: string };

export async function GET() {
  return NextResponse.json(await readCollection<GalleryItem>("gallery.json", []));
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!String(body.image || "").trim()) return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  const items = await readCollection<GalleryItem>("gallery.json", []);
  const item: GalleryItem = {
    id: body.id || `gallery-${Date.now()}`,
    title: String(body.title || "").trim(),
    category: String(body.category || "General").trim(),
    image: String(body.image || "").trim(),
    featured: Boolean(body.featured),
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  await writeCollection("gallery.json", items);
  return NextResponse.json(item, { status: 201 });
}
