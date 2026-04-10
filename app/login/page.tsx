'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/AuthContext'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { name, email, password } = formData

      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      if (isSignUp && !name) {
        throw new Error('Name is required for sign up')
      }

      await login(email, password, name || email.split('@')[0])

      // Redirect to dashboard after successful login
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-main via-bg-main to-bg-section flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl"
            >
              💓
            </motion.div>
            <h1 className="font-playfair text-4xl font-bold text-primary">
              CardioSense AI
            </h1>
          </div>
          <p className="text-text-muted text-sm">
            Early detection saves lives. Know your heart before it's too late.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-8 bg-bg-section rounded-xl p-1">
            <button
              onClick={() => {
                setIsSignUp(false)
                setError('')
                setFormData({ name: '', email: '', password: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                !isSignUp
                  ? 'bg-accent text-white shadow-md'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsSignUp(true)
                setError('')
                setFormData({ name: '', email: '', password: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                isSignUp
                  ? 'bg-accent text-white shadow-md'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-3.5 text-text-muted"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="text-sm font-medium text-text-muted mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-text-muted"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-text-muted mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-text-muted"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-danger rounded-lg text-danger text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting || isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Login to Dashboard'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-blue-50 border border-accent/30 rounded-xl"
          >
            <p className="text-xs text-text-muted mb-2 font-semibold">
              📝 Demo Credentials (for testing):
            </p>
            <p className="text-xs text-text-muted mb-1">
              Email: <span className="font-mono text-text-main">demo@cardiosense.com</span>
            </p>
            <p className="text-xs text-text-muted">
              Password: <span className="font-mono text-text-main">demo123</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-text-muted text-xs mt-8"
        >
          <span className="italic">
            Educational app for heart disease risk prediction. No real data stored.
          </span>
        </motion.p>
      </motion.div>
    </div>
  )
}
