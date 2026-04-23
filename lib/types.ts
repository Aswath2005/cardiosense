/**
 * CardioSense — Type Definitions
 * TypeScript interfaces for patient data, predictions, and form state
 */

export interface PatientData {
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
}

export interface PredictionResult {
  prediction: 0 | 1
  result: string
  risk_level: 'high' | 'low'
  probability: number
}

export interface FormErrors {
  [key: string]: string
}

