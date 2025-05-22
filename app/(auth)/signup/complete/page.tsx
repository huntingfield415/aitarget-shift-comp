'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupCompletePage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/billing')
    }, 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="container py-5 text-center">
      <h1 className="text-2xl font-bold mb-4">登録が完了しました</h1>
      <p className="mb-3">ありがとうございました。</p>
      <p className="mb-5">5秒後に課金ページへ自動で移動します。</p>
      <button className="btn btn-primary" onClick={() => router.push('/billing')}>
        今すぐ課金ページへ進む
      </button>
    </main>
  )
}
