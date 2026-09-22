# Sawariya Superadmin Approval System

## Flow

- Admin creates a Property, Room, Event, or Package.
- The new item is saved with `PENDING` status.
- It does not appear on the public website.
- Superadmin opens `/superadmin`, reviews the request, and chooses Approve or Reject.
- Approved items become visible on the public website.

## Test login

The code has temporary fallback credentials so you can test immediately if the environment variables are not set:

- Email: `superadmin@sawariyaevent.com`
- Password: `Test2026DB`

For production, set these in Hostinger Environment Variables:

```env
SUPERADMIN_EMAIL=your-superadmin-email
SUPERADMIN_PASSWORD=your-strong-password
SUPERADMIN_SECRET=your-long-random-secret
```

## Database update

This version adds `status` columns to `Property`, `Room`, `Event`, and `Package`. Existing rows should be `APPROVED`.

Run once against the existing production database:

```bash
npx prisma db push
```

Or run `prisma/approval-migration.sql` in phpMyAdmin. Do **not** run both if the columns have already been added.

The deployment build now runs `prisma generate` automatically before `next build`, but it intentionally does not run `prisma db push` automatically.
