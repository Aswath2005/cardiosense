export interface FormData {
  age: string
  sex: string
  chestPainType: string
  restingBP: string
  cholesterol: string
  fastingBS: string
  restingECG: string
  maxHR: string
  exerciseAngina: string
  oldpeak: string
  stSlope: string
  majorVessels: string
  thalassemia: string
}

export interface FormErrors {
  [key: string]: string
}

export type RiskLevel = 'high' | 'low'
