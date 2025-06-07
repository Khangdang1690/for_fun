import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gmail AI Assistant - Automate Your Email with AI",
  description: "Boost your productivity with an AI assistant that understands your email needs. Manage your inbox, compose emails, and automate tasks with natural language.",
  keywords: ["Gmail", "AI", "Email", "Automation", "Productivity", "Assistant"],
  authors: [{ name: "Gmail AI Team" }],
  viewport: "width=device-width, initial-scale=1",
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
