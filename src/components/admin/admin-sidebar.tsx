'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col" style={{ backgroundColor: '#1a1a2e' }}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">Admin Portal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; Back to site
        </Link>
      </div>
    </aside>
  )
}
