# Careers Forge — Overview & Architecture

## 1. Problem This Solves

Recruiting teams often want a careers page that reflects their brand, culture, and open roles. However, most ATS-generated careers pages are rigid, generic, and difficult to customize without engineering support.

This project solves that problem by enabling recruiters to **build and manage fully branded careers pages** on their own, while ensuring the candidate experience remains **fast, clean, mobile-friendly, and intuitive**.

---

## 2. Users

### Recruiters
Recruiters can:
- Log in to the platform
- Create and manage their company’s careers page
- Configure branding (colors, logo, banner, culture video)
- Add, remove, reorder, and toggle page sections
- Manage job listings (create, edit, open/close)
- Preview changes before publishing
- Publish a public careers page

### Candidates
Candidates can:
- Visit a public careers page without authentication
- Learn about the company and its culture
- Browse open roles
- Search and filter jobs
- View detailed job descriptions

---

## 3. Authentication & Access Rules

- Authentication is handled via **Supabase Auth** using email and password.
- Public careers pages are accessible without authentication.
- Recruiters can only manage companies and jobs that they own.
- Tenant isolation is enforced using Row Level Security (RLS).

---

## 4. Frontend Architecture

### Tech Stack
- **Vite + React + TypeScript**
- **react-router-dom** for routing
- **Zustand** for global state management
- **shadcn/ui** components with **Tailwind CSS** for UI

### State Management
Zustand stores:
- `src/store/authStore.ts` — authentication and session state
- `src/store/companyStore.ts` — company and careers page configuration
- `src/store/jobStore.ts` — job listings and job state

### Live Preview
- Live preview is implemented in  
  `src/components/recruiter/LivePreview.tsx`
- Uses the **same components as the public careers page**
- Ensures preview accurately reflects the published output

---

## 5. Backend Architecture

### Platform
- **Supabase**

### Services
- Authentication: Supabase Auth (email/password)
- Database: PostgreSQL

### Tables
- `companies`
- `jobs`
- `profile`

### Data & Security
- Row Level Security (RLS) used for multi-tenant isolation
- Careers page sections are stored as **JSONB** for flexible, dynamic page composition

---

## 6. Key Flows

### Recruiter Sign Up / Sign In

#### Pages
- `src/pages/auth/RegisterPage.tsx`
- `src/pages/auth/LoginPage.tsx`

#### State
- Authentication state managed in:
  - `src/store/authStore.ts`

#### Route Protection
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/layout/RecruiterLayout.tsx`

---

### Create / Edit Careers Page (Company)

#### Flow
Dashboard → Create or Select Company → Edit Company Page

#### Main Editor Page
- `src/pages/edit/CompanyEditPage.tsx`

#### Editor Capabilities
- Brand settings:
  - Primary and accent colors
  - Logo upload
  - Banner image upload
  - Culture video URL
- Section manager:
  - Add, remove, reorder sections
  - Toggle section visibility
- Jobs manager:
  - Create, edit, open, and close jobs
- Publish controls:
  - Save draft
  - Preview changes
  - Publish careers page

---
