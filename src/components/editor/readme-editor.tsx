'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, GripVertical, Save, Download, Eye } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReadmePreview } from './readme-preview';
import { SeoScore } from '@/components/ui/seo-score';
import { ReadmeFormData, Feature, InstallationStep } from '@/types';

const readmeSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  repositoryUrl: z.string().url().optional().or(z.literal('')),
  features: z.array(z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
    order: z.number()
  })),
  installation: z.array(z.object({
    id: z.string(),
    packageManager: z.enum(['npm', 'yarn', 'pnpm', 'bun']),
    command: z.string().min(1),
    description: z.string().optional()
  })),
});

type ReadmeFormValues = z.infer<typeof readmeSchema>;

export function ReadmeEditor() {
  const [previewMode, setPreviewMode] = useState<'split' | 'preview'>('split');
  const [seoScore, setSeoScore] = useState(87);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReadmeFormValues>({
    resolver: zodResolver(readmeSchema),
    defaultValues: {
      projectName: 'My Awesome Project',
      description: 'A revolutionary tool that makes developers\' lives easier with zero configuration and beautiful design.',
      repositoryUrl: 'https://github.com/username/project',
      features: [
        {
          id: '1',
          title: '⚡ Lightning Fast',
          description: 'Built for performance with zero configuration required',
          order: 0
        },
        {
          id: '2',
          title: '🎨 Beautiful Design',
          description: 'Stunning UI components that look great out of the box',
          order: 1
        }
      ],
      installation: [
        {
          id: '1',
          packageManager: 'npm',
          command: 'npm install my-awesome-project',
        },
        {
          id: '2',
          packageManager: 'yarn',
          command: 'yarn add my-awesome-project',
        }
      ]
    }
  });

  const formData = watch();

  const addFeature = useCallback(() => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      title: 'New Feature',
      description: 'Description of the new feature',
      order: formData.features.length
    };
    setValue('features', [...formData.features, newFeature]);
  }, [formData.features, setValue]);

  const removeFeature = useCallback((id: string) => {
    setValue('features', formData.features.filter(f => f.id !== id));
  }, [formData.features, setValue]);

  const addInstallation = useCallback(() => {
    const newInstall: InstallationStep = {
      id: Date.now().toString(),
      packageManager: 'npm',
      command: `npm install ${formData.projectName.toLowerCase().replace(/\s+/g, '-')}`,
    };
    setValue('installation', [...formData.installation, newInstall]);
  }, [formData.installation, formData.projectName, setValue]);

  const onSubmit = (data: ReadmeFormValues) => {
    console.log('Saving README:', data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-gray-900/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">README Editor</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Auto-saved</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <SeoScore score={seoScore} size="sm" />
            
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={previewMode === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('split')}
              >
                Split
              </Button>
              <Button
                variant={previewMode === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('preview')}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="gradient" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex ${previewMode === 'preview' ? 'hidden' : ''}`}>
        {/* Editor Panel */}
        <div className={`${previewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200 dark:border-gray-800`}>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              {/* Project Basics */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Input
                    label="Project Name"
                    placeholder="My Awesome Project"
                    error={errors.projectName?.message}
                    {...register('projectName')}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="A brief description of what your project does and why it's awesome..."
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                  </div>
                  
                  <Input
                    label="Repository URL (optional)"
                    placeholder="https://github.com/username/project"
                    error={errors.repositoryUrl?.message}
                    {...register('repositoryUrl')}
                  />
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Features</CardTitle>
                  <Button type="button" onClick={addFeature} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {formData.features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >
                        <div className="flex items-start space-x-4">
                          <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-grab" />
                          <div className="flex-1 space-y-4">
                            <Input
                              placeholder="Feature title"
                              value={feature.title}
                              onChange={(e) => {
                                const updated = [...formData.features];
                                updated[index] = { ...feature, title: e.target.value };
                                setValue('features', updated);
                              }}
                            />
                            <textarea
                              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                              placeholder="Feature description"
                              value={feature.description}
                              onChange={(e) => {
                                const updated = [...formData.features];
                                updated[index] = { ...feature, description: e.target.value };
                                setValue('features', updated);
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(feature.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Installation */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Installation</CardTitle>
                  <Button type="button" onClick={addInstallation} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Command
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.installation.map((install, index) => (
                      <div key={install.id} className="flex items-center space-x-4">
                        <select
                          className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                          value={install.packageManager}
                          onChange={(e) => {
                            const updated = [...formData.installation];
                            updated[index] = { ...install, packageManager: e.target.value as any };
                            setValue('installation', updated);
                          }}
                        >
                          <option value="npm">npm</option>
                          <option value="yarn">yarn</option>
                          <option value="pnpm">pnpm</option>
                          <option value="bun">bun</option>
                        </select>
                        <Input
                          placeholder="Installation command"
                          value={install.command}
                          onChange={(e) => {
                            const updated = [...formData.installation];
                            updated[index] = { ...install, command: e.target.value };
                            setValue('installation', updated);
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`${previewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
          <ReadmePreview data={formData} />
        </div>
      </div>

      {/* Full Preview Mode */}
      {previewMode === 'preview' && (
        <div className="w-full">
          <ReadmePreview data={formData} fullscreen />
        </div>
      )}
    </div>
  );
}