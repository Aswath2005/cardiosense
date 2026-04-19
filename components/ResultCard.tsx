'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface ResultCardProps {
  result: {
    risk: 'high' | 'low';
    probability: number;
  };
  onReanalyze: () => void;
}

export default function ResultCard({ result, onReanalyze }: ResultCardProps) {
  const isHighRisk = result.risk === 'high';
  const probability = Math.round(result.probability * 100);

  const highRiskActions = [
    'Schedule a comprehensive cardiac evaluation with a cardiologist',
    'Monitor and manage blood pressure and cholesterol levels',
    'Adopt a low-sodium, heart-healthy diet rich in fruits and vegetables',
    'Engage in regular physical activity and stress management techniques',
  ];

  const lowRiskActions = [
    'Maintain regular physical activity at least 150 minutes per week',
    'Continue eating a balanced diet rich in fruits, vegetables, and whole grains',
    'Schedule annual check-ups with your primary care physician',
    'Monitor blood pressure and cholesterol levels regularly',
  ];

  const actions = isHighRisk ? highRiskActions : lowRiskActions;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EEF2FF] to-[#F8FAFF]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-8 sm:p-10 border-2 shadow-xl ${
            isHighRisk
              ? 'bg-red-50 border-[#EF4444]'
              : 'bg-green-50 border-[#10B981]'
          }`}
        >
          {/* Icon and Badge */}
          <div className="text-center mb-8">
            <motion.div
              animate={isHighRisk ? { y: [0, -8, 0] } : { scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-4"
            >
              {isHighRisk ? (
                <AlertCircle className="w-16 h-16 text-[#EF4444]" />
              ) : (
                <CheckCircle className="w-16 h-16 text-[#10B981]" />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4 ${
                isHighRisk
                  ? 'bg-red-100 text-[#EF4444]'
                  : 'bg-green-100 text-[#10B981]'
              }`}
              style={{ fontFamily: 'Inter' }}
            >
              {isHighRisk ? '⚠️ HIGH RISK' : '✅ LOW RISK'}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isHighRisk ? 'text-[#EF4444]' : 'text-[#10B981]'
              }`}
              style={{ fontFamily: 'Playfair Display' }}
            >
              {isHighRisk ? 'High Cardiovascular Risk' : 'Low Cardiovascular Risk'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-[#64748B] mb-6"
              style={{ fontFamily: 'Inter' }}
            >
              {isHighRisk
                ? 'Based on your clinical data, the model indicates elevated cardiovascular risk. Immediate medical consultation is recommended.'
                : 'Based on your clinical data, the model indicates lower cardiovascular risk. Continue with preventive care.'}
            </motion.p>
          </div>

          {/* Probability Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#0F172A]" style={{ fontFamily: 'Inter' }}>
                Risk Probability
              </span>
              <span
                className={`font-bold text-lg ${
                  isHighRisk ? 'text-[#EF4444]' : 'text-[#10B981]'
                }`}
                style={{ fontFamily: 'Inter' }}
              >
                {probability}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${probability}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${
                  isHighRisk ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                }`}
              />
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3
              className="font-semibold text-[#0F172A] mb-4 text-lg"
              style={{ fontFamily: 'Inter' }}
            >
              Recommended Actions:
            </h3>
            <ul className="space-y-3">
              {actions.map((action, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full mt-0.5 flex items-center justify-center text-white text-xs font-bold ${
                      isHighRisk ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-[#0F172A]" style={{ fontFamily: 'Inter' }}>
                    {action}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-8"
          >
            <p className="text-sm text-[#0F172A]" style={{ fontFamily: 'Inter' }}>
              <strong>⚠️ Medical Disclaimer:</strong> This prediction is for educational purposes only and should not
              replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis
              and treatment.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={onReanalyze}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                isHighRisk
                  ? 'bg-[#EF4444] text-white hover:shadow-lg'
                  : 'bg-[#10B981] text-white hover:shadow-lg'
              }`}
              style={{ fontFamily: 'Inter' }}
            >
              New Assessment
            </motion.button>

            <motion.a
              href="https://www.heart.org/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg font-semibold text-[#0F172A] border-2 border-[#2563EB] text-center hover:bg-[#2563EB] hover:text-white transition-all"
              style={{ fontFamily: 'Inter' }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
