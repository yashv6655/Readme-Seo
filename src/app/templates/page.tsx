'use client';

import { useRouter } from 'next/navigation';
import { TemplateGallery } from '@/components/templates/template-gallery';
import { ReadmeTemplate } from '@/types';

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelectTemplate = (template: ReadmeTemplate) => {
    // In a real app, you would save the template to state/storage
    // and redirect to the editor with the template pre-loaded
    router.push(`/editor?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <TemplateGallery onSelectTemplate={handleSelectTemplate} />
      </div>
    </div>
  );
}