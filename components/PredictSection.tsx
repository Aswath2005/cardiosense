'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader } from 'lucide-react'
import { FormData, FormErrors } from '@/lib/types'
import { predictRisk } from '@/lib/predictionLogic'
import ResultCard from './ResultCard'

export default function PredictSection() {
  const resultCardRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    age: '',
    sex: '',
    chestPainType: '',
    restingBP: '',
    cholesterol: '',
    fastingBS: '',
    restingECG: '',
    maxHR: '',
    exerciseAngina: '',
    oldpeak: '',
    stSlope: '',
    majorVessels: '',
    thalassemia: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [result, setResult] = useState<'high' | 'low' | null>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        newErrors[key] = 'This field is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const riskResult = predictRisk(formData)
      setResult(riskResult)
      setIsLoading(false)

      // Scroll to result card
      setTimeout(() => {
        resultCardRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, 1500)
  }

  const handleReset = () => {
    setFormData({
      age: '',
      sex: '',
      chestPainType: '',
      restingBP: '',
      cholesterol: '',
      fastingBS: '',
      restingECG: '',
      maxHR: '',
      exerciseAngina: '',
      oldpeak: '',
      stSlope: '',
      majorVessels: '',
      thalassemia: '',
    })
    setErrors({})
    setResult(null)
  }

  return (
    <section id="predict" className="py-20 px-6 bg-bg-main">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-text-main mb-4">
            Check Your Heart Risk
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Fill in your health details below — all fields required.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 45"
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.age ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.age && (
                  <p className="text-danger text-xs mt-1">{errors.age}</p>
                )}
              </div>

              {/* Sex */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.sex ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.sex && (
                  <p className="text-danger text-xs mt-1">{errors.sex}</p>
                )}
              </div>

              {/* Chest Pain Type */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Chest Pain Type
                </label>
                <select
                  name="chestPainType"
                  value={formData.chestPainType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.chestPainType ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="typical">Typical Angina</option>
                  <option value="atypical">Atypical Angina</option>
                  <option value="non-anginal">Non-anginal Pain</option>
                  <option value="asymptomatic">Asymptomatic</option>
                </select>
                {errors.chestPainType && (
                  <p className="text-danger text-xs mt-1">{errors.chestPainType}</p>
                )}
              </div>

              {/* Resting BP */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Resting Blood Pressure (mm Hg)
                </label>
                <input
                  type="number"
                  name="restingBP"
                  value={formData.restingBP}
                  onChange={handleInputChange}
                  placeholder="e.g., 120"
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.restingBP ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.restingBP && (
                  <p className="text-danger text-xs mt-1">{errors.restingBP}</p>
                )}
              </div>

              {/* Cholesterol */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Cholesterol (mg/dl)
                </label>
                <input
                  type="number"
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleInputChange}
                  placeholder="e.g., 200"
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.cholesterol ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.cholesterol && (
                  <p className="text-danger text-xs mt-1">{errors.cholesterol}</p>
                )}
              </div>

              {/* Fasting BS */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Fasting Blood Sugar
                </label>
                <select
                  name="fastingBS"
                  value={formData.fastingBS}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.fastingBS ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="high">&gt;120 mg/dl</option>
                  <option value="normal">≤120 mg/dl</option>
                </select>
                {errors.fastingBS && (
                  <p className="text-danger text-xs mt-1">{errors.fastingBS}</p>
                )}
              </div>

              {/* Resting ECG */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Resting ECG
                </label>
                <select
                  name="restingECG"
                  value={formData.restingECG}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.restingECG ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="normal">Normal</option>
                  <option value="st-abnormality">ST-T Abnormality</option>
                  <option value="lvh">Left Ventricular Hypertrophy</option>
                </select>
                {errors.restingECG && (
                  <p className="text-danger text-xs mt-1">{errors.restingECG}</p>
                )}
              </div>

              {/* Max HR */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Max Heart Rate
                </label>
                <input
                  type="number"
                  name="maxHR"
                  value={formData.maxHR}
                  onChange={handleInputChange}
                  placeholder="e.g., 150"
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.maxHR ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.maxHR && (
                  <p className="text-danger text-xs mt-1">{errors.maxHR}</p>
                )}
              </div>

              {/* Exercise Angina */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Exercise Angina
                </label>
                <select
                  name="exerciseAngina"
                  value={formData.exerciseAngina}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.exerciseAngina ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.exerciseAngina && (
                  <p className="text-danger text-xs mt-1">{errors.exerciseAngina}</p>
                )}
              </div>

              {/* ST Depression */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  ST Depression (oldpeak)
                </label>
                <input
                  type="number"
                  name="oldpeak"
                  step="0.1"
                  value={formData.oldpeak}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.5"
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.oldpeak ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.oldpeak && (
                  <p className="text-danger text-xs mt-1">{errors.oldpeak}</p>
                )}
              </div>

              {/* ST Slope */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  ST Slope
                </label>
                <select
                  name="stSlope"
                  value={formData.stSlope}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.stSlope ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="upsloping">Upsloping</option>
                  <option value="flat">Flat</option>
                  <option value="downsloping">Downsloping</option>
                </select>
                {errors.stSlope && (
                  <p className="text-danger text-xs mt-1">{errors.stSlope}</p>
                )}
              </div>

              {/* Major Vessels */}
              <div>
                <label className="text-sm font-medium text-text-muted mb-2 block">
                  Major Vessels (ca)
                </label>
                <select
                  name="majorVessels"
                  value={formData.majorVessels}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                    errors.majorVessels ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                {errors.majorVessels && (
                  <p className="text-danger text-xs mt-1">{errors.majorVessels}</p>
                )}
              </div>
            </div>

            {/* Thalassemia - Full Width */}
            <div>
              <label className="text-sm font-medium text-text-muted mb-2 block">
                Thalassemia
              </label>
              <select
                name="thalassemia"
                value={formData.thalassemia}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-accent outline-none ${
                  errors.thalassemia ? 'border-danger' : 'border-border'
                }`}
              >
                <option value="">Select...</option>
                <option value="normal">Normal</option>
                <option value="fixed">Fixed Defect</option>
                <option value="reversible">Reversible Defect</option>
              </select>
              {errors.thalassemia && (
                <p className="text-danger text-xs mt-1">{errors.thalassemia}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze My Risk
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Result Card */}
        {result && (
          <div ref={resultCardRef} className="mt-12">
            <ResultCard result={result} onReset={handleReset} />
          </div>
        )}
      </div>
    </section>
  )
}
