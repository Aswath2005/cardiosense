'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useMockAuth } from '@/lib/mockAuth'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const mockAuth = useMockAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check mock auth first
        if (!mockAuth.isLoading) {
          if (mockAuth.user) {
            setIsAuthorized(true)
            setIsLoading(false)
            return
          }
        }

        // Then check Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // Not authenticated with either method
        router.push('/login')
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    // Wait for mock auth to load
    if (!mockAuth.isLoading) {
      checkAuth()
    }
  }, [router, mockAuth.isLoading, mockAuth.user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
