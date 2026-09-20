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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const customers = await readCollection<Customer>('customers.json', []);
    const index = customers.findIndex((customer) => customer.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const updatedCustomer: Customer = {
      ...customers[index],
      name: body.name?.trim() ?? customers[index].name,
      phone: body.phone?.trim() ?? '',
      email: body.email?.trim() ?? '',
      city: body.city?.trim() ?? '',
      notes: body.notes?.trim() ?? '',
    };

    customers[index] = updatedCustomer;

    await writeCollection('customers.json', customers);

    return NextResponse.json(updatedCustomer);
  } catch {
    return NextResponse.json(
      { error: 'Could not update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const customers = await readCollection<Customer>('customers.json', []);
    const filtered = customers.filter((customer) => customer.id !== id);

    if (filtered.length === customers.length) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    await writeCollection('customers.json', filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Could not delete customer' },
      { status: 500 }
    );
  }
}