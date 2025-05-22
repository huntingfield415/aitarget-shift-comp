'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function SignupConfirmPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

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
    setError(null)

    // ① Supabase Auth でユーザー作成
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message || 'ユーザー登録に失敗しました')
      return
    }

    // ② Supabase DB にプロフィール情報保存
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: signUpData.user.id,
        company: formData.company,
        postal: formData.postal,
        prefecture: formData.prefecture,
        address: formData.address,
        name: formData.name,
        phone: formData.phone,
      }])

    if (insertError) {
      setError(insertError.message)
      return
    }

    router.push('/signup/complete')
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4 text-2xl font-bold">登録内容の確認</h1>
      {error
