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

### 1) Clone the Repository

Open a terminal and run:
```bash
git clone https://github.com/Cvr421/Career-forge.git
cd Career-forge
```

---

### 2) Install Dependencies

Install all required packages:
```bash
npm install
```

This installs the frontend dependencies defined in `package.json` (Vite, React, Tailwind, shadcn/ui, Zustand, etc.)

---

### 3) Configure Environment Variables

Create a `.env` file in the project root with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project URL and anonymous key. These variables are required so the frontend can connect to your Supabase backend for auth and database operations (Sign in, company data, jobs).

---




### 5) Start the Development Server

Now that dependencies and environment are ready, start Vite:
```bash
npm run dev
```

By default this runs the app on port **8080** (as defined in `vite.config.ts`). You can open it in your browser at:
```
http://localhost:8080

```
## Project structure (high level)

- `src/pages` Route-level pages (auth, dashboard, editor, public careers pages)
- `src/components/recruiter` Careers page editor modules for branding, sections, jobs, and publishing
- `src/store` Zustand stores for auth, company data, and jobs
- `src/lib/supabase.ts` Supabase client setup and shared database types



### Security

1. Supabase RLS ensures recruiters only access their own data

2. Public queries are read-only and gated by is_published

3. Passwords are never handled or stored by the app (Supabase Auth only)

4. No sensitive secrets exposed to the client

### Supabase

1. Auth: email/password

2. Database: Postgres

3. Tables: companies, jobs

4. Row Level Security(RLS) for tenant isolation

5. ections stored as JSONB for flexible page composition


### 4) Set Up the Database

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Open the **SQL editor**
3. Run the provided schema SQL from the repo

This sets up:
- A `profiles` table (for user info)
- A `companies` table (for recruiter careers pages)
- A `jobs` table (for job listings)
- Row Level Security (RLS) policies so each recruiter only accesses their own data



# Database Schema

Complete database setup for the Career Forge platform with multi-tenant architecture and Row Level Security.

---

## Schema Overview

This schema includes:
- **Companies Table** - For recruiter career pages with customizable sections
- **Jobs Table** - Job listings linked to companies
- **Profiles Table** - User profile management
- **Storage Policies** - For company assets (logos, banners, videos)
- **RLS Policies** - Multi-tenant security ensuring data isolation

---

## 1) Main Schema Setup

Run this SQL in your Supabase SQL editor:
```sql
-- ============================================
-- CAREERS PAGE BUILDER - COMPLETE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- COMPANIES TABLE
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  
  -- Brand settings
  brand_primary_color TEXT DEFAULT '#3b82f6',
  brand_accent_color TEXT DEFAULT '#8b5cf6',
  logo_url TEXT,
  banner_url TEXT,
  culture_video_url TEXT,

  -- Dynamic content sections (JSONB for flexibility)
  sections JSONB DEFAULT '[
    {
      "id": "hero",
      "type": "hero",
      "visible": true,
      "order": 0,
      "data": {
        "title": "Join Our Team",
        "subtitle": "Build amazing things with us"
      }
    },
    {
      "id": "about",
      "type": "about",
      "visible": true,
      "order": 1,
      "data": {
        "title": "About Us",
        "content": "We are building the future. Join us on this exciting journey."
      }
    }
  ]'::jsonb,
  
  -- Publishing status (draft vs published)
  is_published BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOBS TABLE (matches CSV structure)
-- ============================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Job details (from CSV)
  title TEXT NOT NULL,
  work_policy TEXT, -- Remote, Hybrid, On-site
  location TEXT,
  department TEXT,
  employment_type TEXT, -- Full-time, Part-time, Contract, Internship
  experience_level TEXT, -- Entry, Mid, Senior, Lead
  job_type TEXT, -- Engineering, Marketing, Sales, etc.
  salary_range TEXT,
  
  -- Additional fields
  job_slug TEXT NOT NULL,
  description TEXT DEFAULT 'No description provided.',
  is_open BOOLEAN DEFAULT true,
  posted_days_ago INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique slug per company
  UNIQUE(company_id, job_slug)
);

-- ============================================
-- INDEXES (for performance)
-- ============================================

-- Company indexes
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_owner ON companies(owner_id);
CREATE INDEX idx_companies_published ON companies(is_published);

-- Job indexes (critical for search/filter)
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_open ON jobs(is_open);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_department ON jobs(department);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_work_policy ON jobs(work_policy);

-- Full-text search index
CREATE INDEX idx_jobs_search ON jobs 
  USING gin(to_tsvector('english', title || ' ' || COALESCE(location, '') || ' ' || COALESCE(department, '')));

-- ============================================
-- ROW LEVEL SECURITY (RLS) - MULTI-TENANT
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COMPANIES RLS POLICIES
-- ============================================

-- Recruiters can view their own companies
CREATE POLICY "Recruiters can view own companies"
  ON companies FOR SELECT
  USING (auth.uid() = owner_id);

-- Recruiters can insert their own companies
CREATE POLICY "Recruiters can insert own companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Recruiters can update their own companies
CREATE POLICY "Recruiters can update own companies"
  ON companies FOR UPDATE
  USING (auth.uid() = owner_id);

-- Recruiters can delete their own companies
CREATE POLICY "Recruiters can delete own companies"
  ON companies FOR DELETE
  USING (auth.uid() = owner_id);

-- Public can view published companies
CREATE POLICY "Public can view published companies"
  ON companies FOR SELECT
  USING (is_published = true);

-- ============================================
-- JOBS RLS POLICIES
-- ============================================

-- Recruiters can view jobs from their companies
CREATE POLICY "Recruiters can view own company jobs"
  ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- Recruiters can insert jobs for their companies
CREATE POLICY "Recruiters can insert jobs for own companies"
  ON jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- Recruiters can update jobs from their companies
CREATE POLICY "Recruiters can update jobs for own companies"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- Recruiters can delete jobs from their companies
CREATE POLICY "Recruiters can delete jobs for own companies"
  ON jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- Public can view open jobs from published companies
CREATE POLICY "Public can view published company jobs"
  ON jobs FOR SELECT
  USING (
    is_open = true
    AND EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.is_published = true
    )
  );


-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



-- Get unique filter options for a company's jobs
CREATE OR REPLACE FUNCTION get_job_filter_options(company_slug TEXT)
RETURNS TABLE(
  locations TEXT[],
  departments TEXT[],
  job_types TEXT[],
  work_policies TEXT[],
  experience_levels TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    array_remove(array_agg(DISTINCT location ORDER BY location), NULL),
    array_remove(array_agg(DISTINCT department ORDER BY department), NULL),
    array_remove(array_agg(DISTINCT job_type ORDER BY job_type), NULL),
    array_remove(array_agg(DISTINCT work_policy ORDER BY work_policy), NULL),
    array_remove(array_agg(DISTINCT experience_level ORDER BY experience_level), NULL)
  FROM jobs j
  JOIN companies c ON j.company_id = c.id
  WHERE c.slug = company_slug
    AND c.is_published = true
    AND j.is_open = true;
END;
$$ LANGUAGE plpgsql;
```

---

## 2) User Profiles Table

Create the profiles table for user management:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow insert for authenticated users
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 3) Storage Bucket Setup

### Create the Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `company-assets`
4. Set it as **Public bucket**
5. Click **Create bucket**

### Apply Storage Policies

Run this SQL to set up storage access policies:
```sql
-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Anyone can view files
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-assets');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-assets' 
    AND auth.role() = 'authenticated'
  );

-- Users can update their own files
CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Database Features

### Multi-Tenant Architecture
- Each recruiter can only access their own companies and jobs
- Public users can view published career pages and open jobs
- Enforced through Row Level Security (RLS) policies

### Performance Optimizations
- Indexed columns for fast filtering and searching
- Full-text search support for job titles, locations, and departments
- Automatic timestamp updates via triggers

### Dynamic Content
- Companies table uses JSONB for flexible section management
- Sections can be reordered, hidden/shown, and customized
- Easy to extend with new section types

### Storage Management
- Folder-based organization using user IDs
- Public read access for career page assets
- User-owned file management (upload/update/delete)

---


## Next Steps

- Configure your `.env` file with Supabase credentials
- Run `npm install` and `npm run dev`
- Start building your career pages!


