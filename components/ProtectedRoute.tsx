'use client'

import { useAuth } from './AuthContext'
import { useMockAuth } from '@/lib/mockAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const mockAuth = useMockAuth()
  const router = useRouter()
  const [hasSupabaseSession, setHasSupabaseSession] = useState(false)
  const [isSessionChecked, setIsSessionChecked] = useState(false)

  useEffect(() => {
    const checkSupabaseSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setHasSupabaseSession(Boolean(session))
      } catch {
        setHasSupabaseSession(false)
      } finally {
        setIsSessionChecked(true)
      }
    }

    checkSupabaseSession()
  }, [])

  useEffect(() => {
    // Wait for both auth systems to load
    if (isLoading || mockAuth.isLoading || !isSessionChecked) {
      return
    }

    // Check if user is authenticated via mock auth, AuthContext, or Supabase session
    const isMockAuthenticatedUser = mockAuth.user !== null
    const isAuthContextAuthenticatedUser = isAuthenticated
    const isSupabaseAuthenticatedUser = hasSupabaseSession

    if (!isMockAuthenticatedUser && !isAuthContextAuthenticatedUser && !isSupabaseAuthenticatedUser) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, mockAuth.user, mockAuth.isLoading, hasSupabaseSession, isSessionChecked, router])

  // Show loading while checking auth
  if (isLoading || mockAuth.isLoading || !isSessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // If neither auth method says they're authenticated, don't render
  if (!isAuthenticated && !mockAuth.user && !hasSupabaseSession) {
    return null
  }

  return <>{children}</>
}
