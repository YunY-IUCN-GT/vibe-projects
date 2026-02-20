'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, MessageSquare, MailWarning, Clock } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalInquiries: number
  unreadInquiries: number
  lastLogin: string
}

interface Inquiry {
  id: string
  name: string
  email: string
  subject: string
  status: string
  created_at: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    lastLogin: '—',
  })
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    // Fetch stats
    const [usersRes, inquiriesRes, unreadRes] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    ])

    // Fetch recent inquiries
    const { data: recent } = await supabase
      .from('contact_inquiries')
      .select('id, name, email, subject, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    setStats({
      totalUsers: usersRes.count ?? 0,
      totalInquiries: inquiriesRes.count ?? 0,
      unreadInquiries: unreadRes.count ?? 0,
      lastLogin: session?.user?.last_sign_in_at
        ? new Date(session.user.last_sign_in_at).toLocaleDateString('ko-KR')
        : '—',
    })

    setRecentInquiries(recent ?? [])
  }

  const statCards = [
    { label: '총 사용자', value: stats.totalUsers, icon: Users, color: '#6366f1' },
    { label: '총 문의', value: stats.totalInquiries, icon: MessageSquare, color: '#10b981' },
    { label: '미읽은 문의', value: stats.unreadInquiries, icon: MailWarning, color: '#f59e0b' },
    { label: '마지막 로그인', value: stats.lastLogin, icon: Clock, color: '#8b5cf6' },
  ]

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      unread: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800',
    }
    const labels: Record<string, string> = {
      unread: '미읽음',
      read: '읽음',
      replied: '답변완료',
    }
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-slate-100 text-slate-800'}`}>
        {labels[status] ?? status}
      </span>
    )
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="mb-8 text-sm text-slate-500">관리자 대시보드 개요</p>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Inquiries */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">최근 문의</h2>
        {recentInquiries.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">아직 문의가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">이름</th>
                  <th className="pb-3 pr-4">이메일</th>
                  <th className="pb-3 pr-4">제목</th>
                  <th className="pb-3 pr-4">상태</th>
                  <th className="pb-3">날짜</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium text-slate-700">{inquiry.name}</td>
                    <td className="py-3 pr-4 text-slate-500">{inquiry.email}</td>
                    <td className="py-3 pr-4 text-slate-700">{inquiry.subject}</td>
                    <td className="py-3 pr-4">{statusBadge(inquiry.status)}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
