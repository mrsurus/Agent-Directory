const PALETTE = [
  'bg-brand-100 text-brand-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
]

function colorFor(name = '') {
  const idx = name.charCodeAt(0) % PALETTE.length
  return PALETTE[Number.isNaN(idx) ? 0 : idx]
}

export default function InitialsAvatar({ name = '?', size = 'md' }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  const sizeClasses = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-10 h-10 text-sm'

  return (
    <div
      className={`shrink-0 grid place-items-center rounded-full font-bold ${colorFor(
        name
      )} ${sizeClasses}`}
    >
      {initials || '?'}
    </div>
  )
}
