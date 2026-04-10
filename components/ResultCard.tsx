'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { RiskLevel } from '@/lib/types'

interface ResultCardProps {
  result: RiskLevel
  onReset: () => void
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const isHighRisk = result === 'high'

  const highRiskAdvice = [
    'Schedule a full cardiac evaluation immediately',
    'Monitor blood pressure and cholesterol regularly',
    'Adopt a low-sodium, low-fat diet',
    'Avoid smoking and limit alcohol consumption',
  ]

  const lowRiskAdvice = [
    'Continue regular physical activity (30 min/day)',
    'Maintain a balanced, heart-healthy diet',
    'Schedule annual health checkups',
    'Monitor your blood pressure regularly',
  ]

  const advice = isHighRisk ? highRiskAdvice : lowRiskAdvice
  const riskColor = isHighRisk ? 'danger' : 'success'
  const riskTextColor = isHighRisk ? 'text-danger' : 'text-success'
  const riskBgColor = isHighRisk ? 'bg-red-50' : 'bg-green-50'
  const riskBorderColor = isHighRisk ? 'border-danger' : 'border-success'
  const learnMoreUrl = isHighRisk
    ? 'https://www.who.int/health-topics/cardiovascular-diseases'
    : 'https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
        className={`max-w-2xl mx-auto rounded-3xl p-8 md:p-10 border-2 ${riskBgColor} ${riskBorderColor} shadow-xl`}
      >
        <div className="text-center mb-8">
          {/* Icon */}
          <motion.div
            animate={isHighRisk ? { x: [0, -5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            {isHighRisk ? (
              <AlertCircle size={64} className={riskTextColor} />
            ) : (
              <CheckCircle size={64} className={riskTextColor} />
            )}
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`inline-block px-4 py-2 rounded-full font-semibold text-sm mb-6 ${
              isHighRisk
                ? 'bg-red-200 text-danger'
                : 'bg-green-200 text-success'
            }`}
          >
            {isHighRisk ? '⚠️ HIGH RISK' : '✅ LOW RISK'}
          </motion.div>

          {/* Title */}
          <h3 className={`text-3xl font-bold ${riskTextColor} mb-4`}>
            {isHighRisk
              ? 'High Cardiovascular Risk Detected'
              : 'Low Cardiovascular Risk'}
          </h3>

          {/* Message */}
          <p className="text-text-muted text-lg mb-8 leading-relaxed">
            {isHighRisk
              ? 'Based on your inputs, our model predicts an elevated risk of heart disease. Please consult a cardiologist as soon as possible.'
              : "Your inputs suggest a lower risk of heart disease. Keep up your healthy lifestyle!"}
          </p>
        </div>

        {/* Advice List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ul className="space-y-3">
            {advice.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    isHighRisk ? 'bg-danger' : 'bg-success'
                  }`}
                />
                <span className="text-text-main">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg ${
              isHighRisk
                ? 'bg-danger text-white hover:scale-105'
                : 'bg-success text-white hover:scale-105'
            }`}
          >
            {isHighRisk ? 'Learn More →' : 'Healthy Heart Tips →'}
          </a>

          <button
            onClick={onReset}
            className="px-8 py-3 rounded-xl font-semibold text-text-main border-2 border-text-main hover:bg-text-main hover:text-white transition-all duration-300"
          >
            Re-analyze →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
