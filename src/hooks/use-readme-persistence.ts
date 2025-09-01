'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import type { ReadmeRecord, ReadmeMetadata } from '@/lib/database/types'
import posthog from 'posthog-js'

interface UseReadmePersistenceOptions {
  autoSaveDelay?: number
}

interface UseReadmePersistenceReturn {
  currentReadme: ReadmeRecord | null
  isLoading: boolean
  isSaving: boolean
  lastSaved: Date | null
  error: string | null
  
  // Actions
  loadCurrentReadme: (githubUrl?: string) => Promise<void>
  saveReadme: (force?: boolean) => Promise<void>
  updateContent: (content: string) => void
  updateMetadata: (metadata: Partial<ReadmeMetadata>) => void
  setTitle: (title: string) => void
  createNewReadme: () => Promise<void>
}

export function useReadmePersistence(
  options: UseReadmePersistenceOptions = {}
): UseReadmePersistenceReturn {
  const { autoSaveDelay = 2000 } = options
  const { user } = useAuth()

  const [currentReadme, setCurrentReadme] = useState<ReadmeRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Track pending changes
  const [pendingContent, setPendingContent] = useState<string>('')
  const [pendingMetadata, setPendingMetadata] = useState<Partial<ReadmeMetadata>>({})
  const [pendingTitle, setPendingTitle] = useState<string>('')
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasInitializedRef = useRef(false)

  // Clear auto-save timeout
  const clearAutoSaveTimeout = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
      autoSaveTimeoutRef.current = null
    }
  }, [])

  // Load current README
  const loadCurrentReadme = useCallback(async (githubUrl?: string) => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)

    try {
      const url = new URL('/api/readmes/current', window.location.origin)
      if (githubUrl) {
        url.searchParams.set('github_url', githubUrl)
      }

      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error('Failed to load README')
      }

      const data = await response.json()
      setCurrentReadme(data.readme)
      
      // Initialize pending states
      setPendingContent(data.readme.content)
      setPendingMetadata(data.readme.metadata || {})
      setPendingTitle(data.readme.title || '')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load README')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Save README
  const saveReadme = useCallback(async (force = false) => {
    if (!currentReadme || !user) return
    
    // Check if there are changes to save
    const hasContentChanges = pendingContent !== currentReadme.content
    const hasMetadataChanges = JSON.stringify(pendingMetadata) !== JSON.stringify(currentReadme.metadata || {})
    const hasTitleChanges = pendingTitle !== (currentReadme.title || '')
    
    if (!force && !hasContentChanges && !hasMetadataChanges && !hasTitleChanges) {
      return // No changes to save
    }

    setIsSaving(true)
    setError(null)
    clearAutoSaveTimeout()

    try {
      const response = await fetch(`/api/readmes/${currentReadme.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pendingTitle || null,
          content: pendingContent,
          metadata: pendingMetadata,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save README')
      }

      const data = await response.json()
      setCurrentReadme(data.readme)
      setLastSaved(new Date())
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        const deltaBytes = (pendingContent?.length || 0) - (currentReadme.content?.length || 0)
        posthog.capture('readme_saved', {
          autosave: !force,
          editor_length: pendingContent?.length || 0,
          delta_bytes: deltaBytes,
        })
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save README')
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture('save_failed', {
          message: err instanceof Error ? err.message : String(err),
        })
      }
    } finally {
      setIsSaving(false)
    }
  }, [currentReadme, user, pendingContent, pendingMetadata, pendingTitle, clearAutoSaveTimeout])

  // Update content with auto-save
  const updateContent = useCallback((content: string) => {
    setPendingContent(content)
    setError(null)
    
    // Schedule auto-save
    clearAutoSaveTimeout()
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveReadme()
    }, autoSaveDelay)
  }, [clearAutoSaveTimeout, saveReadme, autoSaveDelay])

  // Update metadata with auto-save
  const updateMetadata = useCallback((metadata: Partial<ReadmeMetadata>) => {
    setPendingMetadata(prev => ({ ...prev, ...metadata }))
    setError(null)
    
    // Schedule auto-save
    clearAutoSaveTimeout()
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveReadme()
    }, autoSaveDelay)
  }, [clearAutoSaveTimeout, saveReadme, autoSaveDelay])

  // Set title
  const setTitle = useCallback((title: string) => {
    setPendingTitle(title)
  }, [])

  // Create new README
  const createNewReadme = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/readmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New README Project',
          content: '# New README\n\nStart editing your README here...',
          metadata: {},
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create README')
      }

      const data = await response.json()
      setCurrentReadme(data.readme)
      setPendingContent(data.readme.content)
      setPendingMetadata(data.readme.metadata || {})
      setPendingTitle(data.readme.title || '')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create README')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Load initial README when user is available
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      loadCurrentReadme()
    }
  }, [user, loadCurrentReadme])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearAutoSaveTimeout()
    }
  }, [clearAutoSaveTimeout])

  return {
    currentReadme,
    isLoading,
    isSaving,
    lastSaved,
    error,
    loadCurrentReadme,
    saveReadme,
    updateContent,
    updateMetadata,
    setTitle,
    createNewReadme,
  }
}
