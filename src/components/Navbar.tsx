import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <div>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            VisiVentur
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
          <Link
            href="/help"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Help
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            Currency
            <span aria-hidden="true" className="text-xs leading-none text-slate-400">
              v
            </span>
          </button>
          <Link
            href="/signin"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
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
