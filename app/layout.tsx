import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavHeader from "@/components/nav-header";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "API Server Event Log",
  description: "API Server Event Log",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="w-screen h-screen flex flex-col">
          <NavHeader />
          <div className="max-h-[calc(100vh-60px)] flex-1 flex">
            <Sidebar />
            <div className="flex-1 p-4 overflow-y-auto">
              {children}
            </div>
          </div>
          {/* <main className="flex-1 flex">
            <Sidebar />
            <div className="flex-1 p-4">
              {children}
            </div>
          </main> */}
        </div>
      </body>
    </html>
  );
}
