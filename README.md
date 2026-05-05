# TourKit 🚀

Onboarding tours for any website — one script tag, zero config. TourKit lets you create guided onboarding tours for any website from a simple dashboard. Add steps, configure messages, and your visitors get a smooth walkthrough automatically.

## ✨ Features

- **Interactive Tour Builder**: Create and manage product tours visually from a dedicated dashboard.
- **Lightweight Embeddable SDK**: A vanilla JS script that renders tours over any website.
- **Smart Element Detection**: Intelligently identifies DOM elements for attaching tour tooltips.
- **Authentication & Backend**: Secure user authentication and data management powered by Supabase.
- **Modern Dashboard**: A highly responsive, beautifully designed user interface utilizing Shadcn UI and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19, Radix UI, Shadcn UI
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase
- **SDK Bundler:** ESBuild

## 📂 Project Structure

- `/app` - Next.js App Router (Pages, API routes, Layouts)
- `/components` - Reusable UI components (Marketing & Dashboard)
- `/sdk` - Source code for the embeddable vanilla JS SDK (`tourkit.min.js`)
- `/lib` - Utility functions and Supabase clients
- `/hooks` - Custom React hooks for application logic

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm/bun) installed.

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and configure your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Next.js App

Start the development server for the dashboard and API:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build the SDK

If you modify the SDK located in `sdk/src`, you must rebuild it so that the updated script is available in `sdk/dist`.

Navigate to the `sdk` directory and run:

```bash
cd sdk
npm install
npm run build
```

This uses ESBuild to bundle and minify the SDK into `sdk/dist/tourkit.min.js`.
