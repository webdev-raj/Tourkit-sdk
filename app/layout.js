import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next"

const generalSans = localFont({
  src: "./fonts/GeneralSans-Regular.otf",
  variable: "--font-general-sans",
  weight: "400",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://tourkit-phi.vercel.app'),

  title: {
    default: 'TourKit — Product Tours for Any Website',
    template: '%s | TourKit'
  },

  description: 'Lightweight product tour SDK. One script tag, dashboard-controlled tours, works on React, Next.js, Vue, and plain HTML. No npm install required.',

  keywords: [
    'product tour',
    'onboarding tour',
    'user onboarding',
    'product walkthrough',
    'onboarding SDK',
    'interactive guide',
    'React onboarding',
    'Next.js tour',
    'Intercom alternative',
    'Shepherd.js alternative',
    'lightweight tour SDK',
    'no code onboarding'
  ],

  authors: [{ name: 'TourKit' }],
  creator: 'TourKit',
  publisher: 'TourKit',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tourkit-phi.vercel.app',
    siteName: 'TourKit',
    title: 'TourKit — Product Tours for Any Website',
    description: 'One script tag. Dashboard-controlled tours. Works on any stack without npm install.',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'TourKit Logo',
      }
    ],
  },

  twitter: {
    card: 'summary',
    title: 'TourKit — Product Tours for Any Website',
    description: 'One script tag. Dashboard-controlled tours. Works on any stack without npm install.',
    images: ['/android-chrome-512x512.png'],
    creator: '@Raj_Chavan524',
  },

  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon2.ico' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest'
      }
    ]
  },

  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

/** Matches canvas background for browser chrome / PWA (Web Interface Guidelines) */
export const viewport = {
  themeColor: "#070707",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${generalSans.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TourKit",
              "applicationCategory": "DeveloperApplication",
              "description": "Lightweight product tour SDK. One script tag, dashboard-controlled tours, works on any stack.",
              "url": "https://tourkit-phi.vercel.app",
              "logo": "https://tourkit-phi.vercel.app/android-chrome-512x512.png",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free plan available"
              },
              "operatingSystem": "Any",
              "applicationSubCategory": "OnboardingTool"
            })
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
