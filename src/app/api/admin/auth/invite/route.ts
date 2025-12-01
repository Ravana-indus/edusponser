import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// POST /api/admin/auth/invite
// body: { email: string, role?: 'student' | 'donor' | 'vendor', user_metadata?: Record<string, any>, redirectTo?: string }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = (body?.email || '').toString().trim().toLowerCase()
    const role = (body?.role || '').toString().trim()
    const user_metadata = (body?.user_metadata && typeof body.user_metadata === 'object') ? body.user_metadata : undefined
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
    const redirectTo = (body?.redirectTo || `${siteUrl}/auth/callback`).toString().trim()

    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: user_metadata,
      redirectTo,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Optionally set app role after create
    if (role && data?.user?.id) {
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        app_metadata: { role },
      })
      if (updErr) {
        // Not fatal; return warning
        return NextResponse.json({ ok: true, user: data.user, warning: updErr.message })
      }
    }

    return NextResponse.json({ ok: true, user: data?.user, link: (data as any)?.properties?.action_link ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unexpected' }, { status: 500 })
  }
}


