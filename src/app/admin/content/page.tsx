'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Save, Plus, Trash2 } from 'lucide-react'

interface ContentItem {
  id?: string
  section: string
  content_key: string
  content_value: Record<string, unknown>
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .order('section')
    setContent(data ?? [])
  }

  const getContent = useCallback(
    (section: string, key: string): Record<string, unknown> => {
      const item = content.find(
        (c) => c.section === section && c.content_key === key
      )
      return (item?.content_value as Record<string, unknown>) ?? {}
    },
    [content]
  )

  const saveContent = async (
    section: string,
    key: string,
    value: Record<string, unknown>
  ) => {
    setSaving(true)
    setSaveMessage('')

    const { error } = await supabase
      .from('site_content')
      .upsert(
        { section, content_key: key, content_value: value },
        { onConflict: 'section,content_key' }
      )

    if (error) {
      setSaveMessage('저장에 실패했습니다.')
    } else {
      setSaveMessage('저장되었습니다!')
      fetchContent()
    }
    setSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-slate-800">콘텐츠 관리</h1>
          <p className="text-sm text-slate-500">랜딩페이지 콘텐츠를 편집하세요</p>
        </div>
        {saveMessage && (
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
            {saveMessage}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <Tabs defaultValue="hero">
          <TabsList className="mb-6">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroEditor
              data={getContent('hero', 'main')}
              onSave={(val) => saveContent('hero', 'main', val)}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesEditor
              data={getContent('features', 'list')}
              onSave={(val) => saveContent('features', 'list', val)}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsEditor
              data={getContent('testimonials', 'list')}
              onSave={(val) => saveContent('testimonials', 'list', val)}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingEditor
              data={getContent('pricing', 'plans')}
              onSave={(val) => saveContent('pricing', 'plans', val)}
              saving={saving}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// --- Hero Editor ---
function HeroEditor({
  data,
  onSave,
  saving,
}: {
  data: Record<string, unknown>
  onSave: (val: Record<string, unknown>) => void
  saving: boolean
}) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [cta, setCta] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    setTitle((data.title as string) ?? '')
    setSubtitle((data.subtitle as string) ?? '')
    setCta((data.cta as string) ?? '')
    setImageUrl((data.imageUrl as string) ?? '')
  }, [data])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>제목</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Craft layout in minutes." />
      </div>
      <div className="space-y-2">
        <Label>설명</Label>
        <Textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Build beautiful, responsive landing pages..." />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>CTA 텍스트</Label>
          <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Get Started" />
        </div>
        <div className="space-y-2">
          <Label>배경 이미지 URL</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <Button onClick={() => onSave({ title, subtitle, cta, imageUrl })} disabled={saving} className="gap-2">
        <Save className="h-4 w-4" />
        {saving ? '저장 중...' : '저장'}
      </Button>
    </div>
  )
}

// --- Features Editor ---
interface FeatureItem {
  title: string
  description: string
  icon: string
}

function FeaturesEditor({
  data,
  onSave,
  saving,
}: {
  data: Record<string, unknown>
  onSave: (val: Record<string, unknown>) => void
  saving: boolean
}) {
  const [features, setFeatures] = useState<FeatureItem[]>([])

  useEffect(() => {
    const items = (data.items as FeatureItem[]) ?? []
    setFeatures(
      items.length > 0
        ? items
        : Array.from({ length: 6 }, () => ({ title: '', description: '', icon: '' }))
    )
  }, [data])

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    )
  }

  return (
    <div className="space-y-6">
      {features.map((feature, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-4">
          <p className="mb-3 text-sm font-medium text-slate-600">Feature {i + 1}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>제목</Label>
              <Input value={feature.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} placeholder="Feature title" />
            </div>
            <div className="space-y-2">
              <Label>설명</Label>
              <Input value={feature.description} onChange={(e) => updateFeature(i, 'description', e.target.value)} placeholder="Description" />
            </div>
            <div className="space-y-2">
              <Label>아이콘 이름</Label>
              <Input value={feature.icon} onChange={(e) => updateFeature(i, 'icon', e.target.value)} placeholder="Smartphone, Monitor, Zap..." />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={() => onSave({ items: features })} disabled={saving} className="gap-2">
        <Save className="h-4 w-4" />
        {saving ? '저장 중...' : '저장'}
      </Button>
    </div>
  )
}

// --- Testimonials Editor ---
interface TestimonialItem {
  name: string
  title: string
  company: string
  review: string
  avatar: string
}

function TestimonialsEditor({
  data,
  onSave,
  saving,
}: {
  data: Record<string, unknown>
  onSave: (val: Record<string, unknown>) => void
  saving: boolean
}) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])

  useEffect(() => {
    const items = (data.items as TestimonialItem[]) ?? []
    setTestimonials(items.length > 0 ? items : [{ name: '', title: '', company: '', review: '', avatar: '' }])
  }, [data])

  const updateItem = (index: number, field: keyof TestimonialItem, value: string) => {
    setTestimonials((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    )
  }

  const addItem = () => {
    setTestimonials((prev) => [...prev, { name: '', title: '', company: '', review: '', avatar: '' }])
  }

  const removeItem = (index: number) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {testimonials.map((item, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">Testimonial {i + 1}</p>
            {testimonials.length > 1 && (
              <button onClick={() => removeItem(i)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>이름</Label>
              <Input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Alex Johnson" />
            </div>
            <div className="space-y-2">
              <Label>직함</Label>
              <Input value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="CTO" />
            </div>
            <div className="space-y-2">
              <Label>회사</Label>
              <Input value={item.company} onChange={(e) => updateItem(i, 'company', e.target.value)} placeholder="TechFlow" />
            </div>
            <div className="space-y-2">
              <Label>아바타 URL</Label>
              <Input value={item.avatar} onChange={(e) => updateItem(i, 'avatar', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label>리뷰</Label>
            <Textarea value={item.review} onChange={(e) => updateItem(i, 'review', e.target.value)} placeholder="리뷰 내용..." />
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <Button variant="outline" onClick={addItem} className="gap-2">
          <Plus className="h-4 w-4" />
          추가
        </Button>
        <Button onClick={() => onSave({ items: testimonials })} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  )
}

// --- Pricing Editor ---
interface PricingPlan {
  name: string
  description: string
  monthlyPrice: string
  yearlyPrice: string
  features: string
  popular: boolean
}

function PricingEditor({
  data,
  onSave,
  saving,
}: {
  data: Record<string, unknown>
  onSave: (val: Record<string, unknown>) => void
  saving: boolean
}) {
  const [plans, setPlans] = useState<PricingPlan[]>([])

  useEffect(() => {
    const items = (data.items as PricingPlan[]) ?? []
    setPlans(
      items.length > 0
        ? items
        : [
            { name: 'Basic', description: '', monthlyPrice: '9', yearlyPrice: '90', features: '', popular: false },
            { name: 'Pro', description: '', monthlyPrice: '29', yearlyPrice: '290', features: '', popular: true },
            { name: 'Enterprise', description: '', monthlyPrice: '99', yearlyPrice: '990', features: '', popular: false },
          ]
    )
  }, [data])

  const updatePlan = (index: number, field: keyof PricingPlan, value: string | boolean) => {
    setPlans((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )
  }

  return (
    <div className="space-y-6">
      {plans.map((plan, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-3">
            <p className="text-sm font-medium text-slate-600">{plan.name || `Plan ${i + 1}`}</p>
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={plan.popular}
                onChange={(e) => updatePlan(i, 'popular', e.target.checked)}
                className="rounded"
              />
              Popular
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>플랜 이름</Label>
              <Input value={plan.name} onChange={(e) => updatePlan(i, 'name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>설명</Label>
              <Input value={plan.description} onChange={(e) => updatePlan(i, 'description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>월간 가격 ($)</Label>
              <Input value={plan.monthlyPrice} onChange={(e) => updatePlan(i, 'monthlyPrice', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>연간 가격 ($)</Label>
              <Input value={plan.yearlyPrice} onChange={(e) => updatePlan(i, 'yearlyPrice', e.target.value)} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label>기능 목록 (줄바꿈으로 구분)</Label>
            <Textarea
              value={plan.features}
              onChange={(e) => updatePlan(i, 'features', e.target.value)}
              placeholder="Up to 3 projects&#10;Basic analytics&#10;1 GB storage"
              className="min-h-[100px]"
            />
          </div>
        </div>
      ))}
      <Button onClick={() => onSave({ items: plans })} disabled={saving} className="gap-2">
        <Save className="h-4 w-4" />
        {saving ? '저장 중...' : '저장'}
      </Button>
    </div>
  )
}
