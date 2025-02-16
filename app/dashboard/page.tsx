"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Dashboard() {
  const router = useRouter();

  // Check if the user is logged in (has loginToken)
  useEffect(() => {
    const loginToken = Cookies.get("loginToken");
    if (!loginToken) {
      router.push("/otp-request");
    }
  }, [router]);

  // Handle logout
  const handleLogout = () => {
    Cookies.remove("loginToken");
    router.push("/otp-request");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4 rounded-lg mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Total Users</h2>
            <p className="text-3xl font-bold text-blue-900">1,234</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Revenue</h2>
            <p className="text-3xl font-bold text-green-600">$12,345</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
            <p className="text-3xl font-bold text-purple-600">15</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Monthly Performance</h2>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graph Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
