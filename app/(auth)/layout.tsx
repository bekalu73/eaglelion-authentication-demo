import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100 px-20 py-10 shadow">
          {/* Left Side */}
          <div className="hidden lg:flex flex-col w-1/2 text-white items-center justify-center p-8 relative bg-[#1B216C] rounded-bl-lg rounded-tl-lg">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-5"
              style={{
                backgroundImage: "url('/pattern/background-pattern.png')",
              }}
            ></div>

            {/* Content on top of the background */}
            <div className="relative z-10 text-center">
              <p className="text-lg">Welcome to</p>
              <h2 className="text-2xl font-bold">Dashen Super App Dashboard</h2>
            </div>
          </div>
          {/* Right Side */}
          {children}
        </div>
      </body>
    </html>
  );
}
