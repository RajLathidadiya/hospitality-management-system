import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readCollection, writeCollection } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  notes?: string;
  createdAt: string;
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const customers = await readCollection<Customer>('customers.json', []);
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    const customers = await readCollection<Customer>('customers.json', []);

    const customer: Customer = {
      id: `customer-${Date.now()}`,
      name: body.name.trim(),
      phone: body.phone?.trim() || '',
      email: body.email?.trim() || '',
      city: body.city?.trim() || '',
      notes: body.notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    customers.push(customer);

    await writeCollection('customers.json', customers);

    return NextResponse.json(customer, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Could not create customer' },
      { status: 500 }
    );
  }
}