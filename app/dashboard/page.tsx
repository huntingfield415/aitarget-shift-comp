'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  if (loading) return <p className="p-5">読み込み中...</p>

  if (!profile) return <p className="p-5 text-danger">プロフィールが見つかりません</p>

  return (
    <main className="container py-5">
      <h1 className="text-2xl font-bold mb-4">管理画面</h1>
      <p><strong>会社名:</strong> {profile.company}</p>
      <p><strong>担当者名:</strong> {profile.name}</p>
      <p><strong>メール:</strong> {profile.email}</p>
      <p><strong>住所:</strong> {profile.prefecture} {profile.address}（{profile.postal}）</p>
      <p><strong>電話番号:</strong> {profile.phone}</p>
    </main>
  )
}
