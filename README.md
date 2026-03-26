# SickFit Leads

Production-ready MVP for a multi-user leads tracking system built with Next.js, Supabase, and Apify.

## Features

- Email/password authentication with Supabase
- Protected dashboard routes
- Server-side Apify actor execution
- Leads and jobs persisted in Postgres
- Searchable, paginated leads table
- CSV export for filtered table rows
- Row Level Security for strict per-user isolation

## Tech Stack

- Next.js App Router + React + Tailwind CSS
- Supabase Auth + Postgres
- TanStack Query + TanStack Table
- Apify client
- PapaParse CSV export

## 1) Install and run

1. Install dependencies:

   npm install

2. Copy environment template:

   copy .env.example .env.local

3. Fill in .env.local values:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- APIFY_API_TOKEN

4. Start dev server:

   npm run dev

## 2) Apply database migration

Run the SQL migration in your Supabase project:

- File: supabase/migrations/202603260001_init.sql

You can run this with Supabase CLI or paste it into Supabase SQL Editor.

## 3) Authentication setup

In Supabase Dashboard:

1. Enable Email provider in Authentication > Providers.
2. For local testing, use redirect URL:

- http://localhost:3000

## 4) API behavior

### POST /api/run-actor

- Requires authenticated session
- Uses actor id: IoSHqwTR9YGhzccez
- Uses APIFY_API_TOKEN on server only
- Creates running job, runs actor, fetches dataset, inserts leads, updates job status

### GET /api/leads

- Returns current user's saved leads only (RLS enforced)

### GET /api/jobs

- Returns current user's scraping jobs only (RLS enforced)

## 5) Actor input and output mapping

Supported input fields:

- fetch_count, file_name
- contact_job_title, contact_not_job_title
- seniority_level, functional_level
- contact_location, contact_city
- contact_not_location, contact_not_city
- email_status (defaults to validated)
- company_domain, size
- company_industry, company_not_industry
- company_keywords, company_not_keywords
- min_revenue, max_revenue
- funding

Output mapping to leads table:

- name: full_name fallback first_name + last_name
- email: email
- company: company_name
- source: apify
- email_status: email_status fallback unknown

## 6) Verification checklist

1. Create account and log in.
2. Open dashboard and run scraper with small fetch_count like 100.
3. Confirm leads appear in table.
4. Confirm jobs section updates.
5. Search/filter table and export CSV.
6. Log in with second user and confirm no data leakage.

## Security

APIFY_API_TOKEN is never exposed to frontend code. It is read only on server route handlers.
