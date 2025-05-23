'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

type ShiftTemplate = Database['public']['Tables']['shift_templates']['Row']
type Garden = Database['public']['Tables']['gardens']['Row']

export default function ShiftTemplateSettings() {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  const [gardens, setGardens] = useState<Garden[]>([])
  const [template, setTemplate] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [gardenId, setGardenId] = useState('')
  const [templateMonth, setTemplateMonth] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchGardens = async () => {
      const { data } = await supabase.from('gardens').select('*')
      if (data) setGardens(data)
    }
    fetchGardens()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('shift_templates').insert({
      template,
      tags: tags.split(',').map((tag) => tag.trim()),
      category,
      facility_id: gardenId || null,
      template_month: templateMonth || null,
    })
    if (error) {
      alert('保存に失敗しました: ' + error.message)
    } else {
      setTemplate('')
      setTags('')
      setCategory('')
      setGardenId('')
      setTemplateMonth('')
      router.refresh()
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">テンプレート設定</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>テンプレート内容</Label>
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <Label>タグ（カンマ区切り）</Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例: 4月,週案,A園"
          />
        </div>
        <div>
          <Label>カテゴリ</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="例: 月案"
          />
        </div>
        <div>
          <Label>園を選択</Label>
          <select
            className="w-full border rounded px-2 py-1"
            value={gardenId}
            onChange={(e) => setGardenId(e.target.value)}
          >
            <option value="">未選択</option>
            {gardens.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>対象年月</Label>
          <Input
            type="month"
            value={templateMonth}
            onChange={(e) => setTemplateMonth(e.target.value + '-01')}
          />
        </div>
        <Button type="submit">保存</Button>
      </form>
    </div>
  )
}
