'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  display_name: string | null
  role: string
  created_at: string
  last_sign_in_at: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc('get_admin_users')

    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
    }
  }

  const roleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-slate-100 text-slate-800',
    }
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[role] ?? 'bg-slate-100 text-slate-800'}`}>
        {role}
      </span>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">사용자 관리</h1>
        <p className="text-sm text-slate-500">등록된 사용자를 확인하고 역할을 관리하세요</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            로딩 중...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Users className="mb-3 h-8 w-8" />
            <p className="text-sm">등록된 사용자가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">이름</th>
                  <th className="px-6 py-4">이메일</th>
                  <th className="px-6 py-4">역할</th>
                  <th className="px-6 py-4">가입일</th>
                  <th className="px-6 py-4">마지막 로그인</th>
                  <th className="px-6 py-4">작업</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {user.display_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString('ko-KR')
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
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
