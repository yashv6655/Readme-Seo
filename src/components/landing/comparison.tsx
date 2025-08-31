'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SeoScore } from '@/components/ui/seo-score';

export function Comparison() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  const beforeContent = {
    title: "# My Project",
    content: `This is my project. It does things.

## Installation
Install it somehow.

## Usage
Use it like this.

That's it.`,
    issues: [
      "No SEO optimization",
      "Missing project description",
      "No installation instructions",
      "No badges or social proof",
      "Poor formatting and structure",
      "No contributing guidelines"
    ],
    seoScore: 23
  };

  const afterContent = {
    title: "# 🚀 My Project - Revolutionary Developer Tool",
    content: `<div align="center">
  <img src="logo.png" alt="My Project Logo" width="120">
  
  **Build amazing applications with zero configuration**
  
  [![npm version](https://badge.fury.io/js/my-project.svg)](https://www.npmjs.com/package/my-project)
  [![Build Status](https://github.com/user/my-project/workflows/CI/badge.svg)](https://github.com/user/my-project/actions)
  [![Coverage](https://codecov.io/gh/user/my-project/branch/main/graph/badge.svg)](https://codecov.io/gh/user/my-project)
</div>

## ✨ Features

- 🔥 **Zero Configuration** - Works out of the box
- ⚡ **Lightning Fast** - Built for performance
- 🎨 **Beautiful UI** - Stunning design system
- 🔒 **Type Safe** - Full TypeScript support

## 📦 Installation

\`\`\`bash
npm install my-project
# or
yarn add my-project
# or  
pnpm add my-project
\`\`\``,
    benefits: [
      "SEO optimized with keywords",
      "Clear value proposition",
      "Professional badges and stats",
      "Detailed installation guide",
      "Beautiful formatting",
      "Complete documentation"
    ],
    seoScore: 94
  };

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-large">
            Transform Your{' '}
            <span className="gradient-text">README</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the dramatic difference between a basic README and one optimized 
            with our generator. Your projects deserve better.
          </p>
        </motion.div>

        {/* Comparison Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="glass rounded-lg p-1 inline-flex">
            <Button
              variant={activeTab === 'before' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('before')}
              className="rounded-md"
            >
              😞 Before
            </Button>
            <Button
              variant={activeTab === 'after' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('after')}
              className="rounded-md"
            >
              🚀 After
            </Button>
          </div>
        </motion.div>

        {/* Comparison Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* README Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass h-full">
              <CardHeader className="border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="ml-4 text-sm font-mono">README.md</span>
                  </CardTitle>
                  <SeoScore 
                    score={activeTab === 'before' ? beforeContent.seoScore : afterContent.seoScore}
                    size="sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                    {activeTab === 'before' ? beforeContent.content : afterContent.content}
                  </pre>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits/Issues List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {activeTab === 'before' ? (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>Issues with Basic README</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Benefits of Optimized README</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(activeTab === 'before' ? beforeContent.issues : afterContent.benefits).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    {activeTab === 'before' ? (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* CTA */}
            {activeTab === 'after' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass border-green-500/20 bg-green-500/5">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Ready to transform your README?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join <span className="number-centered">10,000+</span> developers who've improved their project documentation
                    </p>
                    <Button variant="gradient" size="lg" className="group">
                      Get Started Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}