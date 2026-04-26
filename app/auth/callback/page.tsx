'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session after OAuth redirect
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // Session established successfully
          console.log('OAuth login successful')

          // Record OAuth login
          if (data.session.user) {
            const provider = data.session.user.app_metadata?.provider || 'unknown'
            try {
              const loginResponse = await fetch('/api/auth/login-record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: data.session.user.id,
                  email: data.session.user.email,
                  authMethod: provider,
                }),
              })

              if (loginResponse.ok) {
                console.log('✅ OAuth login recorded')
              } else {
                console.warn('⚠️  Failed to record OAuth login')
              }
            } catch (loginError) {
              console.warn('⚠️  Could not record OAuth login:', loginError)
            }
          }

          router.push('/dashboard')
        } else {
          // No session after callback
          router.push('/login?error=no_session')
        }
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/login?error=callback_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-text-muted">Completing sign in...</p>
      </div>
    </div>
  )
}
