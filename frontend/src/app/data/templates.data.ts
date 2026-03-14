export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  repoUrl?: string;
  rootDir?: string;
  useCases: string[];
  stack?: string[];
  /** GitHub repo display (e.g. "vercel/next.js") */
  repoDisplay?: string;
  /** Optional README/getting started content */
  readmeSnippet?: string;
  demoUrl?: string;
  /** Preview/screenshot image (larger than thumbnail) */
  previewImage?: string;
}

export const USE_CASES = [
  'AI',
  'Starter',
  'Ecommerce',
  'SaaS',
  'Blog',
  'Portfolio',
  'CMS',
  'Backend',
  'Edge Functions',
  'Edge Middleware',
  'Edge Config',
  'Cron',
  'Multi-Tenant Apps',
  'Realtime Apps',
  'Documentation',
  'Virtual Event',
  'Monorepos',
  'Web3',
  'Vercel Firewall',
  'Microfrontends',
  'Authentication',
  'Marketing Sites',
] as const;

export const TEMPLATES: TemplateItem[] = [
  { id: 'nextjs-boilerplate', title: 'Next.js Boilerplate', description: 'Get started with Next.js and React in seconds.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/next.js', rootDir: 'examples/nextjs', useCases: ['Starter'], stack: ['Next.js', 'CSS Modules'], repoDisplay: 'vercel/next.js', demoUrl: 'https://nextjs.org', previewImage: 'https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1aHobcZ8H6WY48u5CMXlOe%2F0f0efe6bd469985b692555fbcad1cc01%2Fnextjs-template.png&w=1080&q=75' },
  { id: 'image-gallery', title: 'Image Gallery Starter', description: 'An image gallery built on Next.js and Cloudinary.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/examples/tree/main/image-gallery', useCases: ['Starter', 'Portfolio'] },
  { id: 'chatbot', title: 'Chatbot', description: 'A full-featured, hackable Next.js AI chatbot built by Vercel.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/ai-chatbot', useCases: ['AI', 'Starter'], stack: ['Next.js', 'AI SDK'], repoDisplay: 'vercel/ai-chatbot' },
  { id: 'nextra-docs', title: 'Nextra: Docs Starter Kit', description: 'Simple, powerful and flexible markdown-powered docs site. Built with Next.js and MDX.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/shuding/nextra', useCases: ['Documentation'] },
  { id: 'express-bun', title: 'Express on Bun', description: 'Deploy Express backends using the Bun runtime.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/examples/tree/main/express', useCases: ['Backend'] },
  { id: 'hono-bun', title: 'Hono on Bun', description: 'Deploy Hono backends using the Bun runtime.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/honojs/hono', useCases: ['Backend'] },
  { id: 'nextjs-commerce', title: 'Next.js Commerce', description: 'Starter kit for high-performance commerce with Shopify.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/commerce', useCases: ['Ecommerce'] },
  { id: 'lead-agent', title: 'Lead Agent', description: 'An inbound lead qualification and research agent built with Next.js, AI.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/ai', useCases: ['AI', 'SaaS'] },
  { id: 'app-router-playground', title: 'Next.js App Router Playground', description: 'Examples of many Next.js App Router features.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/next.js', useCases: ['Starter'] },
  { id: 'platforms-starter', title: 'Platforms Starter Kit', description: 'Next.js template for building multi-tenant applications with the App Router.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/platforms', useCases: ['Multi-Tenant Apps', 'SaaS'] },
  { id: 'portfolio-starter', title: 'Portfolio Starter Kit', description: 'Easily create a portfolio with Next.js and Markdown.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/next.js', useCases: ['Portfolio'] },
  { id: 'vite-react', title: 'Vite + React Starter', description: 'Vite/React site that can be deployed to Vercel.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vitejs/vite', useCases: ['Starter'], stack: ['Vite', 'React'], repoDisplay: 'vitejs/vite' },
  { id: 'express-vercel', title: 'Express.js on Vercel', description: 'Simple Express.js + Vercel example that serves html content.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/examples/tree/main/express', useCases: ['Backend'] },
  { id: 'isr-blog', title: 'ISR Blog with Next.js', description: 'An Incremental Static Regeneration Blog Example Using Next.js.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/next.js', useCases: ['Blog'] },
  { id: 'enterprise-boilerplate', title: 'Next.js Enterprise Boilerplate', description: 'Enterprise-grade Next.js boilerplate built with Tailwind CSS, Radix UI.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/Blazity/next-enterprise', useCases: ['Starter', 'SaaS'] },
  { id: 'blog-starter', title: 'Blog Starter Kit', description: 'A blog starter built with Next.js and Markdown.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/vercel/next.js', useCases: ['Blog'] },
  { id: 'contentlayer-blog', title: 'Next.js Contentlayer Blog', description: 'A blog using Next.js and Contentlayer for content management.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/contentlayerdev/contentlayer', useCases: ['Blog', 'CMS'] },
  { id: 'slack-agent', title: 'Slack Agent Template', description: 'A Slack Agent template built with Bolt for JavaScript (TypeScript).', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4', repoUrl: 'https://github.com/slackapi/bolt-js', useCases: ['AI', 'Backend'] },
];
