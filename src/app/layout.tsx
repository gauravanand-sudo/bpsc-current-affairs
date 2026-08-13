import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import SiteFooter from "@/components/SiteFooter";
import SupportButton from "@/components/SupportButton";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({ variable: "--font-body", subsets: ["latin"] });
const displayFont = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700"] });

export const viewport: Viewport = { themeColor: "#172338", width: "device-width", initialScale: 1, maximumScale: 1 };

export const metadata: Metadata = {
  title: "OneShot GS — UPSC 2027 & 73rd BPSC Coaching",
  description: "OneShot GS offers two complete end-to-end programs: UPSC CSE 2027 and 73rd BPSC, covering Foundation, Prelims, Mains and Interview with faculty teaching, PYQs, tests, answer writing, evaluation and mentoring.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "OneShot GS" },
  openGraph: {
    title: "OneShot GS — Complete UPSC / BPSC Coaching",
    description: "UPSC 2027 and 73rd BPSC preparation from Foundation to Interview, plus on-site PYQ study, demo class, Free Study, Free Quiz and student support.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`} crossOrigin="anonymous" strategy="afterInteractive" />
        )}
        <Script id="sw-register-inline" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); }); }` }} />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ServiceWorkerRegistrar />
        <Nav />
        <SupportButton />
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
