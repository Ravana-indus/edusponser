import { NextResponse } from 'next/server'

// This route is a no-op in Supabase mode; kept to avoid 404s
export async function GET() {
  return NextResponse.json({ enabled: true })
}

export async function POST() {
  return NextResponse.json({ success: true })
}