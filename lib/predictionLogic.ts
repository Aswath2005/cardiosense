import { FormData, RiskLevel } from './types'

export function predictRisk(data: FormData): RiskLevel {
  const age = Number(data.age)
  const chol = Number(data.cholesterol)
  const oldpeak = Number(data.oldpeak)
  const isAsymptomatic = data.chestPainType === 'asymptomatic'
  const hasExerciseAngina = data.exerciseAngina === 'yes'
  const hasReversibleDefect = data.thalassemia === 'reversible'
  const hasHighVessels = Number(data.majorVessels) >= 2

  if (
    (age > 55 && chol > 240) ||
    isAsymptomatic ||
    (hasExerciseAngina && oldpeak > 2) ||
    hasReversibleDefect ||
    hasHighVessels
  ) {
    return 'high'
  }

  return 'low'
}
