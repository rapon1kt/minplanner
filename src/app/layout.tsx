import type { Metadata } from "next";
import { Barlow, Space_Grotesk } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  weight: ["100", "200", "400", "500"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

const space = Space_Grotesk({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "MinPlanner",
  description: "Organize your day with MinPlanner!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`antialiased font-sans ${barlow.variable} ${space.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
