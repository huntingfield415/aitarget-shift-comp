'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Template = {
  class_structure: { class_name: string; children_count: number; age_in_months: number }[]
  shift_hours: { name: string; start: string; end: string }[]
  lead_teachers: { name: string; class_name: string; role: string }[]
}

type Props = {
  open: boolean
  template: Template
  onClose: () => void
}

export function StructureModal({ open, template, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>テンプレート構成詳細</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">クラス構成</h3>
            <ul className="list-disc pl-5">
              {template.class_structure.map((cls, idx) => (
                <li key={idx}>
                  {cls.class_name}（{cls.children_count}人, {cls.age_in_months}ヶ月）
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">勤務時間帯</h3>
            <ul className="list-disc pl-5">
              {template.shift_hours.map((s, idx) => (
                <li key={idx}>
                  {s.name}：{s.start}〜{s.end}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">担任一覧</h3>
            <ul className="list-disc pl-5">
              {template.lead_teachers.map((t, idx) => (
                <li key={idx}>
                  {t.name}（{t.class_name}, {t.role}）
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}