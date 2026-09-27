export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
      <div className="h-9 w-9 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
