import { createClient } from '@/lib/supabase/server'
import type { 
  ReadmeRecord, 
  CreateReadmeInput, 
  UpdateReadmeInput, 
  ReadmeListItem 
} from './types'

export async function getUserReadmes(userId: string): Promise<ReadmeListItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('readmes')
    .select('id, title, github_url, seo_score, updated_at, created_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch user READMEs: ${error.message}`)
  }

  return data || []
}

export async function getReadmeById(id: string, userId: string): Promise<ReadmeRecord | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('readmes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to fetch README: ${error.message}`)
  }

  return data
}

export async function createReadme(userId: string, input: CreateReadmeInput): Promise<ReadmeRecord> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('readmes')
    .insert({
      user_id: userId,
      title: input.title || null,
      content: input.content,
      metadata: input.metadata || null,
      seo_score: input.seo_score || null,
      github_url: input.github_url || null,
      template_id: input.template_id || null,
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create README: ${error.message}`)
  }

  return data
}

export async function updateReadme(
  id: string, 
  userId: string, 
  input: UpdateReadmeInput
): Promise<ReadmeRecord> {
  const supabase = await createClient()
  
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (input.title !== undefined) updateData.title = input.title
  if (input.content !== undefined) updateData.content = input.content
  if (input.metadata !== undefined) updateData.metadata = input.metadata
  if (input.seo_score !== undefined) updateData.seo_score = input.seo_score
  if (input.github_url !== undefined) updateData.github_url = input.github_url
  if (input.template_id !== undefined) updateData.template_id = input.template_id

  const { data, error } = await supabase
    .from('readmes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to update README: ${error.message}`)
  }

  return data
}

export async function deleteReadme(id: string, userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('readmes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete README: ${error.message}`)
  }
}

export async function getOrCreateUserReadme(
  userId: string, 
  githubUrl?: string
): Promise<ReadmeRecord> {
  const supabase = await createClient()
  
  let existing: ReadmeRecord | null = null

  if (githubUrl) {
    // Try to find existing README for this GitHub URL
    const { data } = await supabase
      .from('readmes')
      .select('*')
      .eq('user_id', userId)
      .eq('github_url', githubUrl)
      .single()
    
    existing = data
  }

  if (!existing) {
    // Get the user's most recent README or create a new one
    const { data: recent } = await supabase
      .from('readmes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (recent) {
      existing = recent
    } else {
      // Create a new README for first-time users
      existing = await createReadme(userId, {
        title: 'My README Project',
        content: '# Welcome to your README Editor\n\nStart editing your README here...',
        github_url: githubUrl
      })
    }
  }

  return existing
}