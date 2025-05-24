'use client'

import React, { useState } from 'react'
import { StructureModal } from '@/components/templates/StructureModal'

export default function PreviewPage() {
  const [open, setOpen] = useState(false)

  const dummyTemplate = {
    class_structure: [
      { class_name: 'ひまわり組', children_count: 18, age_in_months: 48 },
      { class_name: 'ちゅうりっぷ組', children_count: 15, age_in_months: 36 }
    ],
    shift_hours: [
      { name: '早番', start: '07:00', end: '15:00' },
      { name: '中番', start: '09:00', end: '17:00' },
      { name: '遅番', start: '11:00', end: '19:00' }
    ],
    lead_teachers: [
      { name: '山田先生', class_name: 'ひまわり組', role: '担任' },
      { name: '鈴木先生', class_name: 'ちゅうりっぷ組', role: '担任' }
    ]
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">🧪 UI プレビューページ</h1>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
      >
        StructureModal を開く
      </button>
      <StructureModal open={open} onClose={() => setOpen(false)} template={dummyTemplate} />
    </main>
  )
}