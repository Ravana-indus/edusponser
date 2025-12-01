import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// POST /api/admin/auth/reset-password
// body: { email: string }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = (body?.email || '').toString().trim().toLowerCase()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    // send password reset (magic link) to email
    // using supabase-js v2: send reset password email is via auth.admin.generateLink
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Optionally send via your email provider if you need custom email logic
    return NextResponse.json({ ok: true, email, link: data?.properties?.action_link ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unexpected' }, { status: 500 })
  }
}


