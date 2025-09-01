'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Search, 
  Palette, 
  Code, 
  BarChart3, 
  Github, 
  Sparkles, 
  Shield,
  Rocket
} from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SeoScore } from '@/components/ui/seo-score';

const features = [
  {
    icon: Search,
    title: 'SEO Optimization',
    description: 'Built-in SEO analyzer that ensures your README ranks well on GitHub and Google search results.',
    color: 'from-green-500 to-emerald-500',
    demo: <SeoScore score={94} size="sm" />
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: '20+ professionally designed templates for different types of projects and frameworks.',
    color: 'from-purple-500 to-violet-500',
    demo: (
      <div className="grid grid-cols-2 gap-1">
        <div className="h-3 bg-purple-500/20 rounded" />
        <div className="h-3 bg-blue-500/20 rounded" />
        <div className="h-3 bg-pink-500/20 rounded" />
        <div className="h-3 bg-indigo-500/20 rounded" />
      </div>
    )
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate professional READMEs in under 2 seconds with real-time preview and instant updates.',
    color: 'from-yellow-500 to-orange-500',
    demo: (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        <span className="text-xs font-mono number-centered">2.3s</span>
      </div>
    )
  },
  {
    icon: Code,
    title: 'Syntax Highlighting',
    description: 'Automatic code highlighting for 100+ programming languages with copy-paste functionality.',
    color: 'from-blue-500 to-cyan-500',
    demo: (
      <div className="space-y-1">
        <div className="text-xs font-mono text-blue-400">npm install</div>
        <div className="text-xs font-mono text-green-400">yarn add</div>
      </div>
    )
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track README performance, views, and SEO metrics with detailed analytics and reports.',
    color: 'from-rose-500 to-pink-500',
    demo: (
      <div className="flex items-end space-x-1 h-6">
        <div className="w-1 h-2 bg-rose-500 rounded-sm" />
        <div className="w-1 h-4 bg-rose-500 rounded-sm" />
        <div className="w-1 h-6 bg-rose-500 rounded-sm" />
        <div className="w-1 h-3 bg-rose-500 rounded-sm" />
      </div>
    )
  },
  {
    icon: Github,
    title: 'GitHub Integration',
    description: 'Seamless integration with GitHub Actions for automatic README updates and deployments.',
    color: 'from-gray-600 to-gray-800',
    demo: (
      <Github className="w-4 h-4 text-gray-600" />
    )
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart content suggestions, auto-generated descriptions, and intelligent SEO recommendations.',
    color: 'from-indigo-500 to-purple-500',
    demo: (
      <Sparkles className="w-4 h-4 text-indigo-500" />
    )
  },
  {
    icon: Shield,
    title: 'Enterprise Ready',
    description: 'Team collaboration, version control, approval workflows, and enterprise security features.',
    color: 'from-emerald-500 to-teal-500',
    demo: (
      <Shield className="w-4 h-4 text-emerald-500" />
    )
  },
  {
    icon: Rocket,
    title: 'Export Anywhere',
    description: 'Export to multiple formats: Markdown, HTML, PDF, and integrate with popular documentation tools.',
    color: 'from-orange-500 to-red-500',
    demo: (
      <div className="flex space-x-1">
        <div className="text-xs px-1 py-0.5 bg-orange-500/20 rounded">MD</div>
        <div className="text-xs px-1 py-0.5 bg-blue-500/20 rounded">PDF</div>
      </div>
    )
  }
];

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-large gradient-text">
            Everything you need to create amazing READMEs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From SEO optimization to beautiful templates, we&apos;ve got all the tools 
            you need to make your projects stand out.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="relative h-full hover glass">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="opacity-60">
                      {feature.demo}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            <span className="text-lg font-medium">
              Ready to create your perfect README?
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
