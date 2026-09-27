export default function Section({ title, icon, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 ${className}`}
    >
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">
        {icon && <span className="text-base">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  )
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right">
        {value === undefined || value === null || value === '' ? '—' : String(value)}
      </span>
    </div>
  )
}

export function Chip({ children }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
      {children}
    </span>
  )
}
