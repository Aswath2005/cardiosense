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
    <section id="results" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg-main to-bg-section relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold gradient-text font-playfair">
              Model Performance
            </h2>
          </div>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
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
          <motion.div
            whileHover={{ y: -5, borderColor: 'rgba(0, 212, 255, 0.8)' }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border border-primary/40 backdrop-blur-sm transition-all"
          >
            <p className="text-text-muted text-sm font-semibold mb-3 uppercase tracking-wide">
              Training Accuracy
            </p>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-primary mb-4">83.51%</div>
              <div className="w-full h-4 bg-bg-card rounded-full overflow-hidden border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '83.51%' }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-primary to-accent-alt"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Test Accuracy */}
          <motion.div
            whileHover={{ y: -5, borderColor: 'rgba(0, 217, 102, 0.8)' }}
            className="bg-gradient-to-br from-success/20 to-success/5 rounded-2xl p-8 border border-success/40 backdrop-blur-sm transition-all"
          >
            <p className="text-text-muted text-sm font-semibold mb-3 uppercase tracking-wide">
              Test Accuracy
            </p>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-success mb-4">81.97%</div>
              <div className="w-full h-4 bg-bg-card rounded-full overflow-hidden border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '81.97%' }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-success to-success/60"
                />
              </div>
            </motion.div>
          </motion.div>
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
              whileHover={{ y: -8, borderColor: 'rgba(0, 212, 255, 0.8)' }}
              className="card-dark group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{metric.icon}</div>
              <p className="text-text-muted text-sm mb-2 uppercase tracking-wide">
                {metric.label}
              </p>
              <motion.div
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl font-bold gradient-text">{metric.value}%</p>
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
          className="card-dark bg-gradient-to-br from-bg-card to-bg-section"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold text-text-main font-playfair">
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
                className="text-5xl font-bold gradient-text mb-2"
              >
                303
              </motion.p>
              <p className="text-text-muted">
                Total Patients
              </p>
            </div>

            <div className="text-center">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-5xl font-bold gradient-text mb-2"
              >
                13
              </motion.p>
              <p className="text-text-muted">
                Clinical Features
              </p>
            </div>

            <div className="text-center">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-5xl font-bold gradient-text mb-2"
              >
                ~85%
              </motion.p>
              <p className="text-text-muted">
                Overall Accuracy
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-text-muted leading-relaxed">
              <strong className="text-primary">📊 Dataset Information:</strong> Cleveland Heart Disease dataset from UC Irvine Machine Learning Repository. The model
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
