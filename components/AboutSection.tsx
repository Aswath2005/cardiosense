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
    <section id="about" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-bg-main to-bg-section relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-text-main mb-4">
            <span className="gradient-text">About This Project</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            CardioSense is an open-source project that uses machine learning to predict cardiovascular disease risk and save lives.
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
              whileHover={{ y: -8, borderColor: 'rgba(0, 212, 255, 0.8)' }}
              className="relative card-dark group"
            >
              {/* Badge for Best Model */}
              {model.isBest && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary to-accent-alt text-bg-main rounded-full text-xs font-semibold shadow-glow"
                >
                  <Award size={14} />
                  Best Model 🏆
                </motion.div>
              )}

              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{model.icon}</div>
              <h3 className="text-xl font-bold text-text-main mb-3">{model.name}</h3>
              <p className="text-text-muted text-sm mb-6 leading-relaxed">
                {model.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-text-muted">Accuracy</span>
                <span className="text-2xl font-bold gradient-text">{model.accuracy}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-dark bg-gradient-to-br from-bg-card to-bg-section"
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
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-alt text-text-main font-bold flex items-center justify-center text-lg mb-3 shadow-glow"
                  >
                    {index + 1}
                  </motion.div>
                  <p className="text-sm font-semibold text-text-main text-center">
                    {step}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="hidden md:block h-1 flex-1 bg-gradient-to-r from-primary to-accent-alt mx-4 origin-left"
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
