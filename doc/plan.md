# 🧭 TourKit — Smart Website Onboarding Tour SaaS
### Execution Plan (Vibe-Coded, Supabase-Powered)

---

## ✅ Viability Assessment

**Verdict: Solid beginner SaaS idea. Earnable, but competitive.**

| Factor | Assessment |
|--------|-----------|
| Market demand | ✅ Real pain point — product tours are widely used |
| Competition | ⚠️ Exists (Intro.js free, Shepherd.js free, Userflow/Appcues paid) |
| Differentiation | 🎯 Auto-detection + zero-config is your edge |
| Vibe-code friendly | ✅ Very yes — clear scope, defined modules |
| Supabase fit | ✅ Perfect — auth, DB, and API all in one |
| Monetization | ✅ Clear free/paid split possible |

**Realistic earning path:** Get 10 paying customers at $9–19/mo = $90–190 MRR. Scale from there.

---

## 🏗️ Tech Stack (Final Recommendation)

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend Dashboard | Next.js 14 (App Router) | Easy deploy on Vercel, great DX |
| Styling | Tailwind CSS + shadcn/ui | Fast, looks professional |
| Backend/DB | Supabase | Auth + Postgres + Row Level Security |
| Client SDK | Vanilla JS (no framework) | Must run on ANY website |
| CDN for SDK | jsDelivr or Cloudflare R2 | Free, fast global delivery |
| Payments | Lemon Squeezy | Simpler than Stripe for solo devs |
| Deployment | Vercel (dashboard) | Free tier works to start |

---

## 🗄️ Supabase Schema (Production-Ready)

```sql
-- Users handled by Supabase Auth automatically

-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  domain text not null,
  script_key text unique not null default gen_random_uuid()::text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Tours table
create table tours (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text default 'Default Tour',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Steps table
create table steps (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id) on delete cascade,
  selector text not null,
  title text,
  message text not null,
  position text default 'bottom', -- top | bottom | left | right
  step_order integer not null,
  created_at timestamptz default now()
);

-- Analytics table
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  event_type text not null, -- tour_started | tour_completed | tour_skipped | step_viewed
  step_order integer,
  session_id text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table projects enable row level security;
alter table tours enable row level security;
alter table steps enable row level security;

create policy "Users own their projects" on projects
  for all using (auth.uid() = user_id);

create policy "Users own their tours" on tours
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );

create policy "Users own their steps" on steps
  for all using (
    tour_id in (
      select t.id from tours t
      join projects p on p.id = t.project_id
      where p.user_id = auth.uid()
    )
  );
```

---

## 📁 Project Folder Structure

```
tourkit/
├── app/                        # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx            # Project list
│   │   ├── projects/
│   │   │   ├── [id]/page.tsx   # Single project view
│   │   │   └── new/page.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── tour/[scriptKey]/route.ts   # Public API — SDK calls this
│       └── analytics/route.ts          # Receives events from SDK
├── components/
│   ├── ui/                     # shadcn components
│   ├── TourEditor.tsx
│   ├── StepCard.tsx
│   └── ScriptSnippet.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── sdk/                        # The client-side script (separate build)
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── scanner.ts          # DOM detection
│   │   ├── renderer.ts         # Tooltip UI
│   │   └── tracker.ts          # Analytics pings
│   ├── dist/
│   │   └── tourkit.min.js      # Built output — hosted on CDN
│   └── package.json
├── public/
└── package.json
```

---

## 🔌 SDK Architecture (tourkit.min.js)

This is the most critical piece. It must be:
- Under 10KB minified
- Zero dependencies
- Works on any website

```javascript
// sdk/src/index.ts — Core logic outline

(function() {
  const SCRIPT_TAG = document.currentScript;
  const SCRIPT_KEY = SCRIPT_TAG?.getAttribute('data-key');
  const API_BASE = 'https://yourdomain.com/api';

  if (!SCRIPT_KEY) return;

  // 1. Check if first visit
  const SESSION_KEY = `tourkit_seen_${SCRIPT_KEY}`;
  if (localStorage.getItem(SESSION_KEY)) return;

  // 2. Fetch tour config from your API
  fetch(`${API_BASE}/tour/${SCRIPT_KEY}`)
    .then(r => r.json())
    .then(config => {
      if (!config.is_active || !config.steps.length) return;
      startTour(config.steps);
    });

  function startTour(steps) {
    // Mark as seen
    localStorage.setItem(SESSION_KEY, '1');
    // Render tooltip UI, handle next/prev/skip
    // Send analytics events
  }
})();
```

**Integration snippet users add to their site:**
```html
<script src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v13/sdk/dist/tourkit.min.js"
        data-key="YOUR_SCRIPT_KEY"
        async>
</script>
```

---

## 🖥️ Dashboard Pages (Build Order)

### Phase 1 — Core (Week 1–2)
1. **Auth pages** — Supabase Auth UI component (copy-paste)
2. **Project list** — Create project, see script key
3. **Script installer page** — Show copy-paste snippet
4. **Tour editor** — List steps, edit message/selector/position
5. **Public API route** — `/api/tour/[scriptKey]` returns JSON config

### Phase 2 — Polish (Week 3)
6. **Live preview panel** — Renders tooltip UI in an iframe
7. **Enable/disable tour** toggle
8. **Analytics dashboard** — Basic counts (started, completed, skipped)

### Phase 3 — Monetize (Week 4)
9. **Pricing page**
10. **Lemon Squeezy integration** — Webhook sets `plan` on user
11. **Usage limits** — Free = 1 project, 500 tours/mo

---

## 💡 Auto-Detection Logic (scanner.ts)

```typescript
export function detectElements() {
  const candidates = [];

  // 1. Navigation
  const nav = document.querySelector('nav, header, [role="navigation"]');
  if (nav) candidates.push({ role: 'nav', el: nav });

  // 2. Main content area (largest visible div)
  const main = document.querySelector('main, [role="main"], #app, #root > *:first-child');
  if (main) candidates.push({ role: 'main', el: main });

  // 3. Primary CTA button
  const cta = findPrimaryButton();
  if (cta) candidates.push({ role: 'cta', el: cta });

  // 4. Sidebar or secondary panel
  const sidebar = document.querySelector('aside, [role="complementary"]');
  if (sidebar) candidates.push({ role: 'sidebar', el: sidebar });

  return candidates.slice(0, 5); // Max 5 steps
}

function findPrimaryButton() {
  // Look for prominent button by keywords + visual size
  const buttons = Array.from(document.querySelectorAll('button, a[class*="btn"], a[class*="cta"]'));
  return buttons.find(b =>
    /get started|sign up|create|new|add/i.test(b.textContent || '')
  ) || buttons[0];
}
```

---

## 💰 Monetization Plan

| Plan | Price | Limits |
|------|-------|--------|
| Free | $0 | 1 project, 200 tour sessions/mo, TourKit branding |
| Starter | $9/mo | 3 projects, 2,000 sessions/mo, no branding |
| Pro | $19/mo | Unlimited projects, 10,000 sessions/mo, analytics |

**Revenue target:** 50 Starter users = $450 MRR. Very achievable in 3–6 months with marketing.

---

## 🚀 Launch Checklist

- [ ] SDK builds and loads correctly on test sites
- [ ] `/api/tour/[scriptKey]` returns correct JSON
- [ ] Supabase RLS policies tested
- [ ] Dashboard CRUD works (create project → get key → edit steps)
- [ ] SDK reads `localStorage` to avoid repeat tours
- [ ] Analytics events fire correctly
- [ ] Custom domain set up for CDN
- [ ] Pricing page live
- [ ] Lemon Squeezy webhook updates user plan
- [ ] Post on Product Hunt / HackerNews / Twitter

---

## ⚠️ Risks & How to Handle Them

| Risk | Mitigation |
|------|-----------|
| Free alternatives (Intro.js) exist | Your value = zero-config auto-detection, hosted dashboard, no-code editing |
| SDK breaks on some websites | Add extensive error handling + `try/catch` around all DOM queries |
| Low conversion free → paid | Offer "remove TourKit branding" as the key paid unlock |
| Supabase free tier limits | Fine until ~500 MAU, then upgrade ($25/mo) |

---

## 📅 Realistic Timeline (Solo Dev, Vibe-Coding)

| Week | Goal |
|------|------|
| Week 1 | Supabase setup, auth, project CRUD, DB schema |
| Week 2 | SDK core — detection, rendering, API fetch |
| Week 3 | Dashboard polish, preview panel, analytics |
| Week 4 | Payments, pricing page, deploy to production |
| Week 5+ | Launch, gather feedback, iterate |

---

## 🔑 The One Thing That Makes This Work

Your differentiation is **auto-detection**. Every competitor requires manual selector writing. If your scanner correctly identifies nav/CTA/main content on 80%+ of websites — that's your whole pitch.

> *"Paste one script tag. Get an instant onboarding tour. No configuration needed."*

Build that demo first. If it works convincingly on 5 random websites, you have a product worth launching.