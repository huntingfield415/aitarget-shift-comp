'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'

type StorageFile = {
  name: string
  created_at: string
}

export default function HistoryPage() {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const [files, setFiles] = useState<StorageFile[]>([])

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase.storage.from('pdfs').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      if (data) setFiles(data)
    }

    fetchFiles()
  }, [supabase])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">出力履歴（PDF / CSV）</h1>

      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file.name} className="border rounded p-3 flex justify-between items-center">
            <span>{file.name}</span>
            <Button
              onClick={() => {
                const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdfs/${file.name}`
                window.open(url, '_blank')
              }}
              size="sm"
              variant="outline"
            >
              ダウンロード
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}