# Careers Forge

## What this is

Careers Forge is a small careers page builder. The goal is to let recruiters set up a branded careers page without needing any engineering help, while keeping the experience simple and fast for candidates.

Recruiters can:
- sign up and sign in  
- create a company careers page with branding and custom sections  
- add jobs manually or import them using a CSV  
- publish the careers page and share the public link  

Candidates can:
- open the published careers page  
- browse open roles  
- view individual job details  

This project is intentionally scoped as a **careers page experience**, not a full ATS or hiring system.

---

## Tech stack

The project is built with:
- Vite, React, and TypeScript on the frontend  
- Tailwind CSS with shadcn/ui for UI components  
- Zustand for client-side state management  
- Supabase for authentication, database (Postgres), and row-level security  

---

## Getting started (local development)

### Install dependencies

After cloning the repo, install dependencies with:

```bash
npm install

Configure environment variables

Create a .env file in the project root and add your Supabase credentials:

VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Careers Forge

## What this is

Careers Forge is a small careers page builder. The goal is to let recruiters set up a branded careers page without needing any engineering help, while keeping the experience simple and fast for candidates.

Recruiters can:
- sign up and sign in
- create a company careers page with branding and custom sections
- add jobs manually or import them using a CSV
- publish the careers page and share the public link

Candidates can:
- open the published careers page
- browse open roles
- view individual job details

This is intentionally scoped as a careers page experience, not a full ATS or hiring system.

---

## Tech stack

The project is built with:
- Vite, React, and TypeScript on the frontend
- Tailwind CSS with shadcn/ui for UI components
- Zustand for client-side state management
- Supabase for authentication, database (Postgres), and row-level security

---

## Getting started (local development)

### Install dependencies

After cloning the repo, install dependencies with:

```bash
npm install

Configure environment variables

Create a .env file in the project root and add your Supabase credentials:

VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...


## Set up the database

In the Supabase dashboard, open the SQL editor and run the schema used by this project.

This includes:
- profiles table
- companies table
- jobs table
- required Row Level Security (RLS) policies

Start the dev server

Run:
```bash
npm run dev
```

The app runs on the port defined in `vite.config.ts` (currently `8080`).

## How to use

### Recruiter flow

A typical recruiter flow looks like this:

1. Register or log in
2. Create a company from the dashboard
3. Open the company edit page
4. Configure branding and page sections
5. Add jobs manually or import them via CSV
6. Preview the page
7. Publish and share the public careers link

### Candidate flow

From a candidate's perspective:

1. Open a published careers page
2. Browse open jobs (20 per page)
3. Click into a job to see the full details

## Project structure (high level)

- `src/pages` Route-level pages (auth, dashboard, editor, public careers pages)
- `src/components/recruiter` Careers page editor modules for branding, sections, jobs, and publishing
- `src/store` Zustand stores for auth, company data, and jobs
- `src/lib/supabase.ts` Supabase client setup and shared database types
