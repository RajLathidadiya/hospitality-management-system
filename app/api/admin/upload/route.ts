import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Please choose an image file.' }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP and GIF images are allowed.' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'Image is too large. Maximum size is 10 MB.' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  return NextResponse.json({ url: `/uploads/${filename}`, filename }, { status: 201 });
}
