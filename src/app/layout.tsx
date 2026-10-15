import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  weight: ["200", "400", "500"],
  subsets: ["latin"],
});

const rubik = Rubik({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-rubik",
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
      className={`antialiased bg-white text-black ${inter.className} ${rubik.variable}`}
    >
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
