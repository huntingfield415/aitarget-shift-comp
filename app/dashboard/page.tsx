'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Modal } from 'bootstrap'

export default function DashboardPage() {
  const [status, setStatus] = useState({
    shiftImage: false,
    className: false,
    classInfo: false,
    shiftTime: false,
  })
  const [message, setMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [form, setForm] = useState({
    className: '',
    classInfo: '',
    shiftTime: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleCreateShift = () => {
    const missing = Object.entries(status)
      .filter(([, filled]) => !filled)
      .map(([key]) => key)

    if (missing.length > 0) {
      const labelMap: Record<string, string> = {
        shiftImage: '過去のシフト表',
        className: 'クラスの名前',
        classInfo: 'クラスの情報',
        shiftTime: 'シフト時間とその名称',
      }
      const missingLabels = missing.map((m) => labelMap[m]).join('、')
      setMessage(`情報が不十分なため、シフト表を作成できません。\n不足している情報：${missingLabels}`)
    } else {
      setMessage('✅ シフト表の作成を開始します（ダミー処理）')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setStatus((prev) => ({ ...prev, shiftImage: true }))
    }
  }

  const handleInput = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field !== 'className') {
      setStatus((prev) => ({ ...prev, [field]: !!value }))
    }
  }

  const handleSaveClassName = async () => {
    setSaving(true)
    setError('')
    const { data: { user }
  const handleSaveClassInfo = async () => {
    setSaving(true)
    setError('')
    const { data: { user }
  const handleSaveShiftTime = async () => {
    setSaving(true)
    setError('')
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      setError('ログイン情報が確認できません。')
      setSaving(false)
      return
    }

    const { error: insertErr } = await supabase
      .from('shift_times')
      .insert({ user_id: user.id, content: form.shiftTime })

    if (insertErr) {
      setError('保存に失敗しました。' + insertErr.message)
      setSaving(false)
      return
    }

    setStatus((prev) => ({ ...prev, shiftTime: true }))
    setSaving(false)
    const modal = document.getElementById('shiftTimeModal')
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).hide()
  }
, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      setError('ログイン情報が確認できません。')
      setSaving(false)
      return
    }

    const { error: insertErr } = await supabase
      .from('class_infos')
      .insert({ user_id: user.id, info: form.classInfo })

    if (insertErr) {
      setError('保存に失敗しました。' + insertErr.message)
      setSaving(false)
      return
    }

    setStatus((prev) => ({ ...prev, classInfo: true }))
    setSaving(false)
    const modal = document.getElementById('classInfoModal')
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).hide()
  }
, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      setError('ログイン情報が確認できません。')
      setSaving(false)
      return
    }

    const { error: insertErr } = await supabase
      .from('class_names')
      .insert({ user_id: user.id, name: form.className })

    if (insertErr) {
      setError('保存に失敗しました。' + insertErr.message)
      setSaving(false)
      return
    }

    setStatus((prev) => ({ ...prev, className: true }))
    setSaving(false)
    const modal = document.getElementById('classNameModal')
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).hide()
  }

  return (
    <div>
      <h2 className="mb-4">ダッシュボード</h2>
      <p className="mb-3">下記の情報をすべて入力しないとシフト作成はできません。</p>

      <ul className="list-group mb-3">
        <li className="list-group-item d-flex justify-content-between">
          <span>過去のシフト表（画像）</span>
          <div>
            <button className="btn btn-outline-secondary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#shiftImageModal">入力</button>
            {status.shiftImage ? '✔️ 済' : '未'}
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>クラスの名前</span>
          <div>
            <button className="btn btn-outline-secondary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#classNameModal">入力</button>
            {status.className ? '✔️ 済' : '未'}
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>クラスの情報（年齢・人数）</span>
          <div>
            <button className="btn btn-outline-secondary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#classInfoModal">入力</button>
            {status.classInfo ? '✔️ 済' : '未'}
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>シフト時間とその名称</span>
          <div>
            <button className="btn btn-outline-secondary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#shiftTimeModal">入力</button>
            {status.shiftTime ? '✔️ 済' : '未'}
          </div>
        </li>
      </ul>

      <button className="btn btn-primary mb-3" onClick={handleCreateShift}>シフト表を作成する</button>
      {message && <div className="alert alert-info white-space-pre-line">{message}</div>}

      {/* モーダル：シフト画像 */}
      <div className="modal fade" id="shiftImageModal" tabIndex={-1}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">シフト表画像</h5>
            <button className="btn-close" data-bs-dismiss="modal" />
          </div>
          <div className="modal-body">
            <input type="file" accept="image/*" className="form-control mb-3" onChange={handleImageUpload} />
            {previewUrl && <img src={previewUrl} className="img-fluid" />}
          </div>
        </div></div>
      </div>

      {/* モーダル：クラス名 */}
      <div className="modal fade" id="classNameModal" tabIndex={-1}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">クラス名</h5>
            <button className="btn-close" data-bs-dismiss="modal" />
          </div>
          <div className="modal-body">
            <input type="text" className="form-control" placeholder="例：さくら組" value={form.className} onChange={(e) => handleInput('className', e.target.value)} />
          </div>
          <div className="modal-footer">
            {error && <p className="text-danger me-auto">{error}</p>}
            <button className="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            <button className="btn btn-primary" onClick={handleSaveClassName} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div></div>
      </div>

      {/* モーダル：クラス情報 */}
      <div className="modal fade" id="classInfoModal" tabIndex={-1}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">クラス情報</h5>
            <button className="btn-close" data-bs-dismiss="modal" />
          </div>
          <div className="modal-body">
            <textarea className="form-control" placeholder="例：0歳3人、1歳4人" value={form.classInfo} onChange={(e) => handleInput('classInfo', e.target.value)} />
          <div className="modal-footer">
            {error && <p className="text-danger me-auto">{error}</p>}
            <button className="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            <button className="btn btn-primary" onClick={handleSaveClassInfo} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>

          </div>
        </div></div>
      </div>

      {/* モーダル：シフト時間 */}
      <div className="modal fade" id="shiftTimeModal" tabIndex={-1}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">シフト時間と名称</h5>
            <button className="btn-close" data-bs-dismiss="modal" />
          </div>
          <div className="modal-body">
            <textarea className="form-control" placeholder="例：早番 7:00〜、中番 9:00〜" value={form.shiftTime} onChange={(e) => handleInput('shiftTime', e.target.value)} />
          <div className="modal-footer">
            {error && <p className="text-danger me-auto">{error}</p>}
            <button className="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            <button className="btn btn-primary" onClick={handleSaveShiftTime} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>

          </div>
        </div></div>
      </div>
    </div>
  )
}
