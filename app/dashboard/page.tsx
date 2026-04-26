'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, LogOut, ChevronDown, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getPredictions } from '@/lib/supabase'
import { useMockAuth } from '@/lib/mockAuth'
import { PredictionRecord, AuthUser } from '@/lib/database.types'

export default function DashboardPage() {
  const router = useRouter()
  const mockAuth = useMockAuth()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [predictions, setPredictions] = useState<PredictionRecord[]>([])
  const [filteredPredictions, setFilteredPredictions] = useState<PredictionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterLevel, setFilterLevel] = useState<'all' | 'high' | 'low'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for mock auth to initialize from localStorage
        if (mockAuth.isLoading) {
          // Still loading, don't proceed yet
          return
        }

        // Check mock auth first
        if (mockAuth.user) {
          setUser({
            id: mockAuth.user.id,
            email: mockAuth.user.email,
          })
          // For mock auth, no predictions in database
          setPredictions([])
          setIsLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        setUser({
          id: session.user.id,
          email: session.user.email,
        })

        // Fetch predictions
        const { data: predictionsData, error } = await getPredictions(session.user.id)

        if (error) {
          console.error('Failed to fetch predictions:', error)
        } else {
          setPredictions(predictionsData || [])
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, mockAuth.user, mockAuth.isLoading])

  // Filter predictions based on risk level
  useEffect(() => {
    if (filterLevel === 'all') {
      setFilteredPredictions(predictions)
    } else {
      setFilteredPredictions(predictions.filter((p) => p.risk_level === filterLevel))
    }
    setCurrentPage(1)
  }, [filterLevel, predictions])

  const handleSignOut = async () => {
    // Check if using mock auth
    if (mockAuth.user) {
      await mockAuth.signOut()
    } else {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getChestPainLabel = (cp: number) => {
    const labels: { [key: number]: string } = {
      0: 'Typical',
      1: 'Atypical',
      2: 'Non-anginal',
      3: 'Asymptomatic',
    }
    return labels[cp] || 'Unknown'
  }

  const getSexLabel = (sex: number) => {
    return sex === 1 ? 'Male' : 'Female'
  }

  const getRestecgLabel = (restecg: number) => {
    const labels: { [key: number]: string } = {
      0: 'Normal',
      1: 'ST Abnormality',
      2: 'LV Hypertrophy',
    }
    return labels[restecg] || 'Unknown'
  }

  const getSlopeLabel = (slope: number) => {
    const labels: { [key: number]: string } = {
      1: 'Upsloping',
      2: 'Flat',
      3: 'Downsloping',
    }
    return labels[slope] || 'Unknown'
  }

  const getThalLabel = (thal: number) => {
    const labels: { [key: number]: string } = {
      3: 'Normal',
      6: 'Fixed Defect',
      7: 'Reversible Defect',
    }
    return labels[thal] || 'Unknown'
  }

  const escapeCsvCell = (value: string | number) => {
    const stringValue = String(value)
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  const handleDownloadCsv = () => {
    if (filteredPredictions.length === 0) {
      return
    }

    const headers = [
      'created_at',
      'age',
      'sex',
      'cp',
      'trestbps',
      'chol',
      'fbs',
      'restecg',
      'thalach',
      'exang',
      'oldpeak',
      'slope',
      'ca',
      'thal',
      'risk_level',
      'probability',
    ]

    const rows = filteredPredictions.map((pred) => [
      pred.created_at,
      pred.age,
      pred.sex,
      pred.cp,
      pred.trestbps,
      pred.chol,
      pred.fbs,
      pred.restecg,
      pred.thalach,
      pred.exang,
      pred.oldpeak,
      pred.slope,
      pred.ca,
      pred.thal,
      pred.risk_level,
      pred.probability,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    link.href = url
    link.download = `cardiosense_predictions_${filterLevel}_${today}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const highRiskCount = predictions.filter((p) => p.risk_level === 'high').length
  const lowRiskCount = predictions.filter((p) => p.risk_level === 'low').length

  const paginatedPredictions = filteredPredictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Top Bar */}
      <div className="bg-bg-card border-b border-border sticky top-0 z-40 shadow">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-playfair gradient-text">💓 CardioSense Dashboard</h1>
          <div className="flex items-center gap-6">
            <p className="text-sm text-text-muted">{user?.email}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="p-2 hover:bg-bg-section rounded-lg transition-colors text-text-muted hover:text-accent"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hero Strip */}
      <div className="bg-gradient-to-r from-accent to-accent/80 text-bg-main px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-bg-main/80 mb-2">Welcome back 👋</p>
          <h2 className="text-4xl font-bold font-playfair mb-2">Your Prediction History</h2>
          <p className="text-bg-main/90 mb-8">
            All your CardioSense heart risk assessments in one place.
          </p>

          {/* Stats Pills */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-bg-main/20 backdrop-blur px-4 py-2 rounded-full">
              <span className="font-medium">Total: {predictions.length}</span>
            </div>
            <div className="bg-danger/30 backdrop-blur px-4 py-2 rounded-full">
              <span className="font-medium">High Risk: {highRiskCount}</span>
            </div>
            <div className="bg-success/30 backdrop-blur px-4 py-2 rounded-full">
              <span className="font-medium">Low Risk: {lowRiskCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
            <p className="text-text-muted">Loading your predictions...</p>
          </div>
        ) : predictions.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card rounded-2xl shadow p-16 text-center border border-border"
          >
            <div className="text-6xl mb-4">🫀</div>
            <h3 className="text-2xl font-bold font-playfair text-text-main mb-2">No predictions yet</h3>
            <p className="text-text-muted mb-8">
              Head back to the home page to check your heart risk.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/#predict')}
              className="px-6 py-3 bg-accent text-bg-main font-medium rounded-xl hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Make Your First Prediction →
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-card rounded-xl shadow p-6 mb-6 border border-border"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-3 items-center">
                  <span className="text-sm text-text-muted font-medium">Filter:</span>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value as 'all' | 'high' | 'low')}
                    className="px-4 py-2 rounded-lg bg-bg-main border border-border text-text-main focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="all">All Predictions</option>
                    <option value="high">High Risk Only</option>
                    <option value="low">Low Risk Only</option>
                  </select>
                </div>
                <span className="text-sm text-text-muted">
                  Showing {paginatedPredictions.length} of {filteredPredictions.length} predictions
                </span>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadCsv}
                  disabled={filteredPredictions.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg-main text-sm font-medium hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Download size={16} />
                  Download CSV
                </motion.button>
              </div>
            </motion.div>

            {/* Predictions Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-bg-section/50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Age</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Sex</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Chest Pain</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Chol</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">BP</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Risk</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Confidence</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPredictions.map((pred, idx) => (
                      <motion.tbody
                        key={pred.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <tr
                          className={`border-b border-border transition-colors ${
                            idx % 2 === 0 ? 'bg-bg-main/20' : 'bg-transparent'
                          } hover:bg-bg-section/30`}
                        >
                          <td className="px-6 py-4 text-sm text-text-main">{formatDate(pred.created_at)}</td>
                          <td className="px-6 py-4 text-sm text-text-main">{pred.age}</td>
                          <td className="px-6 py-4 text-sm text-text-main">{getSexLabel(pred.sex)}</td>
                          <td className="px-6 py-4 text-sm text-text-main">{getChestPainLabel(pred.cp)}</td>
                          <td className="px-6 py-4 text-sm text-text-main">{pred.chol} mg/dl</td>
                          <td className="px-6 py-4 text-sm text-text-main">{pred.trestbps} mmHg</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                                pred.risk_level === 'high'
                                  ? 'bg-danger/20 text-danger'
                                  : 'bg-success/20 text-success'
                              }`}
                            >
                              {pred.risk_level.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-text-main">
                                {(pred.probability * 100).toFixed(0)}%
                              </span>
                              <div className="w-16 h-2 bg-bg-section rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    pred.risk_level === 'high' ? 'bg-danger' : 'bg-success'
                                  }`}
                                  style={{ width: `${pred.probability * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                setExpandedId(expandedId === pred.id ? null : pred.id)
                              }
                              className="text-sm font-medium text-accent hover:text-primary transition-colors flex items-center gap-1"
                            >
                              View
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${
                                  expandedId === pred.id ? 'rotate-180' : ''
                                }`}
                              />
                            </motion.button>
                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {expandedId === pred.id && (
                          <tr className="bg-bg-section/50 border-b border-border">
                            <td colSpan={9} className="px-6 py-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    Resting ECG
                                  </p>
                                  <p className="text-sm text-text-main">{getRestecgLabel(pred.restecg)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    Max Heart Rate
                                  </p>
                                  <p className="text-sm text-text-main">{pred.thalach} bpm</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    Exercise Angina
                                  </p>
                                  <p className="text-sm text-text-main">{pred.exang === 1 ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    ST Depression
                                  </p>
                                  <p className="text-sm text-text-main">{pred.oldpeak.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    ST Slope
                                  </p>
                                  <p className="text-sm text-text-main">{getSlopeLabel(pred.slope)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    Vessels Count
                                  </p>
                                  <p className="text-sm text-text-main">{pred.ca}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    Thalassemia
                                  </p>
                                  <p className="text-sm text-text-main">{getThalLabel(pred.thal)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted uppercase font-semibold mb-1">
                                    Fasting BS
                                  </p>
                                  <p className="text-sm text-text-main">{pred.fbs === 1 ? '>120 mg/dl' : '≤120 mg/dl'}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </motion.tbody>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-bg-card border border-border text-text-main hover:bg-bg-section disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </motion.button>
                <span className="text-sm text-text-muted">
                  Page {currentPage} of {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-bg-card border border-border text-text-main hover:bg-bg-section disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
