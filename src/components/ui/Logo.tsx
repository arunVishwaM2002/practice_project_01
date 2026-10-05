import { useId } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn'

export function LogoMark({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4d6d" />
          <stop offset="1" stopColor="#b30a2c" />
        </linearGradient>
        <mask id={`${uid}-m`}>
          <rect width="32" height="32" fill="#fff" />
          <circle cx="0" cy="16" r="3.5" fill="#000" />
          <circle cx="32" cy="16" r="3.5" fill="#000" />
        </mask>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${uid}-g)`} mask={`url(#${uid}-m)`} />
      <path
        d="M12.75 10.6v10.8a.9.9 0 0 0 1.37.77l8.64-5.4a.9.9 0 0 0 0-1.54l-8.64-5.4a.9.9 0 0 0-1.37.77z"
        fill="#fff"
      />
    </svg>
  )
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="CineBook home"
      className={cn('group inline-flex shrink-0 items-center gap-2.5 rounded-lg', className)}
    >
      <LogoMark className="size-8 transition-transform duration-300 group-hover:scale-105" />
      <span className="font-display text-[19px] font-semibold tracking-tight text-white">CineBook</span>
    </Link>
  )
}
