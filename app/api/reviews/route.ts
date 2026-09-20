import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";

type Review = { id: string; name: string; rating: number; text: string; property: string; status: string; createdAt: string };

export async function GET() { return NextResponse.json(await readCollection<Review>("reviews.json", [])); }

export async function POST(req: Request) {
  const body = await req.json();
  if (!String(body.name || "").trim() || !String(body.text || "").trim()) return NextResponse.json({ error: "Name and review are required" }, { status: 400 });
  const items = await readCollection<Review>("reviews.json", []);
  const item: Review = { id: body.id || `review-${Date.now()}`, name: String(body.name).trim(), rating: Math.min(5, Math.max(1, Number(body.rating || 5))), text: String(body.text).trim(), property: String(body.property || "").trim(), status: String(body.status || "Published"), createdAt: new Date().toISOString() };
  items.unshift(item);
  await writeCollection("reviews.json", items);
  return NextResponse.json(item, { status: 201 });
}
