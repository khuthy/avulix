import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avulix ISAMS — School Operating System for South Africa",
  description:
    "Avulix connects school administration, learning support, finance, and parent engagement in one secure, affordable platform. Built for South African schools by Danho Systems.",
  keywords: ["school management", "ISAMS", "South Africa", "education", "Avulix", "Danho Systems"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable} style={{ scrollBehavior: "smooth" }}>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
