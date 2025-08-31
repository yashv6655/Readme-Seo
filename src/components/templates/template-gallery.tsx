'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Globe, 
  Terminal, 
  Smartphone, 
  Database, 
  Book, 
  Star, 
  ArrowRight,
  Eye,
  Download,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ReadmeTemplate, TemplateCategory } from '@/types';

// Mock template data
const templates: ReadmeTemplate[] = [
  {
    id: '1',
    name: 'React Component Library',
    description: 'Perfect for React component libraries and design systems',
    category: 'library',
    content: {
      projectName: 'React Components',
      description: 'A beautiful collection of React components',
      features: [],
      installation: [],
      usage: [],
      license: 'MIT',
      badges: []
    },
    usageCount: 15420,
    isPremium: false
  },
  {
    id: '2',
    name: 'Next.js Web Application',
    description: 'Optimized for full-stack Next.js applications',
    category: 'web-app',
    content: {
      projectName: 'Next.js App',
      description: 'A modern web application built with Next.js',
      features: [],
      installation: [],
      usage: [],
      license: 'MIT',
      badges: []
    },
    usageCount: 12340,
    isPremium: false
  },
  {
    id: '3',
    name: 'CLI Tool',
    description: 'Great for command-line interface applications',
    category: 'cli-tool',
    content: {
      projectName: 'CLI Tool',
      description: 'A powerful command-line interface tool',
      features: [],
      installation: [],
      usage: [],
      license: 'MIT',
      badges: []
    },
    usageCount: 8750,
    isPremium: false
  },
  {
    id: '4',
    name: 'REST API',
    description: 'Comprehensive template for REST API documentation',
    category: 'api',
    content: {
      projectName: 'REST API',
      description: 'A RESTful API service',
      features: [],
      installation: [],
      usage: [],
      license: 'MIT',
      badges: []
    },
    usageCount: 9870,
    isPremium: true
  },
  {
    id: '5',
    name: 'Mobile App (React Native)',
    description: 'Tailored for React Native mobile applications',
    category: 'mobile-app',
    content: {
      projectName: 'Mobile App',
      description: 'A cross-platform mobile application',
      features: [],
      installation: [],
      usage: [],
      license: 'MIT',
      badges: []
    },
    usageCount: 6540,
    isPremium: true
  },
  {
    id: '6',
    name: 'Documentation Site',
    description: 'Perfect for documentation and knowledge base sites',
    category: 'documentation',
    content: {
      projectName: 'Documentation',
      description: 'Comprehensive project documentation',
      features: [],
      installation: [],
      usage: [],
      license: 'MIT',
      badges: []
    },
    usageCount: 4320,
    isPremium: false
  }
];

const categoryIcons: Record<TemplateCategory, any> = {
  library: Code2,
  'web-app': Globe,
  'cli-tool': Terminal,
  'mobile-app': Smartphone,
  api: Database,
  documentation: Book,
  framework: Code2,
  other: Code2
};

const categoryLabels: Record<TemplateCategory, string> = {
  library: 'Library',
  'web-app': 'Web App',
  'cli-tool': 'CLI Tool',
  'mobile-app': 'Mobile App',
  api: 'API',
  documentation: 'Documentation',
  framework: 'Framework',
  other: 'Other'
};

interface TemplateGalleryProps {
  onSelectTemplate?: (template: ReadmeTemplate) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories: Array<TemplateCategory | 'all'> = [
    'all', 'library', 'web-app', 'cli-tool', 'api', 'mobile-app', 'documentation'
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold gradient-text"
        >
          README Templates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Choose from our collection of professional templates designed for different project types
        </motion.p>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <Button
                key={category}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All' : categoryLabels[category as TemplateCategory]}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const IconComponent = categoryIcons[template.category];
          const isFavorite = favorites.includes(template.id);
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover glass group relative overflow-hidden">
                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                )}

                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleFavorite(template.id)}
                >
                  <Heart 
                    className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                  />
                </Button>

                <CardHeader className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="number-centered">{template.usageCount.toLocaleString()} uses</span>
                        <span>•</span>
                        <span className="capitalize">{categoryLabels[template.category]}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <div className="h-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                    <div className="flex space-x-1">
                      <div className="h-4 w-12 bg-green-500/20 rounded-full" />
                      <div className="h-4 w-16 bg-blue-500/20 rounded-full" />
                      <div className="h-4 w-14 bg-purple-500/20 rounded-full" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => onSelectTemplate?.(template)}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Book className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse all templates.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            View All Templates
          </Button>
        </motion.div>
      )}
    </div>
  );
}