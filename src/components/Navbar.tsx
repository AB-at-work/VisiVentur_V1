import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            VisiVentur
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            ₹ / $ / € / £
          </button>
          <Link
            href="/help"
            aria-label="Help"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-base font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            ?
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
