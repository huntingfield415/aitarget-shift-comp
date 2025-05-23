// 完全版：CSVダウンロードボタンとテンプレート構成の復元機能を追加
// ファイル名: /app/templates/page.tsx（保存先として使用可能）

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

  const [tagFilter, setTagFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [gardenIdFilter, setGardenIdFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')

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

  const handleDownloadCSV = (id: string) => {
    const url = `/api/export-csv?templateId=${id}`
    const link = document.createElement('a')
    link.href = url
    link.download = `template_${id}.csv`
    link.click()
  }

  const handleRestore = (template: ShiftTemplate) => {
    localStorage.setItem('restored_template', JSON.stringify(template))
    alert('構成を復元用に保存しました（ローカルストレージ）')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">テンプレート一覧</h1>

      <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label>タグ</Label>
          <Input value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} />
        </div>
        <div>
          <Label>カテゴリ</Label>
          <Input value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
        </div>
        <div>
          <Label>園</Label>
          <select
            className="w-full border rounded px-2 py-1"
            value={gardenIdFilter}
            onChange={(e) => setGardenIdFilter(e.target.value)}
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
          <Label>年月</Label>
          <Input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
        </div>
        <div className="col-span-full">
          <Button type="submit">フィルター</Button>
        </div>
      </form>

      <ul className="space-y-4">
        {templates.map((t) => (
          <li key={t.id} className="border rounded p-4 space-y-2">
            <p><strong>カテゴリ:</strong> {t.category}</p>
            <p><strong>タグ:</strong> {(t.tags || []).join(', ')}</p>
            <p><strong>年月:</strong> {t.template_month?.slice(0, 7)}</p>
            <pre className="whitespace-pre-wrap">{t.template}</pre>

            <div className="flex flex-wrap gap-2">
              <PDFDownloadLink
                document={
                  <ShiftPdfDocument
                    facilityName={t.facility_name || '不明園'}
                    templateMonth={t.template_month?.slice(0, 7) || ''}
                    templateContent={t.template}
                    tags={t.tags || []}
                    category={t.category || ''}
                    logoUrl="/logo.png"
                  />
                }
                fileName={`${t.facility_name || 'shift'}_${t.template_month?.slice(0, 7)}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" size="sm">
                    {loading ? '生成中...' : 'PDF出力'}
                  </Button>
                )}
              </PDFDownloadLink>

              <Button onClick={() => handleDownloadCSV(t.id)} variant="outline" size="sm">
                CSVダウンロード
              </Button>

              <Button onClick={() => setSelectedTemplate(t)} variant="outline" size="sm">
                構成を見る
              </Button>

              <Button onClick={() => handleRestore(t)} variant="default" size="sm">
                構成を復元
              </Button>
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
    </div>
  )
}