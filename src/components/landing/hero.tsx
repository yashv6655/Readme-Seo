'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6">
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
            className="flex items-center space-x-2 md:space-x-4"
          >
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Templates
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Pricing
            </Button>
            <ThemeToggle />
          </motion.div>
        </nav>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center pb-56 md:pb-64 lg:pb-72">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            Built for developers who care about SEO
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance"
          >
            Create{' '}
            <span className="gradient-text">SEO-Optimized</span>
            <br />
            READMEs in Minutes
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance"
          >
            Build beautiful, professional README files that rank well on GitHub and Google.
            Perfect for open source projects, libraries, and developer tools.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto"
          >
            <Link href="/readme-review">
              <Button
                variant="gradient"
                size="lg"
                className="group w-full sm:w-auto"
              >
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              className="glass w-full sm:w-auto"
            >
              <Github className="mr-2 w-5 h-5" />
              View on GitHub
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 justify-center items-center text-center pt-6 md:pt-8 lg:pt-10 mb-16 md:mb-20 lg:mb-24 px-4"
          >
            <div className="space-y-1 text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text number-centered">10,000+</div>
              <div className="text-sm text-muted-foreground">READMEs Generated</div>
            </div>
            <div className="space-y-1 text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text number-centered">95%</div>
              <div className="text-sm text-muted-foreground">SEO Score Average</div>
            </div>
            <div className="space-y-1 text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text number-centered">2.3s</div>
              <div className="text-sm text-muted-foreground">Average Load Time</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Preview window */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="relative lg:absolute lg:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-2xl lg:max-w-4xl px-4 md:px-6 mt-10 md:mt-12"
      >
        <div className="glass-card p-4 md:p-6 lg:p-8 relative">
          {/* <div className="absolute top-4 left-4 flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div> */}
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold">Live README Preview</h3>
              <div className="hidden sm:flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Real-time updates</span>
              </div>
            </div>
            
            {/* Mock README content */}
            <div className="space-y-3 text-left">
              <div className="h-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded animate-pulse" />
              <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="h-4 bg-muted/50 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="flex space-x-2 pt-2">
                <div className="h-6 w-16 bg-green-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="h-6 w-20 bg-blue-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="h-6 w-18 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
