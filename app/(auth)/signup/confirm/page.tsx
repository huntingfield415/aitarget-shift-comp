'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function SignupConfirmPage() {
  const params = useSearchParams()
  const router = useRouter()

  const formData = {
    company: params.get('company') || '',
    postal: params.get('postal') || '',
    prefecture: params.get('prefecture') || '',
    address: params.get('address') || '',
    name: params.get('name') || '',
    phone: params.get('phone') || '',
    email: params.get('email') || '',
    password: params.get('password') || '',
  }

  const handleRegister = async () => {
    // TODO: supabase.auth.signUp + DB保存（別途対応）
    console.log('登録処理:', formData)
    router.push('/signup/complete')
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4 text-2xl font-bold">登録内容の確認</h1>
      <div className="mb-3"><strong>会社名：</strong>{formData.company}</div>
      <div className="mb-3"><strong>郵便番号：</strong>{formData.postal}</div>
      <div className="mb-3"><strong>都道府県：</strong>{formData.prefecture}</div>
      <div className="mb-3"><strong>住所：</strong>{formData.address}</div>
      <div className="mb-3"><strong>担当者様：</strong>{formData.name}</div>
      <div className="mb-3"><strong>電話番号：</strong>{formData.phone}</div>
      <div className="mb-3"><strong>メール：</strong>{formData.email}</div>

      <button className="btn btn-primary me-3" onClick={handleRegister}>登録する</button>
      <button className="btn btn-secondary" onClick={() => router.back()}>戻る</button>
    </main>
  )
}
