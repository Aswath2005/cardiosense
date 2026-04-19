'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function ResultsSection() {
  const metrics = [
    { label: 'Precision', value: 86, icon: '🎯' },
    { label: 'Recall', value: 81, icon: '📍' },
    { label: 'F1-Score', value: 83, icon: '⚖️' },
    { label: 'AUC-ROC', value: 89, icon: '📈' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#2563EB]" />
            <h2 className="text-4xl font-bold text-[#0F172A]" style={{ fontFamily: 'Playfair Display' }}>
              Model Performance
            </h2>
          </div>
          <p className="text-lg text-[#64748B]" style={{ fontFamily: 'Inter' }}>
            Logistic Regression trained on Cleveland Heart Disease dataset (303 patients, 13 features)
          </p>
        </motion.div>

        {/* Training & Test Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Training Accuracy */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-[#2563EB]">
            <p className="text-[#64748B] text-sm font-semibold mb-3" style={{ fontFamily: 'Inter' }}>
              TRAINING ACCURACY
            </p>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-[#2563EB] mb-4">83.51%</div>
              <div className="w-full h-4 bg-blue-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '83.51%' }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#1A3C6E]"
                />
              </div>
            </motion.div>
          </div>

          {/* Test Accuracy */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-[#10B981]">
            <p className="text-[#64748B] text-sm font-semibold mb-3" style={{ fontFamily: 'Inter' }}>
              TEST ACCURACY
            </p>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-[#10B981] mb-4">81.97%</div>
              <div className="w-full h-4 bg-green-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '81.97%' }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#059669]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              className="bg-[#F8FAFF] rounded-xl p-6 border border-[#E2E8F0] hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{metric.icon}</div>
              <p className="text-[#64748B] text-sm mb-2" style={{ fontFamily: 'Inter' }}>
                {metric.label}
              </p>
              <motion.div
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl font-bold text-[#2563EB]">{metric.value}%</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dataset Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#F8FAFF] to-[#EEF2FF] rounded-2xl p-8 border border-[#E2E8F0]"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" />
            <h3 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Playfair Display' }}>
              Dataset Overview
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-5xl font-bold text-[#2563EB] mb-2"
              >
                303
              </motion.p>
              <p className="text-[#64748B]" style={{ fontFamily: 'Inter' }}>
                Total Patients
              </p>
            </div>

            <div className="text-center">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-5xl font-bold text-[#2563EB] mb-2"
              >
                13
              </motion.p>
              <p className="text-[#64748B]" style={{ fontFamily: 'Inter' }}>
                Clinical Features
              </p>
            </div>

            <div className="text-center">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-5xl font-bold text-[#2563EB] mb-2"
              >
                ~85%
              </motion.p>
              <p className="text-[#64748B]" style={{ fontFamily: 'Inter' }}>
                Overall Accuracy
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E2E8F0]">
            <p className="text-sm text-[#0F172A]" style={{ fontFamily: 'Inter' }}>
              <strong>Dataset:</strong> Cleveland Heart Disease dataset from UC Irvine Machine Learning Repository. The model
              uses 13 clinical features including age, sex, chest pain type, resting blood pressure, cholesterol, fasting blood sugar,
              resting ECG, maximum heart rate, exercise-induced angina, ST depression, ST slope, number of major vessels, and
              thalassemia type.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
