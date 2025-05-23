// /app/api/export-csv/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const templateId = searchParams.get('templateId')

  if (!templateId) {
    return NextResponse.json({ error: 'templateId is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('shift_templates')
    .select('class_structure, shift_hours, lead_teachers')
    .eq('id', templateId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 })
  }

  const toCSV = (rows: any[], headers: string[]) => {
    const lines = [headers.join(',')]
    for (const row of rows) {
      lines.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
    }
    return lines.join('\n')
  }

  const cs = Array.isArray(data.class_structure) ? data.class_structure : []
  const sh = Array.isArray(data.shift_hours) ? data.shift_hours : []
  const lt = Array.isArray(data.lead_teachers) ? data.lead_teachers : []

  const csCSV = toCSV(cs, ['class_name', 'children_count', 'age_in_months'])
  const shCSV = toCSV(sh, ['name', 'start', 'end'])
  const ltCSV = toCSV(lt, ['name', 'class_name', 'role'])

  const fullCSV = [
    '--- Class Structure ---',
    csCSV,
    '',
    '--- Shift Hours ---',
    shCSV,
    '',
    '--- Lead Teachers ---',
    ltCSV,
  ].join('\n')

  return new Response(fullCSV, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=template_${templateId}.csv`,
    },
  })
}