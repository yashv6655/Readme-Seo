export interface ReadmeRecord {
  id: string
  user_id: string
  title: string | null
  content: string
  metadata: ReadmeMetadata | null
  seo_score: number | null
  github_url: string | null
  template_id: string | null
  created_at: string
  updated_at: string
}

export interface ReadmeMetadata {
  repo?: string
  branch?: string
  sha?: string
  lastAction?: string
  score?: {
    score: number
    breakdown: Record<string, number>
    summary: string[]
    top_fixes: string[]
  }
  keywordData?: {
    density: Array<[string, number]>;
    suggestions: string[];
  }
  optimized?: string
  actionSource?: 'editor' | 'optimized'
  previewSource?: 'editor' | 'optimized'
}

export interface CreateReadmeInput {
  title?: string
  content: string
  metadata?: ReadmeMetadata
  seo_score?: number
  github_url?: string
  template_id?: string
}

export interface UpdateReadmeInput {
  title?: string
  content?: string
  metadata?: ReadmeMetadata
  seo_score?: number
  github_url?: string
  template_id?: string
}

export interface ReadmeListItem {
  id: string
  title: string | null
  github_url: string | null
  seo_score: number | null
  updated_at: string
  created_at: string
}