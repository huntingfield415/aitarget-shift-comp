import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch('https://api.dify.ai/v1/completion-messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {
        class_structure: body.class_structure,
        staff_list: body.staff_list,
        shift_hours: body.shift_hours,
        preferences: body.preferences,
      },
      user: body.user_id,
      response_mode: 'blocking',
    }),
  });

  const result = await response.json();
  return NextResponse.json(result);
}
