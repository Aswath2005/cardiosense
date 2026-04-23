/**
 * CardioSense — Database Type Definitions
 * TypeScript interfaces for Supabase authentication and prediction records
 */

export interface PredictionRecord {
  id: string
  user_id: string
  age: number
  sex: number
  cp: number
  trestbps: number
  chol: number
  fbs: number
  restecg: number
  thalach: number
  exang: number
  oldpeak: number
  slope: number
  ca: number
  thal: number
  risk_level: 'high' | 'low'
  probability: number
  created_at: string
}

export interface AuthUser {
  id: string
  email: string | undefined
}
