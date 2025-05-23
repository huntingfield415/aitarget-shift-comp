// 完全版: テンプレート編集・削除モーダルを統合したテンプレート一覧ページ
// file: /app/templates/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ShiftPdfDocument } from '@/components/pdf/ShiftPdfDocument'
import { StructureModal } from '@/components/templates/StructureModal'
import { Dialog } from '@headlessui/react'

type ShiftTemplate = Database['public']['Tables']['shift_templates']['Row']
type Garden = Database['public']['Tables']['gardens']['Row']

export default function TemplateListPage() {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  const [templates, setTemplates] = useState<ShiftTemplate[]>([])
  const [gardens, setGardens] = useState<Garden[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ShiftTemplate | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<ShiftTemplate | null>(null)

  const [tagFilter, setTagFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [gardenIdFilter, setGardenIdFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')

  const [editTags, setEditTags] = useState('')
  const [editCategory, setEditCategory] = useState('')

  const fetchData = async () => {
    let query = supabase.from('shift_templates').select('*')

    if (tagFilter) {
      const tags = tagFilter.split(',').map((t) => t.trim())
      tags.forEach((tag) => {
        query = query.ilike('tags::text', `%${tag}%`)
      })
    }

    if (categoryFilter) {
      query = query.ilike('category', `%${categoryFilter}%`)
    }

    if (gardenIdFilter) {
      query = query.eq('facility_id', gardenIdFilter)
    }

    if (monthFilter) {
      query = query.eq('template_month', monthFilter + '-01')
    }

    const { data, error } = await query
    if (!error && data) {
      setTemplates(data)
    }
  }

  useEffect(() => {
    const fetchGardens = async () => {
      const { data } = await supabase.from('gardens').select('*')
      if (data) setGardens(data)
    }
    fetchGardens()
    fetchData()
  }, [supabase])

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetchData()
  }

  const startEdit = (t: ShiftTemplate) => {
    setEditTags((t.tags || []).join(','))
    setEditCategory(t.category || '')
    setEditingTemplate(t)
  }

  const confirmEdit = async () => {
    if (!editingTemplate) return
    await supabase
      .from('shift_templates')
      .update({
        tags: editTags.split(',').map((t) => t.trim()),
        category: editCategory,
      })
      .eq('id', editingTemplate.id)
    setEditingTemplate(null)
    await fetchData()
  }

  const confirmDelete = async () => {
    if (!deletingTemplate) return
    await supabase.from('shift_templates').delete().eq('id', deletingTemplate.id)
    setDeletingTemplate(null)
    await fetchData()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">テンプレート一覧</h1>

      <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><Label>タグ</Label><Input value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} /></div>
        <div><Label>カテゴリ</Label><Input value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} /></div>
        <div>
          <Label>園</Label>
          <select className="w-full border rounded px-2 py-1" value={gardenIdFilter} onChange={(e) => setGardenIdFilter(e.target.value)}>
            <option value="">未選択</option>
            {gardens.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div><Label>年月</Label><Input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} /></div>
        <div className="col-span-full"><Button type="submit">フィルター</Button></div>
      </form>

      <ul className="space-y-4">
        {templates.map((t) => (
          <li key={t.id} className="border rounded p-4 space-y-2">
            <p><strong>カテゴリ:</strong> {t.category}</p>
            <p><strong>タグ:</strong> {(t.tags || []).join(', ')}</p>
            <p><strong>年月:</strong> {t.template_month?.slice(0, 7)}</p>
            <pre className="whitespace-pre-wrap">{t.template}</pre>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setSelectedTemplate(t)}>構成を見る</Button>
              <Button onClick={() => startEdit(t)} variant="outline">編集</Button>
              <Button onClick={() => setDeletingTemplate(t)} variant="destructive">削除</Button>
            </div>
          </li>
        ))}
      </ul>

      {selectedTemplate && (
        <StructureModal
          open={!!selectedTemplate}
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}

      <Dialog open={!!editingTemplate} onClose={() => setEditingTemplate(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <Dialog.Title className="text-lg font-bold">テンプレート編集</Dialog.Title>
            <Label>タグ</Label>
            <Input value={editTags} onChange={(e) => setEditTags(e.target.value)} />
            <Label>カテゴリ</Label>
            <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            <div className="text-right space-x-2">
              <Button onClick={() => setEditingTemplate(null)} variant="outline">キャンセル</Button>
              <Button onClick={confirmEdit}>更新</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={!!deletingTemplate} onClose={() => setDeletingTemplate(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
            <Dialog.Title className="text-lg font-bold">削除確認</Dialog.Title>
            <p>本当に削除しますか？</p>
            <div className="text-right space-x-2">
              <Button onClick={() => setDeletingTemplate(null)} variant="outline">キャンセル</Button>
              <Button onClick={confirmDelete} variant="destructive">削除</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}