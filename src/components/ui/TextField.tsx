import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff, Lock, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  trailing?: ReactNode
  labelAction?: ReactNode
}

export function TextField({ label, icon: Icon, trailing, labelAction, id, className, ...props }: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="flex h-12 items-center gap-3 rounded-xl bg-white/[0.04] px-4 ring-1 ring-inset ring-white/10 transition duration-200 focus-within:bg-white/[0.06] focus-within:ring-brand-500/70 hover:ring-white/20">
        {Icon && <Icon className="size-[18px] shrink-0 text-zinc-500" aria-hidden />}
        <input
          id={inputId}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-zinc-500"
          {...props}
        />
        {trailing}
      </div>
    </div>
  )
}

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing' | 'icon'>

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      icon={Lock}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className={cn('-mr-2 grid size-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:text-white')}
        >
          {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      }
    />
  )
}
