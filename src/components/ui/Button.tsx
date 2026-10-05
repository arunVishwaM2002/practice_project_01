import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'light' | 'card'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

// Never pass display utilities (hidden, flex…) through className — they would
// fight `inline-flex` below. Wrap the button in an element instead.
const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,box-shadow,color,transform] duration-200 ease-out active:scale-[0.98] ' +
  'disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[1.15em] [&_svg]:shrink-0'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[0_8px_24px_-10px_rgb(224_18_58/0.8)] hover:bg-brand-500 hover:shadow-[0_12px_32px_-10px_rgb(244_51_87/0.9)]',
  secondary: 'bg-white/10 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md hover:bg-white/[0.16]',
  outline: 'text-zinc-100 ring-1 ring-inset ring-white/15 hover:bg-white/[0.06] hover:ring-white/30',
  ghost: 'text-zinc-300 hover:bg-white/[0.06] hover:text-white',
  light: 'bg-white text-ink-950 hover:bg-zinc-200',
  // Turns crimson when the surrounding `.group` card is hovered
  card: 'bg-white/[0.06] text-zinc-100 ring-1 ring-inset ring-white/10 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-transparent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px] sm:h-[52px] sm:px-7',
}

function buttonClasses({ variant = 'primary', size = 'md', fullWidth }: ButtonStyleProps = {}, className?: string) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)
}

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, fullWidth, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, fullWidth }, className)} {...props} />
}

type ButtonLinkProps = ButtonStyleProps & LinkProps

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, fullWidth }, className as string | undefined)} {...props} />
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export function IconButton({ label, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-colors duration-200 hover:bg-white/10 hover:text-white [&_svg]:size-5',
        className,
      )}
      {...props}
    />
  )
}
