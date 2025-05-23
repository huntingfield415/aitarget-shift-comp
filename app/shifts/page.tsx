'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function ShiftPage() {
  const [classesJson, setClassesJson] = useState('')
  const [shiftsJson, setShiftsJson] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('Monday')
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async () => {
    const res = await fetch('/api/generate-shift', {
      method: 'POST',
      body: JSON.stringify({
        classes: JSON.parse(classesJson),
        shift_hours: JSON.parse(shiftsJson),
        day_of_week: dayOfWeek,
      }),
    })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">シフト自動生成</h1>

      <div>
        <Label>曜日</Label>
        <select
          className="border rounded px-2 py-1"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
        >
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
        </select>
      </div>

      <div>
        <Label>クラス情報 (JSON)</Label>
        <textarea
          className="w-full border rounded p-2"
          rows={6}
          value={classesJson}
          onChange={(e) => setClassesJson(e.target.value)}
          placeholder='[{"class_name":"A組","children_count":15,"age_in_months":36}]'
        />
      </div>

      <div>
        <Label>勤務時間 (JSON)</Label>
        <textarea
          className="w-full border rounded p-2"
          rows={4}
          value={shiftsJson}
          onChange={(e) => setShiftsJson(e.target.value)}
          placeholder='[{"name":"早番","start":"07:30","end":"15:30"}]'
        />
      </div>

      <Button onClick={handleGenerate}>シフトを生成</Button>

      {result && (
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">保育士必要人数</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(result.required_staff, null, 2)}</pre>
          </div>
          <div>
            <h2 className="font-semibold">補助職員提案</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(result.extra_support, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}