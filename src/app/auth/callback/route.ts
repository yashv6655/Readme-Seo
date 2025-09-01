import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      const supabase = await createClient()
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && session) {
        // Verify the session was created properly
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (!userError && user) {
          // Create response with proper redirect
          const forwardedHost = request.headers.get('x-forwarded-host')
          const isLocalEnv = process.env.NODE_ENV === 'development'
          
          let redirectUrl: string
          if (isLocalEnv) {
            redirectUrl = `${origin}${next}`
          } else if (forwardedHost) {
            redirectUrl = `https://${forwardedHost}${next}`
          } else {
            redirectUrl = `${origin}${next}`
          }
          
          // Create the redirect response
          const response = NextResponse.redirect(redirectUrl)
          
          // Ensure cookies are properly set for the domain
          if (!isLocalEnv && forwardedHost) {
            // In production, ensure cookies work across the domain
            response.cookies.set('supabase-auth-token', session.access_token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              domain: `.${forwardedHost.split('.').slice(-2).join('.')}`, // e.g., .vercel.app
              path: '/',
              maxAge: session.expires_in || 3600
            })
          }
          
          return response
        }
      }
      
      console.error('Auth callback error:', error || 'No session created')
    } catch (error) {
      console.error('Auth callback exception:', error)
    }
  }

  // If there was an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}