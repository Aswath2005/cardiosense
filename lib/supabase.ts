/**
 * CardioSense — Supabase Client & Database Functions
 * Browser-side Supabase client initialization and prediction storage
 */

import { createClient } from '@supabase/supabase-js'
import { PatientData, PredictionResult } from './types'
import { PredictionRecord } from './database.types'

// Initialize Supabase browser client (singleton pattern to avoid multiple instances)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' },
  persistSession: true,
  auth: { persistSession: true }
})

// Debug: Log connection
console.log('✅ Supabase initialized:', supabaseUrl)

/**
 * Save a prediction to the database
 * 
 * @param userId User ID from Supabase auth
 * @param formData Patient form data with 13 features
 * @param result Prediction result from FastAPI backend
 * @returns { error: null } on success or { error: message } on failure
 */
export async function savePrediction(
  userId: string,
  formData: PatientData,
  result: PredictionResult
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('predictions').insert({
      user_id: userId,
      age: Number(formData.age),
      sex: Number(formData.sex),
      cp: Number(formData.cp),
      trestbps: Number(formData.trestbps),
      chol: Number(formData.chol),
      fbs: Number(formData.fbs),
      restecg: Number(formData.restecg),
      thalach: Number(formData.thalach),
      exang: Number(formData.exang),
      oldpeak: Number(formData.oldpeak),
      slope: Number(formData.slope),
      ca: Number(formData.ca),
      thal: Number(formData.thal),
      risk_level: result.risk_level,
      probability: result.probability,
    })

    if (error) {
      console.error('❌ Supabase save error:', error.message)
      return { error: error.message }
    }

    console.log('✅ Prediction successfully saved to Supabase database')
    return { error: null }
  } catch (err) {
    // Gracefully handle network errors - don't fail the prediction
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.warn('⚠️  Supabase unavailable (no internet?):', errorMessage)
    console.log('✅ Prediction computed locally (database save skipped)')
    return { error: null } // Don't block the prediction UI
  }
}

/**
 * Get all predictions for a user
 * 
 * @param userId User ID from Supabase auth
 * @returns { data: predictions array, error: null } on success or 
 *          { data: null, error: message } on failure
 */
export async function getPredictions(
  userId: string
): Promise<{ data: PredictionRecord[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data as PredictionRecord[], error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return { data: null, error: errorMessage }
  }
}
