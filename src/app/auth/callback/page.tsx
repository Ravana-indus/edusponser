'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function parseParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  // Also parse hash params (Supabase often appends tokens in the hash)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const out: Record<string, string> = {}
  for (const [k, v] of params.entries()) out[k] = v
  for (const [k, v] of hash.entries()) out[k] = v
  return out
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'ready' | 'error'>('processing')
  const [message, setMessage] = useState<string>('Finalizing sign-in...')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [setPwError, setSetPwError] = useState<string | null>(null)

  const params = useMemo(parseParams, [])
  const flowType = (params['type'] || '').toLowerCase() // invite | recovery | magiclink | signup

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        // Importing supabase client with detectSessionInUrl=true should parse tokens automatically
        // Give it a tick to process then check session
        await new Promise((r) => setTimeout(r, 50))
        const { data: sess } = await supabase.auth.getSession()
        if (!sess.session) {
          setStatus('error')
          setMessage('Could not establish session from the link. Please try again or request a new invite.')
          return
        }
        // For invite/recovery, prompt to set password. Otherwise redirect straight away.
        if (flowType === 'invite' || flowType === 'recovery') {
          setStatus('ready')
          setMessage(flowType === 'invite' ? 'Invite verified. Set your password to finish.' : 'Reset your password to finish.')
        } else {
          // Default: send to dashboard/home
          router.replace('/login')
        }
      } catch (e: any) {
        if (!cancelled) {
          setStatus('error')
          setMessage(e?.message || 'Unexpected error while finalizing login')
        }
      }
    }
    run()
    return () => { cancelled = true }
  }, [router, flowType])

  const setPasswordNow = async () => {
    try {
      setSetPwError(null)
      if (!password || password.length < 8) {
        setSetPwError('Password must be at least 8 characters')
        return
      }
      if (password !== confirm) {
        setSetPwError('Passwords do not match')
        return
      }
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setSetPwError(error.message)
        return
      }
      // Done → route to login
      router.replace('/login')
    } catch (e: any) {
      setSetPwError(e?.message || 'Failed to set password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {status === 'processing' && (
          <div className="text-center text-sm text-muted-foreground">{message}</div>
        )}
        {status === 'error' && (
          <div className="space-y-3">
            <div className="text-red-600 text-sm">{message}</div>
            <Button onClick={() => window.location.assign('/login')}>Go to Login</Button>
          </div>
        )}
        {status === 'ready' && (
          <div className="space-y-4">
            <div>
              <div className="text-lg font-semibold mb-1">{flowType === 'invite' ? 'Accept Invite' : 'Reset Password'}</div>
              <div className="text-sm text-muted-foreground">{message}</div>
            </div>
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            {setPwError && <div className="text-sm text-red-600">{setPwError}</div>}
            <Button className="w-full" onClick={setPasswordNow}>Set Password</Button>
          </div>
        )}
      </div>
    </div>
  )
}


