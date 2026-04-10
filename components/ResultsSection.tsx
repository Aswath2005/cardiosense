'use client'

import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

export default function ResultsSection() {
  const models = [
    { name: 'KNN', accuracy: 92, precision: 92, recall: 92, f1: 92, auc: 0.92, isBest: true },
    { name: 'SVM', accuracy: 87, precision: 87, recall: 87, f1: 87, auc: 0.93, isBest: false },
    { name: 'Deep Learning', accuracy: 87, precision: 87, recall: 87, f1: 87, auc: 0.91, isBest: false },
    { name: 'Random Forest', accuracy: 84, precision: 84, recall: 84, f1: 84, auc: 0.92, isBest: false },
  ]

  const accuracyBars = [
    { label: 'KNN', value: 92, color: 'bg-accent' },
    { label: 'SVM', value: 87, color: 'bg-blue-400' },
    { label: 'Deep Learning', value: 87, color: 'bg-blue-300' },
    { label: 'Random Forest', value: 84, color: 'bg-blue-200' },
  ]

  const benchmarks = [
    { reference: 'Dubey et al.', model: 'Nonlinear Regression', accuracy: 89 },
    { reference: 'Sarra et al.', model: 'SVM', accuracy: 89 },
    { reference: 'Haq et al.', model: 'SVM', accuracy: 88 },
    { reference: 'Ours (Proposed)', model: 'KNN', accuracy: 92, isBest: true },
  ]

  const modelEmojis: { [key: string]: string } = {
    'KNN': '👥',
    'SVM': '📐',
    'Deep Learning': '🧠',
    'Random Forest': '🌲',
  }

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
    <section id="results" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-text-main mb-4">
            Model Performance Comparison
          </h2>
          <p className="text-lg text-text-muted">
            Evaluated on the Cleveland Heart Disease dataset (303 instances)
          </p>
        </motion.div>

        {/* Accuracy Bars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-bg-section rounded-2xl p-8 md:p-10 mb-12"
        >
          <h3 className="text-2xl font-bold text-text-main mb-8">Accuracy Scores</h3>

          <div className="space-y-6">
            {accuracyBars.map((bar) => (
              <motion.div key={bar.label} variants={itemVariants}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-text-main">{bar.label}</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-lg font-bold text-accent"
                  >
                    {bar.value}%
                  </motion.span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${bar.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
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
          {models.map((model) => (
            <motion.div
              key={model.name}
              variants={itemVariants}
              className="relative bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-lg transition-shadow"
            >
              {/* Best Model Badge */}
              {model.isBest && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                  <Trophy size={12} />
                  Best
                </div>
              )}

              <div className="text-4xl mb-4">{modelEmojis[model.name]}</div>

              <div className="mb-6">
                <h4 className="font-bold text-text-main text-lg mb-2">
                  {model.name}
                </h4>
                <div className="text-3xl font-bold text-accent mb-1">
                  {model.accuracy}%
                </div>
                <span className="text-xs text-text-muted">Accuracy</span>
              </div>

              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-text-muted">Precision</span>
                  <span className="font-semibold text-text-main">{model.precision}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Recall</span>
                  <span className="font-semibold text-text-main">{model.recall}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">F1</span>
                  <span className="font-semibold text-text-main">{model.f1}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">ROC-AUC</span>
                  <span className="font-semibold text-text-main">{model.auc.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benchmark Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl shadow-lg border border-border"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-bg-section">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-main">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-main">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-main">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((benchmark, index) => (
                <motion.tr
                  key={benchmark.reference}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-t border-border ${
                    benchmark.isBest
                      ? 'bg-accent text-white'
                      : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-bg-main'
                  }`}
                >
                  <td
                    className={`px-6 py-4 text-sm font-medium ${
                      benchmark.isBest ? 'text-white' : 'text-text-main'
                    }`}
                  >
                    {benchmark.reference}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      benchmark.isBest ? 'text-white' : 'text-text-muted'
                    }`}
                  >
                    {benchmark.model}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      benchmark.isBest ? 'text-white' : 'text-text-main'
                    }`}
                  >
                    {benchmark.accuracy}%{benchmark.isBest && ' 🏆'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
