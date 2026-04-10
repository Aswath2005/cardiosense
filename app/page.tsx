'use client'

import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Shield, Zap, Globe } from 'lucide-react'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description:
        'Advanced machine learning trained on 303 real patient cases for accurate risk assessment.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy-First Design',
      description:
        'Your health data stays with you. No databases, no tracking. All processing happens locally.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Results',
      description:
        'Get real-time risk predictions and personalized health recommendations in seconds.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Fully Responsive',
      description:
        'Access CardioSense AI on any device. Works seamlessly on mobile, tablet, and desktop.',
    },
  ]

  const stats = [
    { value: '92%', label: 'Model Accuracy' },
    { value: '303', label: 'Patients Trained' },
    { value: '4', label: 'ML Models' },
    { value: '13', label: 'Health Parameters' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-main via-bg-main to-bg-section">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💓</span>
            <span className="font-playfair font-bold text-primary hidden sm:inline">
              CardioSense AI
            </span>
          </div>
          <a
            href="/login"
            className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Login
          </a>
        </div>
      </motion.nav>

      <div className="pt-20">
        {/* Hero Section */}
        <section className="px-6 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-playfair text-5xl md:text-6xl font-bold text-text-main mb-6 leading-tight">
                  Predict Your Heart Attack Risk with AI
                </h1>
                <p className="text-lg text-text-muted mb-8 leading-relaxed">
                  Early detection saves lives. CardioSense AI uses advanced machine learning to
                  assess your cardiovascular risk based on 13 health parameters. Know your heart
                  before it's too late.
                </p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight size={20} />
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-text-main text-text-main font-semibold rounded-xl hover:bg-text-main hover:text-white transition-all duration-300"
                  >
                    Learn More
                  </a>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-4 mt-12"
                >
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-border">
                      <div className="text-2xl font-bold text-accent">{stat.value}</div>
                      <div className="text-sm text-text-muted">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative w-full max-w-sm aspect-square"
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter id="glow2">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d="M50 85 C20 70 5 55 5 40 C5 25 15 15 25 15 C32 15 38 18 50 28 C62 18 68 15 75 15 C85 15 95 25 95 40 C95 55 80 70 50 85 Z"
                      fill="#2563EB"
                      filter="url(#glow2)"
                      opacity="0.8"
                    />
                  </svg>

                  {/* Floating Cards */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-8 right-0 bg-white rounded-lg shadow-lg p-4 border border-border text-sm font-semibold"
                  >
                    <div className="text-success">✅ Accurate</div>
                    <div className="text-xs text-text-muted">92% Precision</div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-4 border border-border text-sm font-semibold"
                  >
                    <div className="text-primary">🔒 Private</div>
                    <div className="text-xs text-text-muted">No Data Stored</div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-text-main mb-4">
                Why Choose CardioSense AI?
              </h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto">
                A privacy-first, AI-powered platform for cardiovascular risk assessment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-bg-section rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="text-accent mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-text-main mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-accent to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Assess Your Heart Risk?
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Early detection saves lives. Take the first step toward better heart health with
                AI-powered risk assessment.
              </p>
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-accent font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Login Now
                <ArrowRight size={20} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-6 py-12 bg-white border-t border-border"
        >
          <div className="max-w-7xl mx-auto text-center text-text-muted text-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">💓</span>
              <span className="font-playfair font-bold text-text-main">CardioSense AI</span>
            </div>
            <p className="mb-2">Built by Team PulseML</p>
            <p className="italic text-xs">
              Educational tool for cardiovascular risk assessment. Not a substitute for professional
              medical advice.
            </p>
            <p className="mt-4 text-xs">
              © 2025 Team PulseML. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
