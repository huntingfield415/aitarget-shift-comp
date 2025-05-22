'use client'

import { useState, useEffect } from 'react'
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

  return (
    <div>
      <h2 className="mb-4">ダッシュボード</h2>
      <p className="mb-3">下記の情報をすべて入力しないとシフト作成はできません。</p>

      <ul className="list-group mb-3">
        <li className="list-group-item d-flex justify-content-between">
          <span>過去のシフト表（画像）</span>
          <div>
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#shiftImageModal"
            >
              入力
            </button>
            {status.shiftImage ? '✔️ 済' : '未'}
          </div>
        </li>
        {/* 他の3項目はこの後追加 */}
      </ul>

      <button className="btn btn-primary mb-3" onClick={handleCreateShift}>
        シフト表を作成する
      </button>

      {message && (
        <div className="alert alert-info white-space-pre-line">{message}</div>
      )}

      {/* モーダル本体：画像アップロード */}
      <div
        className="modal fade"
        id="shiftImageModal"
        tabIndex={-1}
        aria-labelledby="shiftImageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shiftImageModalLabel">過去のシフト表をアップロード</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
            </div>
            <div className="modal-body">
              <input type="file" accept="image/*" className="form-control mb-3" onChange={handleImageUpload} />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="img-fluid border rounded" />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
