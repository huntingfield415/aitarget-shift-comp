// /lib/logic/extraSupportProposal.ts

type ShiftHour = {
  name: string
  start: string // '08:00'
  end: string   // '16:00'
}

type Proposal = {
  shift_name: string
  recommended_extra_staff: number
  reason: string
}

export function proposeExtraSupport(shiftHours: ShiftHour[], dayOfWeek: string): Proposal[] {
  const results: Proposal[] = []

  for (const shift of shiftHours) {
    let extra = 0
    let reason = ''

    const startHour = parseInt(shift.start.split(':')[0])
    const endHour = parseInt(shift.end.split(':')[0])

    if (dayOfWeek === 'Monday' || dayOfWeek === 'Friday') {
      extra += 1
      reason += '繁忙日（登園・降園集中）; '
    }

    if (startHour < 8) {
      extra += 1
      reason += '早朝対応; '
    }

    if (endHour > 18) {
      extra += 1
      reason += '延長保育対応; '
    }

    if (extra > 0) {
      results.push({
        shift_name: shift.name,
        recommended_extra_staff: extra,
        reason: reason.trim(),
      })
    }
  }

  return results
}