# Senevon Website Migration Context

Last reviewed from codebase: 2026-09-16

This document summarizes the current project so a new website can be generated without reconstructing the existing content/data from memory. Treat it as a migration checklist and source map.

## Project Overview

This is the Senevon/SNV website codebase. It is mainly a React single-page website with animated sections, hardcoded marketing content, Supabase-backed public forms, and admin dashboards for submissions.

The repository has three top-level app areas:

- `frontend/`: active Vite + React website.
- `backend/`: Express + MongoDB backend for contact/career submissions. It appears partly legacy because the current frontend mostly writes directly to Supabase.
- `server/`: only contains a Supabase helper and package files; no runnable app entry was found.

There is no root `package.json`; run app commands inside `frontend/` or `backend/`.

## Tech Stack

Frontend:

- Vite
- React 19
- React Router 7
- Tailwind CSS 3
- GSAP / ScrollTrigger
- Three.js, `@react-three/fiber`, `@react-three/drei`
- Spline React
- Supabase JS
- React Icons and Lucide

Backend:

- Node.js
- Express 5
- Mongoose/MongoDB
- Helmet
- CORS
- Express rate limiting
- dotenv

External services used by the frontend:

- Supabase for auth and data tables
- Cloudinary unsigned upload for career resumes
- Cloudinary-hosted portfolio images
- Pexels/Unsplash remote imagery
- Google Analytics tag `G-1CMQ30J1D8`

## Main Frontend Routes

Defined in `frontend/src/App.jsx`:

- `/`: homepage
- `/products`: products page
- `/services`: services hub page
- `/services/design-studio`: design service detail page
- `/services/engineering`: engineering service detail page
- `/services/consultancy`: consultancy service detail page
- `/about`: about page
- `/faq`: FAQ page
- `/ecosystem`: ecosystem page
- `/admin`: Supabase admin login page
- `/admin/dashboard`: Supabase admin dashboard

The header navigation in `frontend/src/components/Header.jsx` links:

- Home: `/`
- Products: `/products`
- Services: opens service modal / links service route
- About Us: `/about`
- Career: `/#careers`
- FAQ: `/faq`

Footer links in `frontend/src/components/Footer.jsx` include some routes that do not currently exist in `App.jsx`, such as `/products/senevon-ai`, `/legal/privacy-policy`, and `/services/ai`.

## Homepage Composition

The homepage is assembled in `frontend/src/pages/Home.jsx`.

Sections, in order:

1. `Header`
2. `Hero4`
3. `chaingrid2` / labs ecosystem section
4. `production` / product carousel
5. `aboutUs`
6. `ourWorks`
7. `careers`
8. `Tools`
9. `Testimonial`
10. `subs`
11. `Footer`

Most sections lazy-load through `DeferredMount`, so content is split across component files rather than a CMS.

## Static Content To Migrate

Most marketing data is hardcoded in React arrays. These are the important source files:

- Services catalog: `frontend/src/data/servicesCatalog.js`
- Products page data: `frontend/src/pages/Products.jsx`
- Homepage product carousel: `frontend/src/components/production.jsx`
- Portfolio/works: `frontend/src/components/ourWorks.jsx`
- Careers/team roles: `frontend/src/components/careers.jsx`
- About section metrics/process: `frontend/src/components/aboutUs.jsx`
- FAQ content: `frontend/src/components/faq.jsx`
- Subparts/services blocks: `frontend/src/pages/subs.jsx`
- Labs/ecosystem partners/socials: `frontend/src/components/chaingrid2.jsx`
- Footer links/social links: `frontend/src/components/Footer.jsx`
- SEO/meta/schema: `frontend/index.html`
- Sitemap/robots: `frontend/public/sitemap.xml`, `frontend/public/robots.txt`

### Services Catalog

Main file: `frontend/src/data/servicesCatalog.js`

Top-level services:

- `design-studio`
- `engineering`
- `consultancy`

Each service has:

- `slug`
- `title`
- `summary`
- `brief`
- `categories`

Each category has:

- `slug`
- `title`
- `brief`
- `works`

Each work item has:

- `title`
- `caption`
- `image`

Important: the service portfolio images are generated from Pexels image IDs in the same file. They are not local assets and not stored in Supabase.

### Products

Two product data sources exist:

1. `frontend/src/pages/Products.jsx`
   - Senevon Code Studio
   - Hospital Management System
   - Project Management Suite
   - Retail / POS Analytics
   - Arcade Micro-Games
   - Custom Systems

2. `frontend/src/components/production.jsx`
   - Retail-Rail
   - K-Stock
   - SNV-HR
   - CodeMist
   - Travar

These are currently static arrays with remote Unsplash images.

### Portfolio / Works

Main file: `frontend/src/components/ourWorks.jsx`

Categories:

- Websites
- Webapps
- Data Science
- Graphics Designs

Current works include:

- Portfolios
- Toolit
- Travar
- Moon Walk
- Resturang
- Codemist
- Vendor Priority Model
- Retail KPI Analytics
- Brand Identity Pack
- Social Creatives

Some images are Cloudinary URLs under `https://res.cloudinary.com/dktixqoek/...`; some are Unsplash URLs. One image URL has a leading space before `https`, which should be cleaned during migration.

### Careers

Main file: `frontend/src/components/careers.jsx`

Teams:

- Engineering
- Design
- Data Science
- Marketing

Roles:

- Frontend Engineer, full-time, Remote / India, Mid-Senior, tags React/Next.js/Tailwind
- Backend Engineer, full-time, Remote, Senior, tags Node.js/MongoDB/Security
- UI/UX Designer, contract, Remote, Mid, tags Figma/Design Systems/Mobile-first
- Data Science Engineer, full-time, Remote, Mid, tags Python/Pandas/ML
- Content + Growth Associate, intern/part-time, Remote, Entry, tags SEO/Social/Copywriting

Career applications insert into Supabase `career_applications`. Resume files upload to Cloudinary first.

### FAQ

Main file: `frontend/src/components/faq.jsx`

The FAQ answers describe Senevon as an IT startup providing:

- Custom software development
- Business platforms
- Creative/design services
- E-commerce development
- ERP
- LMS
- Logo design and branding
- Graphic design
- Cloud/on-prem/hybrid deployment
- Post-deployment support
- Security practices
- Third-party integrations

### About / Company Claims

Main files:

- `frontend/src/pages/About.jsx`
- `frontend/src/components/aboutUs.jsx`

Reusable about section metrics:

- Products shipped: `18+`
- Clients supported: `65+`
- Average delivery cycle: `21 days`
- Uptime focus: `96.9%`

Pillars:

- Engineering-first
- Design systems
- Data-driven
- Security-aware

Timeline:

- Discover
- Design
- Build
- Scale

## Assets To Migrate

Local assets are in:

- `frontend/public/`
- `frontend/src/assets/`

Important local assets:

- Logos:
  - `frontend/public/logo.png`
  - `frontend/public/logo (2).png`
  - `frontend/public/logo/logo-main.png`
  - `frontend/public/logo/logo-black.png`
  - `frontend/public/logo/logo-black2.png`
  - `frontend/public/logo/tech.png`
  - `frontend/public/logo/studio.png`
  - `frontend/public/logo/labs.png`
  - mirrored versions under `frontend/src/assets/logo/`
- 3D models:
  - `frontend/public/models/robot.glb`
  - `frontend/public/models/robot2.glb`
  - `frontend/public/models/robot-compo.glb`
- Videos:
  - `frontend/public/video/video.mp4`
  - `frontend/public/video/robot.mp4`
  - `frontend/public/video/robot2.mp4`
  - `frontend/public/video/robot3.mp4`
  - `frontend/public/video/robot-compressed.mp4`
  - `frontend/public/video/gene.mp4`
- Icons:
  - cursor and arrow PNGs under `frontend/public/icons/` and `frontend/src/assets/icons/`
- Fonts:
  - multiple custom fonts in `frontend/src/assets/fonts/`

Migration notes:

- `frontend/public/og-image.jpg` is currently 0 bytes. Replace it before launch.
- `index.html` references `/favicon-32.png`, `/favicon-48.png`, and `/apple-touch-icon.png`, but those files were not found in `frontend/public/`.
- Public and source logo folders duplicate several files; choose one asset source in the new site.

## Live Data Sources And Tables

The current frontend uses Supabase directly in several components. Before migration, export all tables below from the current Supabase project.

Environment variables required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- optional/legacy: `VITE_API_URL` or `VITE_API_BASE`

### Supabase Auth

Used by:

- `frontend/src/pages/supabaseLogin.jsx`
- `frontend/src/pages/supabaseDashboard.jsx`
- `frontend/src/lib/adminAuth.js`

Auth supports:

- Sign up
- Sign in with email/password
- Password reset to `/admin/reset`
- Auth-state redirect to `/admin/dashboard`

There is no route for `/admin/reset` in `App.jsx`, so reset flow likely needs repair in the new site.

### `contact_messages`

Used by:

- `frontend/src/components/UI/ContactModal.jsx`
- `frontend/src/components/UI/DesignRequestModal.jsx`
- `frontend/src/pages/supabaseDashboard.jsx`

Inserted fields from contact modal:

- `name`
- `email`
- `phone`
- `message`
- `source`
- `user_agent`

Inserted fields from design request modal:

- `name`
- `email`
- `phone`
- `message`
- `source`
- `user_agent`

Design requests are stored as formatted text inside `message`, with details such as service, category, selected work, company/brand, budget, timeline, and brief.

Admin dashboard expects:

- `id`
- `name`
- `email`
- `phone`
- `message`
- `created_at`

### `career_applications`

Used by:

- `frontend/src/components/careers.jsx`
- `frontend/src/pages/supabaseDashboard.jsx`

Inserted fields:

- `role_id`
- `role_title`
- `team`
- `name`
- `email`
- `portfolio`
- `location`
- `message`
- `resume_url`
- `source`
- `user_agent`

Admin dashboard expects:

- `id`
- `name`
- `email`
- `message`
- `role_title`
- `team`
- `portfolio`
- `resume_url`
- `created_at`

Resume files are uploaded to Cloudinary folder `senevon/careers`; only the resulting `secure_url` is stored in Supabase.

### `incubation_applications`

Used by:

- `frontend/src/components/UI/IncubationModal.jsx`
- `frontend/src/pages/supabaseDashboard.jsx`

Inserted fields:

- `name`
- `email`
- `company`
- `website`
- `stage`
- `track`
- `budget`
- `message`
- `created_at`
- `source`

Default incubation tracks:

- Product Build
- Platform Scale
- Design Studio

Stage options:

- Idea
- MVP
- Growth
- Enterprise

Budget options are rupee-based:

- Under Rs 1L
- Rs 1L - Rs 3L
- Rs 3L - Rs 8L
- Rs 8L+

Some source text currently has encoding issues for rupee symbols and arrows. Normalize these during migration.

### `testimonials`

Used by:

- `frontend/src/components/Testimonial.jsx`

Selected fields:

- `id`
- `name`
- `role`
- `company`
- `rating`
- `message`
- `created_at`

Inserted fields:

- `name`
- `role`
- `company`
- `rating`
- `message`

The component fetches the latest 18 testimonials, newest first, and allows public insert.

### `project_requests`

Used by:

- `frontend/src/components/UI/startProject.jsx`

Inserted fields:

- `name`
- `email`
- `phone`
- `message`
- `source`
- `status`

This component opens its own modal and writes directly to Supabase.

### `submissions`

Used by:

- `frontend/src/lib/submissionsApi.js`

Fields for contact:

- `type`
- `name`
- `email`
- `phone`
- `message`

Fields for career:

- `type`
- `name`
- `email`
- `phone`
- `role`
- `portfolio`
- `linkedin`
- `resume_url`
- `cover_letter`

This helper is not the main path used by the visible current modals/dashboard. Treat `submissions` as an older or alternative schema and check Supabase before deciding whether to migrate it.

## Mongo / Express Backend

The `backend/` folder contains an Express app that can store submissions in MongoDB. It may be legacy because the visible React app now mostly uses Supabase directly.

Environment variables:

- `MONGO_URI`
- `ADMIN_KEY`
- `FRONTEND_URL`
- `PORT`, default `5000`

Active `backend/server.js` routes:

- `POST /api/contact`
- `POST /api/career/apply`
- `GET /api/admin/submissions?type=all|contact|career`
- `DELETE /api/admin/submissions/:id`
- `GET /api/admin/contacts`
- `DELETE /api/admin/contacts/:id`
- `GET /api/health`

Inline Mongo model in `backend/server.js`: `Submission`

Fields:

- `type`: `contact` or `career`
- `name`
- `email`
- `phone`
- `message`
- `role`
- `portfolio`
- `linkedin`
- `resumeUrl`
- `coverLetter`
- timestamps: `createdAt`, `updatedAt`

There are also modular backend files:

- `backend/models/ContactMessage.js`
- `backend/controllers/contact.controller.js`
- `backend/routes/contact.routes.js`
- `backend/config/db.js`

These define a contact-only `ContactMessage` model with:

- `name`
- `email`
- `phone`
- `message`
- `source`
- `ip`
- `userAgent`
- timestamps

Migration note: confirm whether any production data exists in MongoDB. If yes, export both `submissions` and `contactmessages` collections before replacing the backend.

## Admin Dashboards

There are two admin implementations:

1. Current Supabase admin:
   - `frontend/src/pages/supabaseLogin.jsx`
   - `frontend/src/pages/supabaseDashboard.jsx`
   - Routes: `/admin`, `/admin/dashboard`
   - Reads/deletes from `contact_messages`, `career_applications`, and `incubation_applications`.

2. Older Express admin:
   - `frontend/src/pages/AdminLogin.jsx`
   - `frontend/src/pages/AdminDashboard.jsx`
   - These are not imported by `App.jsx` currently.
   - They call `/api/admin/submissions` using `VITE_API_URL` or `VITE_API_BASE`.

The active route imports Supabase pages, not the Express admin pages.

## SEO And Domain Metadata

Main file: `frontend/index.html`

Current metadata:

- Title: `Senevon - It Company | Consultancy`
- Canonical: `https://www.senevon.in/`
- Description mentions websites, UI/UX, branding, SEO, and e-commerce.
- Google Analytics ID: `G-1CMQ30J1D8`
- Organization schema uses placeholder social URLs.

Public files:

- `frontend/public/robots.txt` points sitemap to `https://senevon.in/sitemap.xml`
- `frontend/public/sitemap.xml` includes:
  - `/`
  - `/about`
  - `/services`
  - `/contact`

Migration notes:

- There is no `/contact` route in `App.jsx`; contact is a modal.
- Sitemap omits `/products`, `/faq`, `/ecosystem`, and service detail pages.
- Canonical uses `www.senevon.in`, robots sitemap uses `senevon.in`; standardize domain.
- Schema `sameAs` has placeholders.

## Design System / Visual Identity

The current website has a strong industrial/grid aesthetic:

- Main background: `#d9d9d9`
- Accent orange: `#ff5a12`
- Black/white grid borders
- Sharp rectangular layout, heavy borders, no soft card-heavy look
- Custom fonts loaded from `frontend/src/assets/fonts/`
- Frequent use of `font-[tron]`, pixel/inversion-style brand fonts, and Tailwind utility styling
- Animations with GSAP, lazy-mounted sections, and reduced-motion guards in some components
- 3D robot models/videos in homepage hero/labs sections

If generating a new site, preserve:

- The orange/gray/black identity
- Grid-based sections
- Sharp-corner buttons
- Modal forms
- Senevon/SNV7 branding
- Social links
- The service taxonomy

## External Links And Socials

Observed social/contact links:

- X: `https://x.com/senevon_tech`
- LinkedIn: `https://www.linkedin.com/company/senevon-tech/`
- Facebook: `https://www.facebook.com/profile.php?id=61585962131769`
- Instagram: `https://www.instagram.com/senevon_tech/`
- WhatsApp incubation link: `https://wa.me/919477235928?...`
- Careers email: `careers@senevon.in`

Some page-level social rails still use placeholder base links like `https://www.facebook.com/`, `https://twitter.com/`, `https://wa.me/`; replace these in the new site.

## Encoding And Cleanup Issues To Fix During Migration

Many files contain mojibake/encoding artifacts, for example:

- `âœ…`
- `â†’`
- `â€¢`
- `â€”`
- `â€“`
- `â‚¹`
- `Â©`

These represent characters such as check marks, arrows, bullets, em/en dashes, rupee symbol, and copyright symbol. Normalize them in the new website and database exports.

Other cleanup items:

- Replace empty `og-image.jpg`.
- Add missing favicon/apple icon files or remove references.
- Standardize environment variable names (`VITE_API_URL` vs `VITE_API_BASE`).
- Decide whether the new system uses Supabase directly, an API backend, or both.
- Remove or archive commented-out duplicate component versions before migration.
- Make `/admin/reset` route if password reset remains enabled.
- Fix sitemap routes and legal/product links.

## Recommended Migration Plan

1. Export Supabase data:
   - `contact_messages`
   - `career_applications`
   - `incubation_applications`
   - `testimonials`
   - `project_requests`
   - optional: `submissions`

2. Export Supabase auth users if admin accounts must carry over.

3. Export Cloudinary assets used by:
   - portfolio images in `ourWorks.jsx`
   - career resume files linked from `career_applications.resume_url`

4. Check MongoDB production collections:
   - `submissions`
   - `contactmessages`
   - any other collections in the configured database

5. Convert hardcoded frontend arrays into a migration format:
   - `services`
   - `service_categories`
   - `service_works`
   - `products`
   - `portfolio_works`
   - `career_roles`
   - `faq_items`
   - `footer_links`
   - `social_links`

6. Copy local assets:
   - logos
   - fonts
   - videos
   - GLB models
   - icons
   - favicon files

7. Normalize text encoding and route URLs.

8. Build the new website against the migrated dataset.

## Suggested New Data Model

For a new website/CMS, use structured tables or JSON collections like:

### `services`

- `id`
- `slug`
- `title`
- `summary`
- `brief`
- `sort_order`

### `service_categories`

- `id`
- `service_id`
- `slug`
- `title`
- `brief`
- `sort_order`

### `service_works`

- `id`
- `category_id`
- `title`
- `caption`
- `image_url`
- `sort_order`

### `products`

- `id`
- `slug`
- `title`
- `category`
- `description`
- `tag`
- `metric_a`
- `metric_b`
- `image_url`
- `sort_order`

### `portfolio_works`

- `id`
- `category`
- `title`
- `subtitle`
- `tags`
- `image_url`
- `sort_order`

### `career_roles`

- `id`
- `team`
- `title`
- `type`
- `location`
- `level`
- `tags`
- `description`
- `is_active`
- `sort_order`

### `faq_items`

- `id`
- `question`
- `answer`
- `sort_order`

### `submissions`

Either keep separate tables as current Supabase does, or create a unified table:

- `id`
- `type`
- `name`
- `email`
- `phone`
- `message`
- `metadata` JSON
- `source`
- `user_agent`
- `status`
- `created_at`

If using the unified model, migrate:

- contact messages as `type = contact`
- design requests as `type = design_request`
- career applications as `type = career`
- incubation applications as `type = incubation`
- project requests as `type = project_request`

## Files Most Important For Rebuild

Use these files as the primary content source:

- `frontend/src/data/servicesCatalog.js`
- `frontend/src/components/ourWorks.jsx`
- `frontend/src/components/careers.jsx`
- `frontend/src/components/faq.jsx`
- `frontend/src/components/aboutUs.jsx`
- `frontend/src/components/production.jsx`
- `frontend/src/pages/Products.jsx`
- `frontend/src/pages/subs.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/components/Header.jsx`
- `frontend/index.html`
- `frontend/public/`
- `frontend/src/assets/`

Use these files as the primary live-data behavior source:

- `frontend/src/lib/supabaseClient.js`
- `frontend/src/pages/supabaseLogin.jsx`
- `frontend/src/pages/supabaseDashboard.jsx`
- `frontend/src/components/UI/ContactModal.jsx`
- `frontend/src/components/UI/DesignRequestModal.jsx`
- `frontend/src/components/UI/IncubationModal.jsx`
- `frontend/src/components/UI/startProject.jsx`
- `frontend/src/components/Testimonial.jsx`
- `frontend/src/components/careers.jsx`

Use these files only if migrating the Express/Mongo backend:

- `backend/server.js`
- `backend/models/ContactMessage.js`
- `backend/controllers/contact.controller.js`
- `backend/config/db.js`

