'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase
      .from('contact_inquiries')
      .insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        status: 'unread',
      })

    setLoading(false)

    if (insertError) {
      setError('문의 전송에 실패했습니다. 다시 시도해주세요.')
      return
    }

    setSubmitted(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  if (submitted) {
    return (
      <section id="contact" className="py-20">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
          <CheckCircle className="mb-4 h-12 w-12 text-emerald-500" />
          <h2 className="mb-2 text-2xl font-bold">문의가 전송되었습니다!</h2>
          <p className="mb-6 text-muted-foreground">빠른 시일 내에 답변 드리겠습니다.</p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            새 문의 보내기
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            궁금한 점이 있으시면 언제든 문의해주세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                required
                placeholder="홍길동"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">제목</Label>
            <Input
              id="subject"
              required
              placeholder="문의 제목을 입력하세요"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">메시지</Label>
            <Textarea
              id="message"
              required
              placeholder="문의 내용을 입력하세요"
              className="min-h-[150px]"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
            {loading ? '전송 중...' : (
              <>
                <Send className="h-4 w-4" />
                문의 보내기
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
