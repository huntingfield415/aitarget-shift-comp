'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="w-full bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">保育園シフト管理</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-100"
      >
        ログアウト
      </button>
    </header>
  )
}
