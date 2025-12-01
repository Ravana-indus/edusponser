import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function POST(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { by } = await req.json().catch(() => ({ by: null }))
    if (!isSupabaseConfigured) {
      return NextResponse.json({ status: 'fulfilled', name: params.name, fulfilled_by: by ?? null })
    }
    const { data, error } = await supabase.rpc('fulfill_purchase_order', {
      po_name: params.name,
      p_fulfilled_by: by ?? null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
