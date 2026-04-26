/**
 * CardioSense - Record User Login
 * API endpoint to store user login information
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
    const { userId, email, authMethod = 'email' } = body

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing userId or email' },
        { status: 400 }
      )
    }

    if (!supabaseServer) {
      console.error('❌ Supabase server client not initialized')
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 500 }
      )
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    console.log(`📝 Recording login for ${email} (${authMethod})...`)

    // Insert login record
    let { data, error } = await supabaseServer
      .from('user_logins')
      .insert({
        user_id: userId,
        email,
        auth_method: authMethod,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()

    // Fallback: if service role key is invalid, retry once with anon key.
    if (error?.message?.toLowerCase().includes('invalid api key') && supabaseAnonServer) {
      console.warn('⚠️ Service role key rejected for login-record. Retrying with anon key.')
      const retryResult = await supabaseAnonServer
        .from('user_logins')
        .insert({
          user_id: userId,
          email,
          auth_method: authMethod,
          ip_address: ipAddress,
          user_agent: userAgent,
        })
        .select()
      data = retryResult.data
      error = retryResult.error
    }

    if (error) {
      console.error('❌ Failed to record login:', error.message)
      // Don't fail the auth flow - just log the error
      return NextResponse.json({ 
        success: false,
        message: 'Login recorded with errors',
        error: error.message 
      }, { status: 500 })
    }

    console.log('✅ Login recorded successfully')
    return NextResponse.json({ 
      success: true,
      message: 'Login recorded',
      data 
    })
  } catch (error) {
    console.error('❌ Error recording login:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
