// /app/api/generate-shift/route.ts
import { NextResponse } from 'next/server'
import { checkRequiredStaffPerClass } from '@/lib/logic/staffingCheck'
import { proposeExtraSupport } from '@/lib/logic/extraSupportProposal'

export async function POST(req: Request) {
  const body = await req.json()

  const classes = body.classes || []
  const shifts = body.shift_hours || []
  const dayOfWeek = body.day_of_week || 'Monday'

  const requiredStaffResults = checkRequiredStaffPerClass(classes)
  const extraSupport = proposeExtraSupport(shifts, dayOfWeek)

  return NextResponse.json({
    required_staff: requiredStaffResults,
    extra_support: extraSupport,
  })
}