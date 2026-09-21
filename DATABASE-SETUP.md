# Sawariya Hospitality — Database Setup

This version replaces the JSON filesystem database with MySQL through Prisma.

## 1. Install dependencies
```bash
npm install
```

## 2. Create `.env`
Copy `.env.example` to `.env` and set:
```env
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME"
```

## 3. Generate Prisma Client
```bash
npm run db:generate
```

## 4. Create the database tables
```bash
npm run db:push
```

## 5. Import the existing JSON data
BACK UP THE DATABASE BEFORE RE-RUNNING THIS SCRIPT. It clears the target tables first.
```bash
npm run db:import
```

## 6. Verify
```bash
npm run build
npm run dev
```

Do not delete the `data/` folder until the database import has been verified.
