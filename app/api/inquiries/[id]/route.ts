import {NextResponse} from 'next/server';
import {isAdmin} from '@/lib/auth';
import {readCollection,writeCollection} from '@/lib/db';
export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {id}=await params; const body=await req.json(); const list=await readCollection<any>('inquiries.json');
  const idx=list.findIndex(x=>x.id===id); if(idx<0)return NextResponse.json({error:'Inquiry not found'},{status:404});
  list[idx]={...list[idx],...body,id}; await writeCollection('inquiries.json',list); return NextResponse.json(list[idx]);
}
