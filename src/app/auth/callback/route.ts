import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        if (isLocalEnv) {
          // In development, redirect to the local URL
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          // In production, use the forwarded host
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          // Fallback to origin
          return NextResponse.redirect(`${origin}${next}`)
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error)
    }
  }

  // If there was an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}