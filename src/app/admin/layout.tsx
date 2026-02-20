'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { LogOut } from 'lucide-react'

const publicPaths = ['/admin/login', '/admin/signup']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isPublicPath = publicPaths.includes(pathname)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && !isPublicPath) {
        router.replace('/admin/login')
        return
      }
      setUser(session?.user ?? null)
      setLoading(false)
    }
    checkAuth()
  }, [router, isPublicPath])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  // Public pages (login, signup) render without sidebar
  if (isPublicPath) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#f6f6f7' }}>
        <div className="text-sm text-slate-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f7' }}>
      <AdminSidebar />

      {/* Main content area */}
      <div className="ml-64">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  )
}
