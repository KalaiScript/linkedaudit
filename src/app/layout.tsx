import type { Metadata } from "next";
import "./globals.css";
import AIChatbot from "@/components/layout/AIChatbot";

export const metadata: Metadata = {
  title: "LinkHive — AI-Powered LinkedIn Profile Analyzer",
  description: "Turn your LinkedIn into a recruiter magnet. Get AI-powered profile analysis, scoring, content rewriting, and career optimization tips.",
  keywords: ["LinkedIn", "profile audit", "AI analyzer", "recruiter", "career", "personal branding"],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" />
        <div className="page-content">
          {children}
        </div>
        <AIChatbot />
      </body>
    </html>
  );
}
