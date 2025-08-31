export interface ReadmeTemplate {
  id: string;
  name: string;
  description: string;
  content: ReadmeContent;
  category: TemplateCategory;
  isPremium?: boolean;
  usageCount?: number;
  createdAt?: Date;
}

export interface ReadmeContent {
  projectName: string;
  description: string;
  features: Feature[];
  installation: InstallationStep[];
  usage: UsageExample[];
  apiDocs?: ApiSection[];
  contributing?: string;
  license: License;
  badges: Badge[];
  sections?: CustomSection[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

export interface InstallationStep {
  id: string;
  packageManager: PackageManager;
  command: string;
  description?: string;
}

export interface UsageExample {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
}

export interface ApiSection {
  id: string;
  title: string;
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  description: string;
  parameters?: Parameter[];
  response?: ResponseExample;
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ResponseExample {
  code: number;
  body: string;
  description: string;
}

export interface Badge {
  id: string;
  type: BadgeType;
  label: string;
  message: string;
  color: string;
  url?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface SeoAnalysis {
  score: number;
  issues: SeoIssue[];
  suggestions: string[];
  keywordDensity: Record<string, number>;
  readabilityScore: number;
}

export interface SeoIssue {
  type: 'warning' | 'error';
  message: string;
  line?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  githubUsername?: string;
  plan: SubscriptionPlan;
  createdAt: Date;
}

export interface SavedReadme {
  id: string;
  userId: string;
  title: string;
  content: string;
  metadata: ReadmeMetadata;
  seoScore?: number;
  githubUrl?: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadmeMetadata {
  wordCount: number;
  sections: string[];
  lastSeoCheck?: Date;
  performance?: PerformanceMetrics;
}

export interface PerformanceMetrics {
  views: number;
  stars: number;
  forks: number;
  lastUpdated: Date;
}

// Enums
export type TemplateCategory = 
  | 'library' 
  | 'framework' 
  | 'cli-tool' 
  | 'web-app' 
  | 'mobile-app' 
  | 'api' 
  | 'documentation' 
  | 'other';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type BadgeType = 
  | 'npm-version'
  | 'npm-downloads'
  | 'build-status'
  | 'coverage'
  | 'license'
  | 'github-stars'
  | 'github-forks'
  | 'custom';

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export type License = 
  | 'MIT'
  | 'Apache-2.0'
  | 'GPL-3.0'
  | 'BSD-3-Clause'
  | 'ISC'
  | 'MPL-2.0'
  | 'CC0-1.0'
  | 'Unlicense'
  | 'Custom';

// Form types
export interface ReadmeFormData {
  projectName: string;
  description: string;
  repositoryUrl?: string;
  features: Feature[];
  installation: InstallationStep[];
  usage: UsageExample[];
  apiDocs?: ApiSection[];
  contributing?: string;
  license: License;
  badges: Badge[];
  customSections: CustomSection[];
}

// Component props types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}