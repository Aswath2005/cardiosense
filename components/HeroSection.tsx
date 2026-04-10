'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [patientsCount, setPatientsCount] = useState(0)
  const [accuracyCount, setAccuracyCount] = useState(0)
  const [modelsCount, setModelsCount] = useState(0)

  useEffect(() => {
    const animateCount = (
      target: number,
      setter: (value: number) => void,
      duration: number = 2000
    ) => {
      let start = 0
      const increment = target / (duration / 16)
      const interval = setInterval(() => {
        start += increment
        if (start >= target) {
          setter(target)
          clearInterval(interval)
        } else {
          setter(Math.floor(start))
        }
      }, 16)
    }

    const timer = setTimeout(() => {
      animateCount(303, setPatientsCount)
      animateCount(92, setAccuracyCount)
      animateCount(4, setModelsCount)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section
      id="home"
      className="pt-32 pb-20 px-6 bg-gradient-to-b from-bg-main via-bg-main to-bg-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6"
            >
              <span>🔬</span>
              <span className="text-sm font-medium">AI-Powered Cardiology Tool</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main mb-6 leading-tight"
            >
              Predict your heart disease risk
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-text-muted mb-8 leading-relaxed"
            >
              Enter your health parameters and our KNN model — trained on 303 real patients — assesses your cardiovascular risk with 92% accuracy.
            </motion.p>

            {/* Stats Pills */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-4 border border-border shadow-sm"
              >
                <div className="text-3xl font-bold text-primary">🫀</div>
                <div className="text-2xl font-bold text-text-main mt-2">{patientsCount}</div>
                <div className="text-sm text-text-muted">Patients Trained On</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-4 border border-border shadow-sm"
              >
                <div className="text-3xl font-bold">🎯</div>
                <div className="text-2xl font-bold text-text-main mt-2">{accuracyCount}%</div>
                <div className="text-sm text-text-muted">Model Accuracy</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-4 border border-border shadow-sm"
              >
                <div className="text-3xl font-bold">⚡</div>
                <div className="text-2xl font-bold text-text-main mt-2">{modelsCount}</div>
                <div className="text-sm text-text-muted">ML Models Compared</div>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <a
                href="#predict"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 w-fit"
              >
                Check Your Risk Now
                <ArrowRight size={20} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center relative"
          >
            <div className="relative w-full aspect-square max-w-sm">
              {/* Pulsing Heart SVG */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="glow">
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
                    filter="url(#glow)"
                    opacity="0.8"
                  />
                </svg>
              </motion.div>

              {/* Floating Model Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 left-0 bg-white rounded-lg shadow-lg p-3 border border-border text-xs font-semibold text-success"
              >
                KNN: 92% ✅
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                className="absolute top-1/3 right-0 bg-white rounded-lg shadow-lg p-3 border border-border text-xs font-semibold text-text-main"
              >
                SVM: 87%
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                className="absolute bottom-1/4 left-1/4 bg-white rounded-lg shadow-lg p-3 border border-border text-xs font-semibold text-text-main"
              >
                RF: 84%
              </motion.div>

              {/* ECG Line */}
              <svg
                className="absolute bottom-0 left-0 right-0 w-full h-24 ecg-line"
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,50 20,50 25,30 30,70 35,50 50,50 60,50 65,40 70,60 75,50 100,50 110,50 115,35 120,65 125,50 150,50 160,50 165,45 170,55 175,50 200,50 210,50 215,40 220,60 225,50 250,50 260,50 265,38 270,62 275,50 300,50 310,50 315,42 320,58 325,50 350,50 360,50 365,45 370,55 375,50 400,50"
                  stroke="#2563EB"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
