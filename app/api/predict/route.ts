/**
 * CardioSense — Server-side Prediction API Route
 * Handles both ML prediction AND database storage in one request
 * 
 * This ensures data is always saved, whether user is authenticated or not.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Initialize Supabase server client (with service role for server-side operations)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Missing Supabase environment variables')
}

const supabaseServer = supabaseUrl && (supabaseServiceRole || supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseServiceRole, {
      db: { schema: 'public' },
    })
  : null

const supabaseAnonServer = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: 'public' },
    })
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientData, userId } = body

    if (!patientData) {
      return NextResponse.json(
        { error: 'Missing patient data' },
        { status: 400 }
      )
    }

    // Call backend FastAPI server for prediction
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    const predictionResponse = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    })

    if (!predictionResponse.ok) {
      const error = await predictionResponse.json()
      return NextResponse.json(
        { error: error.detail || 'Backend prediction failed' },
        { status: 500 }
      )
    }

    const predictionResult = await predictionResponse.json()
    const normalizedUserId =
      typeof userId === 'string' && UUID_REGEX.test(userId) ? userId : null
    let dbSaved = false
    let dbErrorMessage: string | null = null

    // Save to database - Always save, even without user_id (allow anonymous predictions)
    if (supabaseServer) {
      try {
        console.log('📝 Attempting to save prediction...', {
          userId,
          normalizedUserId,
          patientDataKeys: Object.keys(patientData),
        })
        
        let { data, error } = await supabaseServer.from('predictions').insert({
          user_id: normalizedUserId,
          age: Number(patientData.age),
          sex: Number(patientData.sex),
          cp: Number(patientData.cp),
          trestbps: Number(patientData.trestbps),
          chol: Number(patientData.chol),
          fbs: Number(patientData.fbs),
          restecg: Number(patientData.restecg),
          thalach: Number(patientData.thalach),
          exang: Number(patientData.exang),
          oldpeak: Number(patientData.oldpeak),
          slope: Number(patientData.slope),
          ca: Number(patientData.ca),
          thal: Number(patientData.thal),
          risk_level: predictionResult.risk_level,
          probability: predictionResult.probability,
        }).select()

        // Fallback: if service role key is invalid, retry once with anon key.
        if (error?.message?.toLowerCase().includes('invalid api key') && supabaseAnonServer) {
          console.warn('⚠️ Service role key rejected. Retrying with anon key.')
          const retryResult = await supabaseAnonServer.from('predictions').insert({
            user_id: normalizedUserId,
            age: Number(patientData.age),
            sex: Number(patientData.sex),
            cp: Number(patientData.cp),
            trestbps: Number(patientData.trestbps),
            chol: Number(patientData.chol),
            fbs: Number(patientData.fbs),
            restecg: Number(patientData.restecg),
            thalach: Number(patientData.thalach),
            exang: Number(patientData.exang),
            oldpeak: Number(patientData.oldpeak),
            slope: Number(patientData.slope),
            ca: Number(patientData.ca),
            thal: Number(patientData.thal),
            risk_level: predictionResult.risk_level,
            probability: predictionResult.probability,
          }).select()
          data = retryResult.data
          error = retryResult.error
        }

        if (error) {
          console.error('❌ Database save error:', error.code, error.message)
          console.error('   Full error:', error)
          dbErrorMessage = `${error.code ?? 'DB_ERROR'}: ${error.message}`
          // Still return prediction even if save fails
        } else {
          console.log('✅ Prediction saved to database successfully:', data)
          dbSaved = true
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError)
        dbErrorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
        // Still return prediction even if save fails
      }
    } else {
      console.error('⚠️  Supabase server client not initialized')
      dbErrorMessage = 'Supabase server client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and keys.'
    }

    return NextResponse.json({
      ...predictionResult,
      db_saved: dbSaved,
      db_error: dbErrorMessage,
    })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
