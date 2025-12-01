import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { reason } = await req.json()
    const { data, error } = await supabase.rpc('reject_purchase_order', {
      po_name: params.name,
      reason,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
