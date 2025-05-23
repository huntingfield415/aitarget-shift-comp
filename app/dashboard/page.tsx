'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ShiftPdf } from '@/components/ShiftPdf'

export default function DashboardPage() {
  const [form, setForm] = useState({ className: '', classInfo: '', shiftTime: '' })
  const [templates, setTemplates] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [generated, setGenerated] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const loadTemplates = async () => {
      const { data } = await supabase.from('shift_templates').select('*').order('created_at', { ascending: false })
      if (data) setTemplates(data)
    }
    loadTemplates()
  }, [])

  const handleSaveTemplate = async () => {
    if (!form.className || !form.classInfo || !form.shiftTime) return
    await supabase.from('shift_templates').insert({ ...form })
    setMessage('テンプレートを保存しました')
  }

  const handleApplyTemplate = (t: any) => {
    setForm({ className: t.className, classInfo: t.classInfo, shiftTime: t.shiftTime })
  }

  const handleDeleteTemplate = async (id: string) => {
    await supabase.from('shift_templates').delete().eq('id', id)
    setTemplates(templates.filter(t => t.id !== id))
  }

  const handleGenerate = async () => {
    const res = await fetch('/api/generate-shift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const { result } = await res.json()
    setGenerated(result)
    setMessage('✅ シフト生成完了')
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">シフト自動生成</h2>

      <div className="mb-3">
        <h5>テンプレート</h5>
        {templates.map(t => (
          <div key={t.id} className="d-flex justify-content-between align-items-center border p-2 mb-2">
            <div>
              <strong>{t.className}</strong> / {t.shiftTime}
            </div>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleApplyTemplate(t)}>適用</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTemplate(t.id)}>削除</button>
            </div>
          </div>
        ))}
        <button className="btn btn-sm btn-outline-success" onClick={handleSaveTemplate}>現在の入力をテンプレート保存</button>
      </div>

      <div className="mb-3">
        <label>クラス名</label>
        <input type="text" className="form-control" value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} />
      </div>

      <div className="mb-3">
        <label>園児構成（例：0歳:3人、1歳:4人）</label>
        <input type="text" className="form-control" value={form.classInfo} onChange={e => setForm({ ...form, classInfo: e.target.value })} />
      </div>

      <div className="mb-3">
        <label>勤務時間（例：早番:7:00-9:00、中番:9:00-15:00）</label>
        <input type="text" className="form-control" value={form.shiftTime} onChange={e => setForm({ ...form, shiftTime: e.target.value })} />
      </div>

      <button className="btn btn-primary" onClick={handleGenerate}>シフトを生成する</button>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      {generated && (
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between">
            <div>{generated.class}</div>
            <PDFDownloadLink
              document={<ShiftPdf className={generated.class} date={today} slots={generated.slots} />}
              fileName={`${generated.class}_${today}_シフト表.pdf`}
            >
              {({ loading }) => loading ? 'PDF作成中...' : <button className="btn btn-sm btn-outline-secondary">PDFで保存</button>}
            </PDFDownloadLink>
          </div>
          <ul className="list-group list-group-flush">
            {generated.slots.map((s, i) => (
              <li key={i} className="list-group-item">
                {s.label}（{s.time}） - 保育士 {s.required_staff}人
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}