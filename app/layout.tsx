import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/components/providers"; 



export const metadata: Metadata = {
  title: "Next Auth",
  description: "Next Authentication for test project",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers> 
      </body>
    </html>
  );
}
