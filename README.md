# Sawariya V9 — Admin → Website Live Sync Fix

This version fixes the data-source mismatch that caused Admin changes not to appear on the public website.

## What changed
- Homepage reads `data/properties.json` and `data/events.json` dynamically.
- `/properties` fetches the live `/api/properties` data instead of the old hard-coded `lib/properties.ts` list.
- `/events` fetches the live `/api/events` data instead of hard-coded event cards.
- Property detail pages read the live property JSON.
- Event detail pages read the live event JSON.
- Public inventory pages use `cache: no-store` / dynamic rendering so Admin edits appear after refresh.
- Admin CRUD continues writing to the same `data/*.json` files.

## Run
```bash
npm install
npm run dev
```

Then test:
- http://localhost:3000/admin
- http://localhost:3000/properties
- http://localhost:3000/events

## Test
1. Login to Admin.
2. Edit a property name or price.
3. Save it.
4. Open/refresh `/properties` and the homepage.
5. The updated value should appear.
6. Repeat for an event.

## Important
This is still a local JSON development backend. For production hosting, migrate `data/*.json` to PostgreSQL/Supabase so the admin changes are shared and persistent on the deployed server.

## V10 property inventory fix

Property inventory now has one source of truth: `data/properties.json`. All public property pages, homepage, property details, admin CRUD, and room CRUD use the same store. If an older local build has an empty `properties.json`, the first property read restores the starter property inventory once; subsequent admin edits are persisted to `data/properties.json`.
