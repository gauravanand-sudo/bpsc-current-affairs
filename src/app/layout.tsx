import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import ExamCountdown from "@/components/ExamCountdown";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import SupportButton from "@/components/SupportButton";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const viewport: Viewport = {
  themeColor: "#b86117",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BPSC 365 — Bihar Current Affairs",
  description:
    "Daily current affairs with static prelims linkages and Bihar focus for BPSC aspirants.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BPSC 365",
  },
  openGraph: {
    title: "BPSC 365 — Bihar Current Affairs",
    description: "One card = current affair + static facts + Bihar angle + MCQ. Free, always.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="sw-register-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ServiceWorkerRegistrar />
        <Nav />
        <ExamCountdown />
        <SupportButton />
        <div style={{ flex: 1 }}>{children}</div>
        <footer
          style={{
            borderTop: "1px solid rgba(120, 80, 30, 0.12)",
            padding: "16px 20px 22px",
            textAlign: "center",
            background: "rgba(255, 253, 248, 0.72)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#8a7260",
              lineHeight: 1.6,
            }}
          >
            Made with <span style={{ color: "#dc2626" }}>♥</span> for Bihar Students
          </p>
        </footer>
      </body>
    </html>
  );
}
