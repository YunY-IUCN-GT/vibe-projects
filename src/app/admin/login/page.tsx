'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        const msg = authError.message
        if (msg.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else if (msg.includes('rate limit')) {
          setError('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
        } else {
          setError(msg)
        }
        setLoading(false)
        return
      }

      // admin role 확인
      const userRole = data.user?.app_metadata?.role
      if (userRole !== 'admin') {
        await supabase.auth.signOut()
        setError('관리자 권한이 없습니다.')
        setLoading(false)
        return
      }

      router.push('/admin')
    } catch {
      setError('로그인 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f6f6f7' }}>
      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: '#1a1a2e' }} />

        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2 items-center text-center">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
              style={{ backgroundColor: 'rgba(26,26,46,0.1)' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a2e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1a1a2e' }}>
              Admin Portal
            </h1>
            <p className="text-sm font-normal text-slate-500">
              Sign in to manage your content and settings
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-sm font-medium" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400 group-focus-within:text-[#1a1a2e] transition-colors"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-700 text-sm font-medium" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400 group-focus-within:text-[#1a1a2e] transition-colors"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] focus:outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" x2="23" y1="1" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-medium hover:underline underline-offset-4 transition-colors"
                style={{ color: '#1a1a2e' }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#1a1a2e' }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = 'rgba(26,26,46,0.9)')}
              onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#1a1a2e')}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 pt-6 border-t border-slate-100 text-center flex flex-col gap-2">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <a
                href="/admin/signup"
                className="font-medium hover:underline transition-colors"
                style={{ color: '#1a1a2e' }}
              >
                Sign up
              </a>
            </p>
            <p className="text-xs text-slate-500">
              Having trouble?{' '}
              <a
                href="#"
                className="font-medium hover:underline transition-colors"
                style={{ color: '#1a1a2e' }}
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
