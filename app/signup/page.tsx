'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useMockAuth } from '@/lib/mockAuth'

export default function SignupPage() {
  const router = useRouter()
  const mockAuth = useMockAuth()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usingMockAuth, setUsingMockAuth] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Already authenticated - redirect to home
        router.push('/')
        return
      }
      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [router])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (authError) {
        throw authError
      }

      // Success
      setIsLoading(false)
      setSuccess('Account created! Redirecting to home page...')
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Redirect to home after a delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      // Fallback to mock auth if Supabase fails (e.g., network issues)
      console.warn('Supabase signup failed, using mock auth for development:', err)
      setUsingMockAuth(true)

      try {
        await mockAuth.signUp(email, password, name)
        setIsLoading(false)
        setSuccess('✓ Account created (DEV MODE). Redirecting...')
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')

        setTimeout(() => {
          router.push('/')
        }, 2000)
      } catch (mockErr) {
        setIsLoading(false)
        setError(mockErr instanceof Error ? mockErr.message : 'Sign up failed')
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-bg-card rounded-3xl shadow-2xl p-10 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">💓</div>
            <h1 className="text-3xl font-bold font-playfair gradient-text mb-2">
              CardioSense
            </h1>
            <p className="text-text-muted text-sm">Create your account</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-8" />

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-danger/20 border border-danger rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-danger text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-success/20 border border-success rounded-lg flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-success text-sm">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-main mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-main mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-bg-main border border-border text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl bg-accent text-bg-main font-medium hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up →
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom Links */}
          <div className="mt-8 space-y-3 text-center text-sm">
            <p className="text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline font-medium">
                Sign In
              </Link>
            </p>
            <Link href="/" className="block text-text-muted hover:text-accent transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
