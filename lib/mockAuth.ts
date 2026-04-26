/**
 * CardioSense — Mock Auth Hook for Local Development
 * Use this when Supabase is unreachable (network/firewall issues)
 * This is a temporary development-only solution
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface MockAuthUser {
  id: string
  email: string
}

export function useMockAuth() {
  const [user, setUser] = useState<MockAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check localStorage for mock user
    const storedUser = localStorage.getItem('mock_auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('mock_auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const mockSignUp = async (email: string, password: string, fullName: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Store user credentials in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('mock_auth_users') || '{}')
    
    if (storedUsers[email]) {
      throw new Error('Email already registered')
    }

    const mockUserId = `mock_${Date.now()}`
    storedUsers[email] = {
      id: mockUserId,
      password,
      fullName,
    }

    localStorage.setItem('mock_auth_users', JSON.stringify(storedUsers))

    const mockUser: MockAuthUser = {
      id: mockUserId,
      email,
    }

    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const mockSignIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!email || !password) {
      throw new Error('Email and password required')
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Retrieve stored user credentials
    const storedUsers = JSON.parse(localStorage.getItem('mock_auth_users') || '{}')
    
    if (!storedUsers[email]) {
      throw new Error('Invalid email or password')
    }

    // Verify password matches
    if (storedUsers[email].password !== password) {
      throw new Error('Invalid email or password')
    }

    const mockUser: MockAuthUser = {
      id: storedUsers[email].id,
      email,
    }

    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const mockSignOut = () => {
    localStorage.removeItem('mock_auth_user')
    setUser(null)
  }

  return {
    user,
    isLoading,
    signUp: mockSignUp,
    signIn: mockSignIn,
    signOut: mockSignOut,
  }
}
