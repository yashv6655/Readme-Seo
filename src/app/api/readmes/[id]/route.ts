import { NextRequest } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { getReadmeById, updateReadme, deleteReadme } from '@/lib/database/readmes'
import type { UpdateReadmeInput } from '@/lib/database/types'
import type { AuthUser } from '@/lib/auth/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireApiAuth()
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 })
    }

    const { user } = authResult
    const { id } = await params
    const readme = await getReadmeById(id, (user as AuthUser).id)

    if (!readme) {
      return Response.json({ error: 'README not found' }, { status: 404 })
    }

    return Response.json({ readme })
  } catch (error) {
    console.error('Error fetching README:', error)
    return Response.json({ 
      error: 'Failed to fetch README' 
    }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireApiAuth()
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 })
    }

    const { user } = authResult
    const body = await req.json()

    const input: UpdateReadmeInput = {
      title: body.title,
      content: body.content,
      metadata: body.metadata,
      seo_score: body.seo_score,
      github_url: body.github_url,
      template_id: body.template_id
    }

    const { id } = await params
    const readme = await updateReadme(id, (user as AuthUser).id, input)

    return Response.json({ readme })
  } catch (error) {
    console.error('Error updating README:', error)
    if (error instanceof Error && error.message.includes('Failed to update README')) {
      return Response.json({ error: 'README not found or unauthorized' }, { status: 404 })
    }
    return Response.json({ 
      error: 'Failed to update README' 
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await requireApiAuth()
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 })
    }

    const { user } = authResult
    const { id } = await params
    await deleteReadme(id, (user as AuthUser).id)

    return Response.json({ message: 'README deleted successfully' })
  } catch (error) {
    console.error('Error deleting README:', error)
    return Response.json({ 
      error: 'Failed to delete README' 
    }, { status: 500 })
  }
}