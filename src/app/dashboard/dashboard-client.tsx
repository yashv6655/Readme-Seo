'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { Sparkles, FileText, Zap, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { AuthUser } from '@/lib/auth/types'

interface DashboardClientProps {
  user: AuthUser
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-20" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 md:left-20 w-24 h-24 md:w-32 md:h-32 bg-purple-500/10 rounded-full blur-xl floating" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-4 md:right-32 w-32 h-32 md:w-48 md:h-48 bg-blue-500/10 rounded-full blur-xl floating" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-20 h-20 md:w-24 md:h-24 bg-pink-500/10 rounded-full blur-xl floating" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-4 md:right-20 w-28 h-28 md:w-36 md:h-36 bg-indigo-500/10 rounded-full blur-xl floating" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-50 p-4 md:p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">README Generator</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UserMenu user={user} />
          </motion.div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Welcome Back!</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to create amazing READMEs? Choose your next step below.
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New README */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/readme-review">
              <Card className="glass-card hover:scale-105 transition-all duration-300 group cursor-pointer h-full">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl gradient-text">Create README</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Start a new README project with AI-powered optimization and SEO scoring.
                  </p>
                  <Button className="btn-gradient w-full group">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Browse Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/templates">
              <Card className="glass-card hover:scale-105 transition-all duration-300 group cursor-pointer h-full">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl gradient-text">Browse Templates</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Choose from professionally designed templates for different project types.
                  </p>
                  <Button variant="outline" className="w-full group glass">
                    View Templates
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/editor">
              <Card className="glass-card hover:scale-105 transition-all duration-300 group cursor-pointer h-full">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl gradient-text">Advanced Editor</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Use the full-featured editor with live preview and advanced formatting.
                  </p>
                  <Button variant="outline" className="w-full group glass">
                    Open Editor
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">50K+</div>
                  <div className="text-muted-foreground">READMEs Generated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                  <div className="text-muted-foreground">SEO Optimized</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}