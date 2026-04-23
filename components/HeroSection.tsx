'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [count3, setCount3] = useState(0)

  // Count-up animation
  useEffect(() => {
    const animateCount = (setter: (val: number) => void, target: number) => {
      let current = 0
      const increment = Math.ceil(target / 50)
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(current)
        }
      }, 30)
    }

    animateCount(setCount1, 303)
    animateCount(setCount2, 85)
    animateCount(setCount3, 13)
  }, [])

  return (
    <section id="home" className="min-h-screen relative bg-gradient-to-b from-bg-main via-bg-section to-bg-main pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Animated gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-alt/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 sm:gap-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent-alt/20 border border-primary/50 rounded-full px-3 sm:px-4 py-2 w-fit backdrop-blur-sm"
            >
              <span className="text-xs sm:text-sm text-primary font-semibold">🔬 AI-Powered · Logistic Regression · 85% Accuracy</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-main leading-tight"
            >
              Predict Your
              <span className="gradient-text block">Heart Attack Risk</span>
              with ML
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-text-muted max-w-md leading-relaxed"
            >
              Built on the Cleveland Heart Disease dataset (303 patients). Input your health parameters and get an instant cardiovascular risk assessment powered by Logistic Regression.
            </motion.p>

            {/* Stats Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 flex-wrap"
            >
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(0, 212, 255, 1)' }}
                className="bg-gradient-to-br from-bg-card to-bg-section border border-border rounded-2xl px-6 py-4 backdrop-blur-sm transition-all"
              >
                <div className="text-3xl font-bold gradient-text">{count1}</div>
                <div className="text-sm text-text-muted">Patients in Dataset</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(0, 212, 255, 1)' }}
                className="bg-gradient-to-br from-bg-card to-bg-section border border-border rounded-2xl px-6 py-4 backdrop-blur-sm transition-all"
              >
                <div className="text-3xl font-bold gradient-text">{count2}%</div>
                <div className="text-sm text-text-muted">Model Accuracy</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(0, 212, 255, 1)' }}
                className="bg-gradient-to-br from-bg-card to-bg-section border border-border rounded-2xl px-6 py-4 backdrop-blur-sm transition-all"
              >
                <div className="text-3xl font-bold gradient-text">{count3}</div>
                <div className="text-sm text-text-muted">Health Parameters</div>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href="#predict"
                className="btn-primary inline-flex items-center justify-center gap-2 w-fit"
              >
                Check Your Risk Now →
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Heart Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 flex items-center justify-center"
          >
            {/* Animated Pulse Rings */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute w-64 h-64 rounded-full border-2 border-primary/30"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute w-80 h-80 rounded-full border-2 border-accent-alt/30"
            />

            {/* Animated Heart */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-9xl z-10 glow float"
            >
              💓
            </motion.div>

            {/* ECG Waveform (animated SVG) */}
            <motion.svg
              className="absolute bottom-0 w-full h-24 opacity-40"
              viewBox="0 0 400 100"
              preserveAspectRatio="none"
              animate={{ x: [-400, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            >
              <path
                d="M 0 50 Q 20 30, 40 50 T 80 50 T 120 50 T 160 30 T 200 50 T 240 50 T 280 50 T 320 30 T 360 50 T 400 50"
                stroke="#00D4FF"
                strokeWidth="2"
                fill="none"
                className="ecg-line"
              />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
