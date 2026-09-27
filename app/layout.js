import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'Agent Directory',
  description: 'Browse and search agents',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-600 text-white font-bold shadow-sm group-hover:bg-brand-700 transition-colors">
                A
              </span>
              <span className="text-lg font-bold text-slate-800 tracking-tight">
                Agent Directory
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-sm text-slate-400 text-center">
            Agent Directory — read-only view
          </div>
        </footer>
      </body>
    </html>
  )
}
