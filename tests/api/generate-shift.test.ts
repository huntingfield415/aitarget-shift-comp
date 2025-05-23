// /tests/api/generate-shift.test.ts
import { describe, it, expect } from 'vitest'
import { POST } from '../../app/api/generate-shift/route'

describe('POST /api/generate-shift', () => {
  it('should return required staff and extra support', async () => {
    const mockRequest = {
      json: async () => ({
        classes: [
          { class_name: '1歳児', children_count: 12, age_in_months: 20 }
        ],
        shift_hours: [
          { name: '早番', start: '07:30', end: '15:30' }
        ],
        day_of_week: 'Monday'
      })
    }

    // @ts-ignore
    const res = await POST(mockRequest)
    const json = await res.json()

    expect(json.required_staff[0]).toEqual({
      class_name: '1歳児',
      children_count: 12,
      age_in_months: 20,
      required_staff: 2
    })

    expect(json.extra_support[0].shift_name).toBe('早番')
    expect(json.extra_support[0].recommended_extra_staff).toBeGreaterThan(0)
  })
})