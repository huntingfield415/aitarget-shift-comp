'use client'

import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ClassConfig = Database['public']['Tables']['class_configs']['Row']

export default function ClassConfigsPage() {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const [classConfigs, setClassConfigs] = useState<ClassConfig[]>([])
  const [className, setClassName] = useState('')
  const [childrenCount, setChildrenCount] = useState<number>(0)
  const [ageInMonths, setAgeInMonths] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const fetchConfigs = async () => {
      const { data, error } = await supabase
        .from('class_configs')
        .select('*')
        .order('id', { ascending: true })
      if (!error && data) {
        setClassConfigs(data)
      }
    }
    fetchConfigs()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('class_configs').insert({
      class_name: className,
      children_count: childrenCount,
      age_in_months: ageInMonths,
    })
    if (!error) {
      setClassName('')
      setChildrenCount(0)
      setAgeInMonths(0)
      router.refresh()
    } else {
      alert('保存に失敗しました')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">クラス情報の設定</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label>クラス名</Label>
          <Input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>園児数</Label>
          <Input
            type="number"
            value={childrenCount}
            onChange={(e) => setChildrenCount(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <Label>平均月齢</Label>
          <Input
            type="number"
            value={ageInMonths}
            onChange={(e) => setAgeInMonths(Number(e.target.value))}
            required
          />
        </div>
        <Button type="submit">保存</Button>
      </form>

      <h2 className="text-xl font-semibold mb-2">登録済みクラス</h2>
      <ul className="space-y-2">
        {classConfigs.map((cfg) => (
          <li key={cfg.id} className="border p-3 rounded">
            <p>クラス名: {cfg.class_name}</p>
            <p>園児数: {cfg.children_count}人</p>
            <p>平均月齢: {cfg.age_in_months}ヶ月</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
