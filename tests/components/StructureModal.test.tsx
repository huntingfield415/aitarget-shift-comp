import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StructureModal } from '../../components/templates/StructureModal'

const dummyTemplate = {
  class_structure: [
    { class_name: 'A組', children_count: 10, age_in_months: 36 },
  ],
  shift_hours: [
    { name: '早番', start: '07:30', end: '15:30' },
  ],
  lead_teachers: [
    { name: '田中先生', class_name: 'A組', role: '担任' },
  ],
}

describe('StructureModal', () => {
  it('should render modal contents when open', () => {
    render(
      <StructureModal open={true} template={dummyTemplate} onClose={() => {}} />
    )
    expect(screen.getByText('テンプレート構成詳細')).toBeDefined()
  })
})