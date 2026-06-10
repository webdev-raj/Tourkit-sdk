📝 Future feature: Video-based tours
- Autoplay when tooltip appears
- Video source: TBD (upload / Loom / YouTube)
- Pro only feature
- Autoplay with sound off by default

📝 Future feature: Prebuilt tooltip templates
- 5-8 preset designs
- One click apply
- Free: basic templates
- Pro: full library + custom

📝 Future feature: Announcement Feature
# V5 — Announcements Feature

## Overview

Announcements allow TourKit users to create
targeted messages for their website visitors.
Same script tag as tours — zero extra setup.

Think: Intercom Announcements but affordable.

---

## How it works

User creates announcement in TourKit dashboard
→ SDK fetches it alongside tour config
→ Displays to visitors based on rules
→ Tracks views, clicks, dismissals

---

## Announcement Types

### 1. Modal
Full center popup with overlay.
Best for: major feature launches, 
product updates, important notices.

### 2. Banner
Thin bar at top of page.
Best for: sales, limited time offers,
maintenance notices, new features.

### 3. Slide-in
Card slides from bottom right corner.
Best for: subtle feature announcements,
tips, non-urgent updates.

---

## Fields

### Basic Information

| Field | Type | Required |
|-------|------|----------|
| Title | text | ✅ |
| Description | textarea | ✅ |
| CTA Button Text | text | ❌ |
| CTA URL | text | ❌ |
| Announcement Type | select (modal/banner/slide-in) | ✅ |

### Media

| Field | Type | Limits |
|-------|------|--------|
| Image | upload (PNG/JPG/WebP) | 5MB max |
| Video | upload (MP4) | 20MB max |

Both optional.
Video is powerful for feature previews.

### Scheduling

| Field | Type | Notes |
|-------|------|-------|
| Start Date | date picker | Optional. Shows immediately if empty |
| End Date | date picker | Optional. Auto-expires after this date |

### Display Rules

**Show On:**
- All pages (default)
- Specific URL paths (same syntax as tours)
  - /dashboard
  - /pricing
  - /dashboard/projects/[id]

**Show To (V5 launch):**
- All visitors (default)

**Show To (V6 future):**
- New users only
- Returning users only
- Logged in users only
- Free plan users only

### Frequency

| Option | Behavior |
|--------|---------|
| Once per user | Shows one time. Never again. |
| Until dismissed | Shows every visit until user closes it |
| Every visit | Shows on every page load |

Default: Until dismissed (most useful)

---

## Analytics

Track per announcement:

| Metric | Description |
|--------|-------------|
| Views | Times announcement was shown |
| Clicks | Times CTA button was clicked |
| CTR | Click through rate (clicks/views) |
| Dismissals | Times user closed it |
| Active since | When it started showing |

---

## Database Schema

```sql
create table announcements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) 
    on delete cascade,
  title text not null,
  description text not null,
  cta_text text,
  cta_url text,
  type text default 'modal',
  image_url text,
  video_url text,
  show_on text default 'all',
  frequency text default 'until_dismissed',
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table announcement_events (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid references announcements(id)
    on delete cascade,
  project_id uuid references projects(id)
    on delete cascade,
  event_type text not null,
  session_id text,
  created_at timestamptz default now()
);
```

---

## API Changes

### GET /api/tour/[scriptKey]

Add announcements to response:

```json
{
  "is_active": true,
  "steps": [...],
  "customization": {...},
  "announcements": [
    {
      "id": "uuid",
      "title": "New Feature",
      "description": "We just launched...",
      "cta_text": "Try Now",
      "cta_url": "/dashboard",
      "type": "modal",
      "image_url": null,
      "video_url": null,
      "show_on": "all",
      "frequency": "until_dismissed"
    }
  ]
}
```

Only return active announcements
where current date is between 
start_date and end_date.

---

## SDK Changes

### sdk/src/announcements.js (new file)

New module handles:
- Rendering modal/banner/slide-in
- Checking frequency (localStorage)
- Tracking view/click/dismiss events
- URL matching for show_on rules

### localStorage keys
tourkit_ann_ANNOUNCEMENT_ID = "dismissed"
tourkit_ann_ANNOUNCEMENT_ID = "seen"

### Announcement rendering

Modal:Fixed overlay + centered card
Close button top right
Image/video at top (if provided)
Title + description
CTA button

Banner:
Fixed top of page
Full width
Title + CTA button inline
Close button right side
Pushes page content down

Slide-in:
Fixed bottom right
Card style matching tooltip
Slides in from right
Title + description + CTA
Close button

---

## Dashboard Changes

### New sidebar link
- Announcements → /dashboard/announcements

### Announcements list page
- /dashboard/announcements
- Shows all announcements per project
- Status: Active / Scheduled / Expired / Draft
- Quick stats: views, clicks, CTR

### Create/Edit announcement
- /dashboard/announcements/new
- /dashboard/announcements/[id]
- Full form with all fields
- Live preview of modal/banner/slide-in
- Schedule picker

### Analytics per announcement
- Views over time chart
- CTR percentage
- Dismissal rate

---

## Pricing

| Feature | Free | Starter | Pro |
|---------|------|---------|-----|
| Announcements | ❌ | 2 active | Unlimited |
| Modal type | ❌ | ✅ | ✅ |
| Banner type | ❌ | ✅ | ✅ |
| Slide-in type | ❌ | ❌ | ✅ |
| Image support | ❌ | ✅ | ✅ |
| Video support | ❌ | ❌ | ✅ |
| Analytics | ❌ | Basic | Full |
| Scheduling | ❌ | ✅ | ✅ |

---

## V5 Launch Scope (keep it simple)

### Build:
✅ Modal type only
✅ Title + description + CTA
✅ Image support
✅ Start/end date scheduling
✅ Once per user frequency
✅ Until dismissed frequency
✅ All pages display rule
✅ Views + clicks analytics
✅ Dashboard CRUD

### Skip for V6:
❌ Banner type
❌ Slide-in type
❌ Video support
❌ User segmentation
❌ Specific page targeting
❌ Advanced analytics

---

## Marketing angle
"One script tag for tours AND announcements.
Stop paying for Intercom just to show
a popup to your users."

---

## Implementation estimate

| Part | Time |
|------|------|
| Database schema | 30 min |
| API changes | 1 hour |
| Dashboard CRUD | 4 hours |
| SDK announcements module | 3 hours |
| Analytics | 2 hours |
| Testing | 2 hours |
| Total | ~2 days |

---

## Priority: V5
## Status: Planned
## Depends on: V4 complete + paying customers

this are the updates i have to add on V5 