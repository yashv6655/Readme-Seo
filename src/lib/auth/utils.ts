import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
}

export async function requireAuth() {
  const { user } = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function signOut() {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}