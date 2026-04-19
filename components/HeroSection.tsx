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
    <section id="home" className="min-h-screen bg-gradient-to-br from-bg-main to-bg-section pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-accent rounded-full px-4 py-2 w-fit"
            >
              <span className="text-sm">🔬 AI-Powered · Logistic Regression · 85% Accuracy</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-playfair text-5xl md:text-6xl font-bold text-text-main leading-tight"
            >
              Predict Your Heart Attack Risk with AI
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-text-muted max-w-md"
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
              <div className="bg-white rounded-2xl px-6 py-4 border border-border">
                <div className="text-3xl font-bold text-accent">{count1}</div>
                <div className="text-sm text-text-muted">Patients in Dataset</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 border border-border">
                <div className="text-3xl font-bold text-accent">{count2}%</div>
                <div className="text-sm text-text-muted">Model Accuracy</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 border border-border">
                <div className="text-3xl font-bold text-accent">{count3}</div>
                <div className="text-sm text-text-muted">Health Parameters</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href="#predict"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold rounded-2xl px-8 py-4 hover:scale-105 transition-transform duration-300"
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
            {/* Animated Heart */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-9xl filter drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              💓
            </motion.div>

            {/* ECG Waveform (animated SVG placeholder) */}
            <motion.svg
              className="absolute bottom-0 w-full h-24 opacity-30"
              viewBox="0 0 400 100"
              preserveAspectRatio="none"
              animate={{ x: [-400, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            >
              <path
                d="M 0 50 Q 20 30, 40 50 T 80 50 T 120 50 T 160 30 T 200 50 T 240 50 T 280 50 T 320 30 T 360 50 T 400 50"
                stroke="#2563EB"
                strokeWidth="2"
                fill="none"
              />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
