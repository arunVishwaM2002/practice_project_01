import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Mail } from 'lucide-react'
import { AuthDivider, AuthLayout, AuthNotice, GoogleButton } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { PasswordField, TextField } from '@/components/ui/TextField'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function LoginPage() {
  useDocumentTitle('Login | CineBook')
  const [notice, setNotice] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setNotice(true)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to book faster, manage your tickets and unlock member offers."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-white underline-offset-4 hover:text-brand-300 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <TextField
          label="Email / Mobile"
          name="identifier"
          icon={Mail}
          placeholder="you@example.com or 98765 43210"
          autoComplete="username"
          required
        />
        <PasswordField
          label="Password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          labelAction={
            <button
              type="button"
              onClick={() => setNotice(true)}
              className="text-xs font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Forgot password?
            </button>
          }
        />
        <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
          <input type="checkbox" name="remember" className="size-4 rounded accent-brand-600" />
          Keep me signed in
        </label>
        <Button type="submit" size="lg" fullWidth>
          Login
        </Button>
      </form>
      <AuthDivider />
      <GoogleButton onClick={() => setNotice(true)} />
      {notice && <AuthNotice />}
    </AuthLayout>
  )
}
