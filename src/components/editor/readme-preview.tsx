'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ReadmePreviewProps {
  data: {
    projectName: string;
    description: string;
    repositoryUrl?: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    installation: Array<{
      packageManager: string;
      command: string;
    }>;
  };
  fullscreen?: boolean;
}

export function ReadmePreview({ data, fullscreen = false }: ReadmePreviewProps) {
  const markdownContent = useMemo(() => {
    const { projectName, description, repositoryUrl, features, installation } = data;
    
    // Generate badges
    const badges = [
      `![npm version](https://img.shields.io/npm/v/${projectName.toLowerCase().replace(/\s+/g, '-')}.svg)`,
      `![Build Status](https://img.shields.io/github/workflow/status/user/${projectName.toLowerCase().replace(/\s+/g, '-')}/CI)`,
      `![Coverage](https://img.shields.io/codecov/c/github/user/${projectName.toLowerCase().replace(/\s+/g, '-')})`,
      `![License](https://img.shields.io/npm/l/${projectName.toLowerCase().replace(/\s+/g, '-')}.svg)`
    ].join(' ');

    // Generate markdown
    let markdown = `<div align="center">
  
# ${projectName}

**${description}**

${badges}

${repositoryUrl ? `[View on GitHub](${repositoryUrl}) | [Documentation](#) | [Demo](#)` : '[Documentation](#) | [Demo](#)'}

</div>

---

## ✨ Features

${features.map(feature => `- **${feature.title}** - ${feature.description}`).join('\n')}

## 📦 Installation

Choose your preferred package manager:

${installation.map(install => `**${install.packageManager.toUpperCase()}**
\`\`\`bash
${install.command}
\`\`\``).join('\n\n')}

## 🚀 Quick Start

\`\`\`javascript
import { ${projectName.replace(/\s+/g, '')} } from '${projectName.toLowerCase().replace(/\s+/g, '-')}';

// Initialize the library
const app = new ${projectName.replace(/\s+/g, '')}({
  // Configuration options
});

// Use it in your project
app.start();
\`\`\`

## 📚 Documentation

For detailed documentation, please visit our [documentation site](#).

### API Reference

#### \`init(options)\`

Initialize the library with custom options.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`options\` | \`Object\` | \`{}\` | Configuration options |

#### \`start()\`

Start the application.

**Returns:** \`Promise<void>\`

## 🛠️ Development

Want to contribute? Great! Here's how to get started:

\`\`\`bash
# Clone the repository
git clone ${repositoryUrl || 'https://github.com/user/repo.git'}

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped make this project better
- Special thanks to the open source community
- Built with ❤️ by the ${projectName} team

---

<div align="center">
  Made with ❤️ by <a href="${repositoryUrl || '#'}">${projectName}</a>
</div>`;

    return markdown;
  }, [data]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent);
  };

  return (
    <div className={`${fullscreen ? 'p-6' : 'h-[calc(100vh-4rem)]'} bg-white dark:bg-gray-900`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="ml-4 text-sm font-mono">README.md</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Markdown
          </Button>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in GitHub
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className={`${fullscreen ? '' : 'h-full'} overflow-y-auto custom-scrollbar p-6`}>
        <Card className="prose prose-slate dark:prose-invert max-w-none">
          <div className="p-6">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-200 dark:border-gray-800 px-4 py-2">
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-purple-500 pl-4 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-purple-500 hover:text-purple-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg shadow-md max-w-full h-auto"
                  />
                )
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
}