import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Mail, Phone, User } from 'lucide-react'
import { AuthDivider, AuthLayout, AuthNotice, GoogleButton } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { PasswordField, TextField } from '@/components/ui/TextField'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function SignupPage() {
  useDocumentTitle('Create account | CineBook')
  const [notice, setNotice] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setNotice(true)
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join CineBook to save your favourite cinemas and get offers on every booking."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-white underline-offset-4 hover:text-brand-300 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <TextField label="Full name" name="name" icon={User} placeholder="Your name" autoComplete="name" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <TextField
            label="Mobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            icon={Phone}
            placeholder="98765 43210"
            autoComplete="tel-national"
            required
          />
        </div>
        <PasswordField
          label="Password"
          name="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-zinc-400">
          <input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 rounded accent-brand-600" />
          <span>I agree to the Terms of Use and Privacy Policy.</span>
        </label>
        <Button type="submit" size="lg" fullWidth>
          Create account
        </Button>
      </form>
      <AuthDivider />
      <GoogleButton onClick={() => setNotice(true)} />
      {notice && <AuthNotice />}
    </AuthLayout>
  )
}
