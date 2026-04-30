import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glommadyppen 2026",
  description:
    "Vannforhold for Glommadyppen – svøm fra Sørumsand til Fetsund 1. august 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className="min-h-screen bg-sky-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
