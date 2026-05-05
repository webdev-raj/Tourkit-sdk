import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const generalSans = localFont({
  src: "./fonts/GeneralSans-Regular.otf",
  variable: "--font-general-sans",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "TourKit",
  description: "Automatic onboarding tours for any website.",
};

/** Matches canvas background for browser chrome / PWA (Web Interface Guidelines) */
export const viewport = {
  themeColor: "#070707",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${generalSans.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
