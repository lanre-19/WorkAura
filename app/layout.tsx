import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/query-provider";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "WorkAura",
  description: "Manage tasks and projects effectively, and reach productivity peaks with your teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased min-h-screen")}
      >
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
