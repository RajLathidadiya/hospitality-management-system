import {NextResponse} from 'next/server';import {isAdmin} from '@/lib/auth';import {readCollection,writeCollection} from '@/lib/db';
import { getProperties } from '@/lib/property-data';
export const dynamic = 'force-dynamic';

export async function GET(){return NextResponse.json(await getProperties())}
export async function POST(req:Request){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});const b=await req.json();const l=await getProperties();const slug=b.slug||b.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');if(l.some(x=>x.slug===slug))return NextResponse.json({error:'Slug already exists'},{status:409});const x={...b,id:slug,slug,rooms:b.rooms||[],amenities:b.amenities||[]};l.push(x);await writeCollection('properties.json',l);return NextResponse.json(x,{status:201})}
