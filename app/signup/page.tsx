'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useMockAuth } from '@/lib/mockAuth'

interface PasswordStrength {
  score: number // 0-4
  level: 'weak' | 'fair' | 'good' | 'strong'
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumbers: boolean
  hasSpecialChars: boolean
  isLongEnough: boolean
}

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
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null)

  const evaluatePasswordStrength = (pwd: string): PasswordStrength => {
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumbers = /[0-9]/.test(pwd)
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    const isLongEnough = pwd.length >= 8

    let score = 0
    if (hasLowerCase) score++
    if (hasUpperCase) score++
    if (hasNumbers) score++
    if (hasSpecialChars) score++
    if (isLongEnough) score++

    let level: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
    if (score >= 4) level = 'strong'
    else if (score === 3) level = 'good'
    else if (score === 2) level = 'fair'
    else level = 'weak'

    return {
      score: Math.min(score, 4),
      level,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChars,
      isLongEnough,
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value
    setPassword(pwd)
    if (pwd.length > 0) {
      setPasswordStrength(evaluatePasswordStrength(pwd))
    } else {
      setPasswordStrength(null)
    }
  }

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

    if (!passwordStrength || passwordStrength.level === 'weak' || passwordStrength.level === 'fair') {
      setError('Password is too weak. Please use uppercase, lowercase, numbers, and special characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/`, // Skip email confirmation
        },
      })

      if (authError) {
        throw authError
      }

      // Store user profile in database (skip email confirmation requirement)
      if (authData.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email,
          full_name: name,
          created_at: new Date(),
        })

        if (profileError) {
          console.error('❌ Failed to store user profile:', profileError)
          console.error('Error code:', profileError.code)
          console.error('Error message:', profileError.message)
          // Don't throw - user is still authenticated, we just warned them
        } else {
          console.log('✅ User profile saved to database')
        }

        // Record login event
        try {
          const loginResponse = await fetch('/api/auth/login-record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: authData.user.id,
              email,
              authMethod: 'email',
            }),
          })

          if (loginResponse.ok) {
            console.log('✅ Login recorded')
          } else {
            console.warn('⚠️  Failed to record login')
          }
        } catch (loginError) {
          console.warn('⚠️  Could not record login:', loginError)
        }
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
                  onChange={handlePasswordChange}
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

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 space-y-2"
                >
                  {/* Strength Bar */}
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full transition-colors ${
                          index < passwordStrength.score
                            ? passwordStrength.level === 'strong'
                              ? 'bg-success'
                              : passwordStrength.level === 'good'
                              ? 'bg-accent'
                              : 'bg-warning'
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Strength Label and Icon */}
                  <div className="flex items-center gap-2">
                    <Zap
                      size={16}
                      className={`${
                        passwordStrength.level === 'strong'
                          ? 'text-success'
                          : passwordStrength.level === 'good'
                          ? 'text-accent'
                          : 'text-warning'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength.level === 'strong'
                          ? 'text-success'
                          : passwordStrength.level === 'good'
                          ? 'text-accent'
                          : 'text-warning'
                      }`}
                    >
                      Strength: {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                    </span>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          passwordStrength.hasLowerCase ? 'bg-success' : 'bg-border'
                        }`}
                      >
                        {passwordStrength.hasLowerCase && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className={passwordStrength.hasLowerCase ? 'text-success' : 'text-text-muted'}>
                        Lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          passwordStrength.hasUpperCase ? 'bg-success' : 'bg-border'
                        }`}
                      >
                        {passwordStrength.hasUpperCase && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className={passwordStrength.hasUpperCase ? 'text-success' : 'text-text-muted'}>
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          passwordStrength.hasNumbers ? 'bg-success' : 'bg-border'
                        }`}
                      >
                        {passwordStrength.hasNumbers && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className={passwordStrength.hasNumbers ? 'text-success' : 'text-text-muted'}>
                        Number
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          passwordStrength.hasSpecialChars ? 'bg-success' : 'bg-border'
                        }`}
                      >
                        {passwordStrength.hasSpecialChars && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className={passwordStrength.hasSpecialChars ? 'text-success' : 'text-text-muted'}>
                        Special character
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          passwordStrength.isLongEnough ? 'bg-success' : 'bg-border'
                        }`}
                      >
                        {passwordStrength.isLongEnough && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className={passwordStrength.isLongEnough ? 'text-success' : 'text-text-muted'}>
                        At least 8 characters
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
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
