import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solarize Socials AI - Social Media Automation Platform",
  description: "AI-powered social media automation with content generation, scheduling, and A/B testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
