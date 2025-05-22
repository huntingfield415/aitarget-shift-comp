'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const prefectures = [
  '選択してください',
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
]

export default function SignupFormPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    company: '',
    postal: '',
    prefecture: '',
    address: '',
    name: '',
    phone: '',
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = new URLSearchParams(formData).toString()
    router.push(`/signup/confirm?${query}`)
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4 text-2xl font-bold">新規登録</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>会社名</label>
          <input name="company" type="text" value={formData.company} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>郵便番号</label>
          <input name="postal" type="text" value={formData.postal} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>都道府県</label>
          <select name="prefecture" value={formData.prefecture} onChange={handleChange} required className="form-control">
            {prefectures.map((p, i) => (
              <option key={i} value={p === '選択してください' ? '' : p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>住所</label>
          <input name="address" type="text" value={formData.address} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>担当者様お名前</label>
          <input name="name" type="text" value={formData.name} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>電話番号</label>
          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>メールアドレス</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>パスワード</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">確認画面へ</button>
      </form>
    </main>
  )
}
