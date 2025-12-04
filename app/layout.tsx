import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sora-2 AI Video Generator",
  description: "Generate stunning videos from text prompts using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
