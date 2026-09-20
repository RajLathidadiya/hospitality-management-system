import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";

type Review = { id: string; name: string; rating: number; text: string; property: string; status: string; createdAt: string };

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const body = await req.json();
  const items = await readCollection<Review>("reviews.json", []); const index = items.findIndex((x) => x.id === id);
  if (index < 0) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  items[index] = { ...items[index], ...body, id, rating: Math.min(5, Math.max(1, Number(body.rating ?? items[index].rating))), status: String(body.status ?? items[index].status) };
  await writeCollection("reviews.json", items); return NextResponse.json(items[index]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const items = await readCollection<Review>("reviews.json", []); const next = items.filter((x) => x.id !== id);
  if (next.length === items.length) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  await writeCollection("reviews.json", next); return NextResponse.json({ ok: true });
}
