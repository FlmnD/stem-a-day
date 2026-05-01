import Navbar from "@/components/navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Script from "next/script";
export const metadata: Metadata = {
  title: "STEM a Day",
  description: "Learn STEM with daily byte-sized lessons",
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const themeInit = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var shouldDark = stored === "dark";
    document.documentElement.classList.toggle("dark", shouldDark);
  } catch {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          bg-white text-gray-900
          dark:bg-black dark:text-gray-100`}
      >
        <Navbar />
        {children}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </body>
    </html>
  );
}
