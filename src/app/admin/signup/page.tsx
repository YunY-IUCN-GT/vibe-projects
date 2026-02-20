'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminSignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    if (!agreed) {
      setError('이용약관에 동의해주세요.')
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      const msg = signUpError.message
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('이미 가입된 이메일입니다.')
      } else if (msg.includes('rate limit') || msg.includes('email rate')) {
        setError('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
      } else if (msg.includes('invalid email') || msg.includes('Invalid email')) {
        setError('올바른 이메일 형식이 아닙니다.')
      } else if (msg.includes('Password should be')) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.')
      } else if (msg.includes('Signup is disabled')) {
        setError('현재 회원가입이 비활성화되어 있습니다.')
      } else {
        setError(msg)
      }
      setLoading(false)
      return
    }

    router.push('/admin/login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4" style={{ backgroundColor: '#f6f6f7' }}>
      {/* Signup Card */}
      <div className="w-full max-w-[480px] bg-white shadow-lg rounded-lg border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-6 px-10">
          <div className="flex items-center gap-2 mb-6" style={{ color: '#1a1a2e' }}>
            <div
              className="size-8 flex items-center justify-center rounded-lg p-1.5"
              style={{ backgroundColor: 'rgba(26,26,46,0.1)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin</h1>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Create an account</h2>
          <p className="text-slate-500 text-sm text-center">Start managing your dashboard content today.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-10 pb-10">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Full Name */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Full Name</span>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors text-sm"
              style={{ borderColor: undefined }}
              onFocus={(e) => (e.target.style.borderColor = '#1a1a2e')}
              onBlur={(e) => (e.target.style.borderColor = '')}
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Email Address</span>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors text-sm"
              onFocus={(e) => (e.target.style.borderColor = '#1a1a2e')}
              onBlur={(e) => (e.target.style.borderColor = '')}
            />
          </label>

          {/* Password */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-4 pr-12 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors text-sm"
                onFocus={(e) => (e.target.style.borderColor = '#1a1a2e')}
                onBlur={(e) => (e.target.style.borderColor = '')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" x2="23" y1="1" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {/* Confirm Password */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Confirm Password</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-4 pr-12 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors text-sm"
                onFocus={(e) => (e.target.style.borderColor = '#1a1a2e')}
                onBlur={(e) => (e.target.style.borderColor = '')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" x2="23" y1="1" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-3 mt-1">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-slate-300"
            />
            <label htmlFor="terms" className="cursor-pointer text-sm text-slate-600 select-none">
              I agree to the{' '}
              <a href="#" className="font-medium hover:underline" style={{ color: '#1a1a2e' }}>
                Terms of Service
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-12 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1a1a2e' }}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          {/* Sign In Link */}
          <div className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <a
              href="/admin/login"
              className="font-medium hover:underline ml-1"
              style={{ color: '#1a1a2e' }}
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
