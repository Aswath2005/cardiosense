'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-8 sm:p-10 border-2 backdrop-blur-sm ${
            isHighRisk
              ? 'bg-gradient-to-br from-danger/20 to-danger/5 border-danger'
              : 'bg-gradient-to-br from-success/20 to-success/5 border-success'
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
                <AlertCircle className="w-16 h-16 text-danger" />
              ) : (
                <CheckCircle className="w-16 h-16 text-success" />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4 ${
                isHighRisk
                  ? 'bg-danger/20 text-danger'
                  : 'bg-success/20 text-success'
              }`}
            >
              {isHighRisk ? '⚠️ HIGH RISK' : '✅ LOW RISK'}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isHighRisk ? 'text-danger' : 'text-success'
              }`}
            >
              {isHighRisk ? 'High Cardiovascular Risk' : 'Low Cardiovascular Risk'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-text-muted mb-6"
            >
              {isHighRisk
                ? 'Based on your clinical data, the model indicates elevated cardiovascular risk. Immediate medical consultation is recommended.'
                : 'Based on your clinical data, the model indicates lower cardiovascular risk. Continue with preventive care.'}
            </motion.p>
          </div>

          {/* Probability Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-muted font-semibold">Risk Probability</span>
              <span className={`text-2xl font-bold ${isHighRisk ? 'text-danger' : 'text-success'}`}>
                {probability}%
              </span>
            </div>
            <div className="w-full bg-bg-card rounded-full h-4 overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${probability}%` }}
                transition={{ delay: 0.6, duration: 1.5, ease: 'easeOut' }}
                className={`h-full ${
                  isHighRisk
                    ? 'bg-gradient-to-r from-danger to-danger/50'
                    : 'bg-gradient-to-r from-success to-success/50'
                }`}
              />
            </div>
          </motion.div>

          {/* Recommended Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="font-bold text-text-main mb-4">Recommended Actions</h3>
            <ul className="space-y-3">
              {actions.map((action, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className={`text-lg mt-1 ${isHighRisk ? '⚠️' : '✓'}`} />
                  <span className="text-text-muted">{action}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-bg-card border border-border rounded-lg p-4 mb-6"
          >
            <p className="text-xs text-text-muted">
              <strong>📋 Disclaimer:</strong> This is an educational tool. Always consult with healthcare professionals for medical decisions.
            </p>
          </motion.div>

          {/* Reanalyze Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={onReanalyze}
            className="btn-secondary w-full"
          >
            Try Different Parameters
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
