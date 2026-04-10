'use client'

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export default function AboutSection() {
  const models = [
    {
      icon: '🌲',
      name: 'Random Forest',
      description:
        'An ensemble of 100 decision trees using majority voting. Handles imbalanced data with exceptional resilience.',
      accuracy: '84%',
      isBest: false,
    },
    {
      icon: '👥',
      name: 'K-Nearest Neighbors',
      description:
        'Classifies using k=5 nearest neighbors via Euclidean distance. Simple yet the most accurate model.',
      accuracy: '92%',
      isBest: true,
    },
    {
      icon: '📐',
      name: 'Support Vector Machine',
      description:
        'Finds the optimal hyperplane using RBF kernel. Achieved the highest ROC-AUC score of 93%.',
      accuracy: '87%',
      isBest: false,
    },
    {
      icon: '🧠',
      name: 'Deep Learning (CNN)',
      description:
        'Sequential model built with TensorFlow/Keras. 64→32→16→1 neurons, ReLU + Sigmoid, 50 epochs.',
      accuracy: '87%',
      isBest: false,
    },
  ]

  const steps = [
    'Input Health Data',
    'Preprocessing',
    'KNN Model',
    'Risk Prediction',
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-text-main mb-4">
            About This Project
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Built by Team PulseML as a mini research project, CardioSense AI compares multiple machine learning approaches for cardiovascular risk prediction.
          </p>
        </motion.div>

        {/* Model Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {models.map((model) => (
            <motion.div
              key={model.name}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="relative bg-white border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow"
            >
              {/* Badge for Best Model */}
              {model.isBest && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                  <Award size={14} />
                  Best Model 🏆
                </div>
              )}

              <div className="text-5xl mb-4">{model.icon}</div>
              <h3 className="text-xl font-bold text-text-main mb-3">{model.name}</h3>
              <p className="text-text-muted text-sm mb-6 leading-relaxed">
                {model.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Accuracy</span>
                <span className="text-2xl font-bold text-accent">{model.accuracy}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-section rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-text-main mb-8 text-center">
            How It Works
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center flex-1 w-full md:w-auto"
              >
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-accent text-white font-bold flex items-center justify-center text-lg mb-3">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-text-main text-center">
                    {step}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <motion.div
                    animate={{ scaleX: [0, 1] }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="hidden md:block h-1 flex-1 bg-gradient-to-r from-accent to-transparent ml-4"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
