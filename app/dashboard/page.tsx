'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { STAFF_RATIO } from '@/lib/constants'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ShiftPdf } from '@/components/ShiftPdf'
import { Modal } from 'bootstrap'

type ShiftSlot = {
  time: string
  label: string
  required_staff: number
}

type GeneratedShift = {
  id: string
  class_name: string
  date: string
  slots: ShiftSlot[]
}

export default function DashboardPage() {
  const [form, setForm] = useState({
    className: '',
    classInfo: '',
    shiftTime: '',
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState({
    shiftImage: false,
    className: false,
    classInfo: false,
    shiftTime: false,
  })
  const [message, setMessage] = useState('')
  const [generated, setGenerated] = useState<GeneratedShift | null>(null)
  const [history, setHistory] = useState<GeneratedShift[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('generated_shifts')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setHistory(data)
    }
    fetchHistory()
  }, [])

  const handleInput = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setStatus((prev) => ({ ...prev, [field]: !!value }))
  }

  const handleUploadShiftImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    setError('')
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      setError('ログインユーザーが確認できません。')
      setSaving(false)
      return
    }

    const filePath = `shift-${user.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error: uploadErr } = await supabase.storage.from('shift-images').upload(filePath, file)
    if (uploadErr) {
      setError('アップロード失敗: ' + uploadErr.message)
      setSaving(false)
      return
    }

    const url = supabase.storage.from('shift-images').getPublicUrl(filePath).data.publicUrl
    setPreviewUrl(url)
    setStatus((prev) => ({ ...prev, shiftImage: true }))
    setSaving(false)
    const modal = document.getElementById('shiftImageModal')
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).hide()
  }

  const handleGenerate = async () => {
    if (Object.values(status).some((v) => !v)) {
      setMessage('必要な情報が不足しています。')
      return
    }

    setSaving(true)
    const res = await fetch('/api/generate-shift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const { result } = await res.json()
    setGenerated(result)

    // 保存処理
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('generated_shifts').insert({
      user_id: user?.id,
      class_name: result.class,
      slots: result.slots,
      date: new Date().toISOString()
    })

    setMessage('✅ シフト生成完了')
    setSaving(false)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="container py-4">
      <h2 className="mb-4">シフト自動生成ダッシュボード</h2>

      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleGenerate} disabled={saving}>
          {saving ? '生成中...' : 'シフトを生成する'}
        </button>
      </div>
      {message && <div className="alert alert-info">{message}</div>}

      {generated && (
        <div className="card mb-4">
          <div className="card-header">最新のシフト</div>
          <div className="card-body">
            <h5>{generated.class_name}</h5>
            <ul className="list-group">
              {generated.slots.map((slot, i) => (
                <li key={i} className="list-group-item">
                  {slot.label}（{slot.time}）: 必要保育士 {slot.required_staff}人
                </li>
              ))}
            </ul>
          </div>
          <div className="card-footer text-end">
            <PDFDownloadLink
              document={
                <ShiftPdf
                  className={generated.class_name}
                  date={todayStr}
                  slots={generated.slots}
                />
              }
              fileName={`${generated.class_name}_${todayStr}_シフト表.pdf`}
            >
              {({ loading }) =>
                loading ? 'PDFを生成中...' : <button className="btn btn-outline-secondary">📄 PDFで保存</button>
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}

      <h4 className="mb-2">過去のシフト履歴</h4>
      <ul className="list-group">
        {history.map((h) => (
          <li key={h.id} className="list-group-item">
            {h.class_name} - {new Date(h.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
