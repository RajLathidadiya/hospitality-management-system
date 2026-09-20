import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";

type Settings = { id: string; businessName: string; phone: string; whatsapp: string; email: string; address: string; instagram: string; facebook: string; footerText: string };
const defaults: Settings = { id: "site-settings", businessName: "Sawariya Event", phone: "+91 9116667045", whatsapp: "+91 9116667045", email: "Sawariyaevent00@gmail.com", address: "Udaipur, Rajasthan", instagram: "", facebook: "", footerText: "Event Management & Hotel Booking" };

export async function GET() { const items = await readCollection<Settings>("settings.json", [defaults]); return NextResponse.json(items[0] || defaults); }
export async function PUT(req: Request) { const body = await req.json(); const next = { ...defaults, ...body, id: "site-settings" }; await writeCollection("settings.json", [next]); return NextResponse.json(next); }
