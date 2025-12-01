import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// POST /api/admin/auth/set-password
// body: { user_id: string, password: string }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const userId = (body?.user_id || '').toString().trim()
    const password = (body?.password || '').toString()
    if (!userId || !password) return NextResponse.json({ error: 'user_id and password required' }, { status: 400 })

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unexpected' }, { status: 500 })
  }
}


