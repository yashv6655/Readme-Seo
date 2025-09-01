import { NextRequest } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { getOrCreateUserReadme } from '@/lib/database/readmes'
import type { AuthUser } from '@/lib/auth/types'

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireApiAuth()
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 })
    }

    const { user } = authResult
    const { searchParams } = new URL(req.url)
    const githubUrl = searchParams.get('github_url') || undefined

    const readme = await getOrCreateUserReadme((user as AuthUser).id, githubUrl)

    return Response.json({ readme })
  } catch (error) {
    console.error('Error getting current README:', error)
    return Response.json({ 
      error: 'Failed to get current README' 
    }, { status: 500 })
  }
}