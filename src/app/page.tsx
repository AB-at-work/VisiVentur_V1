'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Welcome to VisiVentur</h1>
        
        <div className="space-y-8">
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Features</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>✨ Responsive Navbar with mobile menu</li>
              <li>💱 Currency selector with persistence</li>
              <li>🎨 Multiple theme modes (light, dark, premium)</li>
              <li>🔐 Authentication states (guest vs authenticated)</li>
              <li>📱 Mobile-first design</li>
              <li>♿ Accessibility compliant (WCAG AA)</li>
              <li>📊 Analytics integration</li>
              <li>🧪 Comprehensive testing</li>
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Test the Navbar</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try out the navbar features above:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Click the logo to navigate home</li>
              <li>• Use the currency selector to change currencies</li>
              <li>• Click the help button to open the help modal</li>
              <li>• On mobile, try the hamburger menu</li>
              <li>• Test keyboard navigation with Tab key</li>
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Theme Testing</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The navbar supports multiple themes. Open browser dev tools and try changing the data-theme attribute:
            </p>
            <div className="space-y-2 font-mono text-sm">
              <button 
                onClick={() => document.documentElement.setAttribute('data-theme', 'light')}
                className="block w-full text-left px-3 py-2 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                data-theme="light"
              </button>
              <button 
                onClick={() => document.documentElement.setAttribute('data-theme', 'dark')}
                className="block w-full text-left px-3 py-2 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                data-theme="dark"
              </button>
              <button 
                onClick={() => document.documentElement.setAttribute('data-theme', 'premium')}
                className="block w-full text-left px-3 py-2 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                data-theme="premium"
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Scroll Test</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Scroll down to see the navbar backdrop blur effect in action. The navbar should become slightly transparent with a blur effect when scrolled.
            </p>
          </section>

          {/* Extra content for scrolling */}
          <div className="h-screen flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Keep scrolling to see the navbar effect...</p>
          </div>
        </div>
      </div>
    </div>
  );
}