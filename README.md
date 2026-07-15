# TourKit SDK

> Vanilla JS SDK for TourKit product tours.
> One script tag. Works on any website.
> No npm install. No framework lock-in.

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit-sdk@v1.0.0-sdk/sdk/dist/tourkit.min.js)
[![Dashboard](https://img.shields.io/badge/Dashboard-Live-orange)](https://tourkit-phi.vercel.app)
[![Demo](https://img.shields.io/badge/Live-Demo-orange)](https://tourkit-phi.vercel.app/demo)

---

## What is TourKit?

TourKit lets you add guided onboarding 
tours to any website from a dashboard.

You define tour steps in the dashboard.
This SDK fetches them and renders tooltips
on your website automatically.

No redeployment needed when you update tours.

---

## Quick Start

### Option 1 — Script tag (recommended)

Paste before </body> on any website:

```html
<script
  src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit-sdk@v1.0.0-sdk/sdk/dist/tourkit.min.js"
  data-key="YOUR_SCRIPT_KEY"
  data-api="https://tourkit-phi.vercel.app"
  async>
</script>
```

Get your script key at tourkit-phi.vercel.app

### Option 2 — Self hosted

Download `dist/tourkit.min.js` and host it yourself:

```html
<script
  src="/path/to/tourkit.min.js"
  data-key="YOUR_SCRIPT_KEY"
  data-api="https://tourkit-phi.vercel.app"
  async>
</script>
```

---

## Framework Support

### React / Next.js

Add TourKitProvider for client-side 
navigation support:

```jsx
'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function TourKitProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      window.TourKit?.startFor(pathname)
    }, 500)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

// Add to your root layout.js:
// <TourKitProvider />
```

### React Router

```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function TourKitProvider() {
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      window.TourKit?.startFor(location.pathname)
    }, 500)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return null
}

// Add to your App.jsx:
// <TourKitProvider />
```

### Vue

```js
// In your router/index.js
router.afterEach((to) => {
  setTimeout(() => {
    window.TourKit?.startFor(to.path)
  }, 500)
})
```

### Plain HTML

```html
<!-- Just paste before </body> -->
<script
  src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit-sdk@v1.0.0-sdk/sdk/dist/tourkit.min.js"
  data-key="YOUR_SCRIPT_KEY"
  data-api="https://tourkit-phi.vercel.app"
  async>
</script>
```

---

## Global API

After the script loads, control tours 
from anywhere in your code:

```js
// Start tour for current page
window.TourKit.startFor('/dashboard')

// Start from beginning
window.TourKit.start()

// Destroy active tour
window.TourKit.destroy()

// Reset seen flag for a path
window.TourKit.reset('/dashboard')

// Reset all seen flags
window.TourKit.resetAll()
```

---

## How It Works
Your website loads the SDK script
↓
SDK reads data-key from script tag
↓
Fetches tour config from TourKit API
↓
Matches steps to current URL path
↓
Renders tooltips on matching elements
↓
Tracks analytics automatically

---

## URL-Based Triggers

Each tour step can target a specific page:
/dashboard          → exact match
/dashboard/projects → exact match
/projects/[id]      → dynamic segment
/dashboard/*        → wildcard
null                → shows on all pages

Steps only appear on their matching page.
Tours feel contextual not generic.

---

## Mobile Support

TourKit automatically switches to 
bottom sheet mode on mobile (under 768px):
Desktop → tooltip beside element
Mobile  → element highlighted at top
tooltip slides up from bottom
feels completely native

No config needed. Detects screen size automatically.

---

## Script Tag Options

| Attribute | Required | Description |
|-----------|----------|-------------|
| data-key | ✅ Yes | Your project script key |
| data-api | ✅ Yes | TourKit API URL |
| data-demo | ❌ No | Set true for demo mode |

---

## Building from Source

```bash
git clone https://github.com/webdev-raj/Tourkit-sdk.git
cd Tourkit-sdk
npm install
npm run build
```

Output: `dist/tourkit.min.js`

---

## Get Your Script Key

1. Sign up at tourkit-phi.vercel.app
2. Create a project
3. Copy your script key
4. Paste into the script tag

Free plan available. No credit card required.

---

## Dashboard

Build and manage your tours at:
tourkit-phi.vercel.app

- Visual step editor
- CSS selector targeting
- URL-based triggers
- Analytics dashboard
- AI tour generator
- Prebuilt templates

---

## Contributing

Pull requests welcome!

This repo contains only the SDK source.
The dashboard is private and separate.

---

## License

MIT © Raj Chavan

---

## Links

- Dashboard: https://tourkit-phi.vercel.app
- Docs: https://tourkit-phi.vercel.app/docs
- Main repo: private
