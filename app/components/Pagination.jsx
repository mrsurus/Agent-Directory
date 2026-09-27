export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>

      <span className="text-sm font-medium text-slate-500">
        Page <span className="text-slate-800 font-bold">{currentPage}</span> of{' '}
        <span className="text-slate-800 font-bold">{totalPages}</span>
      </span>

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  )
}
