/**
 * CardioSense — API Client
 * Functions to communicate with the FastAPI backend
 */

import { PatientData, PredictionResult } from './types'

// Determine the correct API URL
const getApiUrl = (): string => {
  // Check if running in browser
  if (typeof window === 'undefined') {
    return 'http://localhost:8000' // Server-side fallback
  }
  
  // Development (localhost)
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000'
  }
  
  // Production (Vercel) - use relative path to backend service
  return '/_/backend'
}

/**
 * Call the backend /predict endpoint
 * 
 * @param data Patient data with 13 features
 * @returns Prediction result with risk level and probability
 * @throws Error if prediction fails or backend is unreachable
 */
export async function predictHeartRisk(data: PatientData): Promise<PredictionResult> {
  const API_URL = getApiUrl()
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Prediction failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to connect to backend API')
  }
}

/**
 * Check backend health and model status
 * 
 * @returns true if model is loaded, false otherwise
 */
export async function checkHealth(): Promise<boolean> {
  const API_URL = getApiUrl()
  try {
    const response = await fetch(`${API_URL}/health`)
    const data = await response.json()
    return data.model_loaded === true
  } catch {
    return false
  }
}

/**
 * Get API status
 * 
 * @returns Status message from the API
 */
export async function getAPIStatus(): Promise<string> {
  const API_URL = getApiUrl()
  try {
    const response = await fetch(`${API_URL}/`)
    const data = await response.json()
    return data.status || 'API is running'
  } catch {
    return 'API is offline'
  }
}
