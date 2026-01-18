
# AGENT_LOG.md  
## How I Used AI Tools During This Project

This document explains how I used AI tools (ChatGPT, Claude, and Lovable.dev) during the development of this assignment, what prompts I used, where AI helped, where it didn’t, and what I learned along the way.

---

## Initial Setup & Architecture

### AI Prompts I Used
- Read the entire assignment requirements and help me understand the database schema needed  
- Should I use a custom backend or Supabase for this project?  
- Give me step-by-step Supabase setup instructions  

### What the AI Helped With
The AI helped me realize that using **Supabase** was a better decision than building a custom Express backend for this assignment because:
- The assignment emphasized speed (6–8 hours)
- Row Level Security handles multi-tenancy cleanly
- Built-in authentication removed the need to implement JWTs
- The Supabase free tier was more than enough for a demo

### Learning
When I started, I honestly thought building a full custom backend would make the project look more impressive. As I worked through the requirements, it became clear that choosing the right tool for the job mattered more than building everything from scratch. Using Supabase let me focus on the actual product problems instead of infrastructure.

---

## Changes I Made
The AI initially suggested a very large SQL schema. I simplified it by removing unnecessary fields and keeping only what the assignment actually required.

---

## Authentication Implementation

### AI Prompts I Used
- Create `supabase.ts` and implement this code in my project  
- Fix error: Module `@/store/authStore` has no exported member `useAuthStore`  
- Check if we are storing email, password, and recruiter name in Supabase  

### AI Response
The AI provided a complete Zustand-based auth store integrated with Supabase Auth. The `initialize()` pattern to restore sessions on page refresh was something I wouldn’t have thought of on my own.

### Issues
I initially thought I needed a separate `profiles` table to store user data.

- AI clarified that Supabase Auth already stores email in `auth.users`
- No need to duplicate that data unless additional fields are required

### Learning
- Supabase Auth already handles session persistence
- Checking `tsconfig.json` often resolves confusing import issues
- Avoid duplicating data that is already managed by the auth system

---

## CSV Import Feature

### AI Prompts I Used
- Implement a CSV import feature in the Jobs section of the edit page  
- How do I parse CSV files in React?  

### AI Response
The AI introduced me to the **PapaParse** library, which I hadn’t used before. It suggested a clean approach for both file uploads and Google Sheets CSV URLs.

### Issues
- The initial implementation froze when importing ~150 rows

### Fix Suggested by AI
- Batch inserts (50 jobs at a time)

### Result
- Smooth imports even with larger datasets

### Changes I Made
- Added an import results dialog (e.g. “150 imported, 3 failed”)
- Added success and failure toast notifications
- The original AI solution didn’t include user feedback during upload

### Learning
- CSV parsing needs proper validation (empty rows, missing columns)
- User feedback is critical for async operations like imports

---

## Preview & Public Links Bug

### AI Prompts I Used
- Dashboard “View” button is not opening the correct careers page  
- Publish section “Open Preview in New Tab” link is broken  

### AI Response
The AI helped identify that I was using relative URLs like `/${slug}/careers`, which broke when opening links in a new tab. Switching to absolute URLs using `window.location.origin` fixed the issue.

### Issues
- “View” button navigated to `/undefined/careers`
- Root cause: I destructured `slug`, but the parent component was passing `company_slug`

### Changes I Made
- Fixed the prop name mismatch
- Verified data flow by logging props in the component tree

### Learning
- Log props when something doesn’t behave as expected
- Proper TypeScript typing would have caught this earlier
- Always use absolute URLs for new tabs or windows

---

## Frontend Prompts (Lovable.dev)

### Prompt 1 — Base Frontend Setup
I used Lovable.dev mainly to move fast and avoid spending time on UI boilerplate. The goal was clarity and usability, not over-polished visuals. I set up a React + TypeScript project with Tailwind, shadcn/ui, and built the core recruiter flows (auth, dashboard, editor, publish) along with public careers pages. The editor uses a simple two-panel layout with shared components between preview and public pages to avoid mismatches.

---

### Prompt 2 — Visual Refinement
I asked the AI to update the UI to a darker, more polished style using black and grey tones. The home page was refined to feel slightly 3D, using Aceternity UI for depth and shadcn/ui for structure. Features were represented as square tiles in a honeycomb-style layout. The color palette was limited to black, white, `#FEBE10`, and `#4169E1`.

---

### Prompt 3 — Mobile UX Improvements
I asked the AI to improve mobile usability by:
- Moving the preview panel below the controls on mobile
- Making the preview fully scrollable
- Adding company social links (LinkedIn, GitHub, X, Instagram, Reddit)
- Adding a “Details” button to job cards
- Making the top navigation collapsible on mobile
- Reviewing all components for mobile compatibility

---

