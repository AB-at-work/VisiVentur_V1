import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-800 bg-black">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <div>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            VisiVentur
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/help"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Help
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-gray-400 shadow-sm transition-colors hover:border-gray-700 hover:text-white"
          >
            Currency
            <span aria-hidden="true" className="text-xs leading-none text-gray-500">
              v
            </span>
          </button>
          <Link
            href="/signin"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-400"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
