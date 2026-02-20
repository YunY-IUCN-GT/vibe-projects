'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, MessageSquare } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface Inquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  admin_note: string | null
  created_at: string
}

type FilterStatus = 'all' | 'unread' | 'read' | 'replied'

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchInquiries()
  }, [filter])

  const fetchInquiries = async () => {
    let query = supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setInquiries(data ?? [])
  }

  const openDetail = (inquiry: Inquiry) => {
    setSelected(inquiry)
    setAdminNote(inquiry.admin_note ?? '')
    setSheetOpen(true)

    // Mark as read if unread
    if (inquiry.status === 'unread') {
      updateStatus(inquiry.id, 'read')
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_inquiries').update({ status }).eq('id', id)
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    )
    if (selected?.id === id) {
      setSelected((prev) => prev ? { ...prev, status } : null)
    }
  }

  const saveNote = async () => {
    if (!selected) return
    setSaving(true)
    await supabase
      .from('contact_inquiries')
      .update({ admin_note: adminNote })
      .eq('id', selected.id)
    setSelected((prev) => prev ? { ...prev, admin_note: adminNote } : null)
    setSaving(false)
  }

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

  const filters: { label: string; value: FilterStatus }[] = [
    { label: '전체', value: 'all' },
    { label: '미읽음', value: 'unread' },
    { label: '읽음', value: 'read' },
    { label: '답변완료', value: 'replied' },
  ]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-slate-800">문의 관리</h1>
          <p className="text-sm text-slate-500">접수된 문의를 확인하고 관리하세요</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
            style={filter === f.value ? { backgroundColor: '#1a1a2e' } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inquiries Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <MessageSquare className="mb-3 h-8 w-8" />
            <p className="text-sm">문의가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">이름</th>
                  <th className="px-6 py-4">이메일</th>
                  <th className="px-6 py-4">제목</th>
                  <th className="px-6 py-4">상태</th>
                  <th className="px-6 py-4">날짜</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => openDetail(inquiry)}
                    className="cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">{inquiry.name}</td>
                    <td className="px-6 py-4 text-slate-500">{inquiry.email}</td>
                    <td className="px-6 py-4 text-slate-700">{inquiry.subject}</td>
                    <td className="px-6 py-4">{statusBadge(inquiry.status)}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>문의 상세</SheetTitle>
            <SheetDescription>문의 내용을 확인하고 상태를 관리하세요</SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="mt-6 space-y-6 px-4">
              {/* Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">이름</p>
                  <p className="text-sm text-slate-800">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">이메일</p>
                  <p className="text-sm text-slate-800">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">제목</p>
                  <p className="text-sm text-slate-800">{selected.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">날짜</p>
                  <p className="text-sm text-slate-800">
                    {new Date(selected.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-medium uppercase text-slate-500">메시지</p>
                <p className="whitespace-pre-wrap text-sm text-slate-700">{selected.message}</p>
              </div>

              {/* Status Change */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-slate-500">상태 변경</p>
                <div className="flex gap-2">
                  {(['unread', 'read', 'replied'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        selected.status === s
                          ? 'text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      style={selected.status === s ? { backgroundColor: '#1a1a2e' } : undefined}
                    >
                      {{ unread: '미읽음', read: '읽음', replied: '답변완료' }[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-slate-500">관리자 메모</p>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="내부 메모를 입력하세요..."
                  className="mb-2 min-h-[100px]"
                />
                <Button onClick={saveNote} disabled={saving} size="sm">
                  {saving ? '저장 중...' : '메모 저장'}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
