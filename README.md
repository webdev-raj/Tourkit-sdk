# TourKit

> Onboarding tours for any website — one script tag, zero config.

![TourKit Dashboard](doc/images/dashboard.png)

TourKit lets you create guided onboarding tours for any website 
from a simple dashboard. Add steps, configure messages, and your 
visitors get a smooth walkthrough automatically.

---

## ✨ See it in action

![Tour Preview](doc/images/tour-preview.png)

---

## 🚀 How it works

**1. Create a project in the dashboard**

Sign up, create a project, and get your unique script key.

**2. Add tour steps**

![Step Editor](doc/images/editor.png)

Configure each step with a title, message, and CSS selector 
that points to any element on your page.

**3. Paste the script tag**

![Install Snippet](doc/images/install.png)

```html
<script
  src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v14/sdk/dist/tourkit.min.js"
  data-key="YOUR_SCRIPT_KEY"
  data-api="https://tourkit-phi.vercel.app"
  async>
</script>
```

Paste this before `</body>` on your website. That's it.

**4. Visitors get an automatic guided tour**

First time visitors see a smooth step-by-step walkthrough 
with highlighted elements and tooltips.

---

## 🧩 Features

- **Zero config** — paste one script tag and it works
- **Visual step editor** — no code needed to configure tours
- **CSS selector targeting** — highlight any element on your page
- **Smart positioning** — tooltips auto-position to stay in viewport
- **First visit only** — tour shows once per visitor automatically
- **Analytics tracking** — see starts, completions, and skip rates
- **Works everywhere** — any website, any framework, any stack

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Dashboard | Next.js 14 App Router |
| Database & Auth | Supabase |
| Styling | Tailwind CSS + shadcn/ui |
| Client SDK | Vanilla JavaScript |
| SDK Bundler | esbuild |
| Hosting | Vercel |
| CDN | jsDelivr |

---

## 🏗️ Local Development

### 1. Clone the repo

```bash
git clone https://github.com/webdev-raj/Tourkit.git
cd Tourkit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

- Create a project at supabase.com
- Go to Settings → API and copy your keys
- Run the schema in Supabase SQL Editor:
```html
// TourKit (Supabase) schema + RLS
// Run in Supabase SQL Editor (or as a migration).

create extension if not exists "pgcrypto";

// Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  domain text not null,
  script_key text unique not null default gen_random_uuid()::text,
  is_active boolean default true,
  created_at timestamptz default now()
);

// Tours table
create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text default 'Default Tour',
  is_active boolean default true,
  created_at timestamptz default now()
);

// Steps table
create table if not exists steps (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id) on delete cascade,
  selector text not null,
  title text,
  message text not null,
  position text default 'bottom', -- top | bottom | left | right
  step_order integer not null,
  created_at timestamptz default now()
);

// Analytics events (ingested server-side via service role)
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  event_type text not null, -- tour_started | tour_completed | tour_skipped | step_viewed
  step_order integer,
  session_id text,
  created_at timestamptz default now()
);

// Helpful indexes
create index if not exists projects_user_id_idx on projects(user_id);
create index if not exists projects_script_key_idx on projects(script_key);
create index if not exists tours_project_id_idx on tours(project_id);
create index if not exists steps_tour_id_order_idx on steps(tour_id, step_order);
create index if not exists analytics_events_project_id_created_at_idx on analytics_events(project_id, created_at desc);

// Row Level Security
alter table projects enable row level security;
alter table tours enable row level security;
alter table steps enable row level security;
alter table analytics_events enable row level security;

// Projects: owners can do everything
drop policy if exists "Users own their projects" on projects;
create policy "Users own their projects" on projects
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

// Tours: owners via project ownership
drop policy if exists "Users own their tours" on tours;
create policy "Users own their tours" on tours
  for all
  using (
    project_id in (select id from projects where user_id = auth.uid())
  )
  with check (
    project_id in (select id from projects where user_id = auth.uid())
  );

// Steps: owners via project ownership
drop policy if exists "Users own their steps" on steps;
create policy "Users own their steps" on steps
  for all
  using (
    tour_id in (
      select t.id
      from tours t
      join projects p on p.id = t.project_id
      where p.user_id = auth.uid()
    )
  )
  with check (
    tour_id in (
      select t.id
      from tours t
      join projects p on p.id = t.project_id
      where p.user_id = auth.uid()
    )
  );

// Analytics: owners can read their analytics; inserts come from server (service role bypasses RLS)
drop policy if exists "Users can read analytics events" on analytics_events;
create policy "Users can read analytics events" on analytics_events
  for select
  using (
    project_id in (select id from projects where user_id = auth.uid())
  );

```

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## 📦 SDK Development

The SDK is a standalone vanilla JS file that runs on 
customer websites.

### Build the SDK

```bash
cd sdk
npm install
npm run build
```

Output: `sdk/dist/tourkit.min.js`

### Test locally

Open `sdk/test.html` in your browser after building.

### Build for production

```bash
$env:TK_API_ORIGIN="https://your-domain.vercel.app"; npm run build
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| projects | One per website, stores script key |
| tours | One per project |
| steps | Ordered steps for each tour |
| analytics_events | Tour and step events |

Full schema in `doc/schema.sql`

---

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key |
| NEXT_PUBLIC_APP_URL | Your production app URL |

---

## 🗺️ Roadmap

- [x] Dashboard and project management
- [x] Step editor with CSS selector targeting
- [x] Vanilla JS SDK
- [x] CDN hosting
- [x] Analytics event tracking
- [ ] Analytics dashboard UI
- [ ] Pricing and paid plans
- [ ] Tour preview in dashboard
- [ ] Drag and drop step reordering
- [ ] Multi-language support

---

## 📄 License

MIT © Raj Chavan

---

## 🔗 Links

- **Live app:** https://tourkit-phi.vercel.app
- **GitHub:** https://github.com/webdev-raj/Tourkit