import { NextRequest } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { getUserReadmes, createReadme } from '@/lib/database/readmes'
import type { CreateReadmeInput } from '@/lib/database/types'
import type { AuthUser } from '@/lib/auth/types'

export async function GET() {
  try {
    const authResult = await requireApiAuth()
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 })
    }

    const { user } = authResult
    const readmes = await getUserReadmes((user as AuthUser).id)

    return Response.json({ readmes })
  } catch (error) {
    console.error('Error fetching user READMEs:', error)
    return Response.json({ 
      error: 'Failed to fetch READMEs' 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireApiAuth()
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 })
    }

    const { user } = authResult
    const body = await req.json()
    
    // Validate required fields
    if (!body.content || typeof body.content !== 'string') {
      return Response.json({ 
        error: 'Content is required and must be a string' 
      }, { status: 400 })
    }

    const input: CreateReadmeInput = {
      title: body.title,
      content: body.content,
      metadata: body.metadata,
      seo_score: body.seo_score,
      github_url: body.github_url,
      template_id: body.template_id
    }

    const readme = await createReadme((user as AuthUser).id, input)

    return Response.json({ readme }, { status: 201 })
  } catch (error) {
    console.error('Error creating README:', error)
    return Response.json({ 
      error: 'Failed to create README' 
    }, { status: 500 })
  }
}