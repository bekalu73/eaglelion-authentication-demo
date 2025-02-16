import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/Provider/ReactQuery/providers";

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
