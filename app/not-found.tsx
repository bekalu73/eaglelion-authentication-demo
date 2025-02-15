export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-2">Oops! Page not found.</p>
      <a
        href="/login"
        className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  );
}
