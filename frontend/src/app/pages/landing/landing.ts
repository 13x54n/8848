import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ThemeService } from '../../services/theme.service';
import { ViewportAnimateDirective } from '../../directives/viewport-animate.directive';

type LogoInput = string | string[];

interface PrimitiveTab {
  id: string;
  label: string;
  icon: string;
  headline: string;
  description: string;
  checklist: string[];
  ctaText: string;
  ctaLink: string;
  codeTitle: string;
  code: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ViewportAnimateDirective],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly selectedPrimitive = signal(0);
  protected readonly expandedFaq = signal<number | null>(null);

  protected toggleFaq(index: number): void {
    this.expandedFaq.update((v) => (v === index ? null : index));
  }

  protected getLogos(template: { logo: LogoInput; logoDark?: LogoInput }): string[] {
    const src = this.themeService.isDark() && template.logoDark ? template.logoDark : template.logo;
    return Array.isArray(src) ? src : [src];
  }

  protected readonly deployIcons = {
    github: { light: 'https://cdn.simpleicons.org/github/171515', dark: 'https://cdn.simpleicons.org/github/fafafa' },
    gitlab: { light: 'https://cdn.simpleicons.org/gitlab/fc6d26', dark: 'https://cdn.simpleicons.org/gitlab/fc6d26' },
  };

  protected getDeployIcon(name: 'github' | 'gitlab'): string {
    const icons = this.deployIcons[name];
    return this.themeService.isDark() ? icons.dark : icons.light;
  }
  protected readonly features = [
    {
      icon: '⚡',
      title: 'AI Apps',
      description:
        'Get started with pre-built templates. Stream LLM responses with zero-config infrastructure.',
      cta: 'Deploy AI Apps',
      link: '#',
    },
    {
      icon: '🌐',
      title: 'Web Apps',
      description:
        'Fast load times, zero overhead. Highly optimized infrastructure and CDN for better SEO.',
      cta: 'Learn more',
      link: '#',
    },
    {
      icon: '🛒',
      title: 'Ecommerce',
      description:
        'Streamline content creation with built-in previews and instant deployments.',
      cta: 'Explore',
      link: '#',
    },
  ];

  protected readonly frameworks = [
    'Frontend',
    'React',
    'Vue',
    'Svelte',
    'Angular',
    'Nuxt',
    'Astro',
  ];

  protected readonly templates = [
    {
      name: 'Frontend Frameworks',
      logo: [
        'https://imgs.search.brave.com/rvzgjz8KV3WQRSFhS4tqBZp-OBYhCCl5ZZB_EJscQLE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL2ZyZWUv/dGh1bWIvZnJlZS1y/ZWFjdC0zZC1pY29u/LWRvd25sb2FkLWlu/LXBuZy1ibGVuZC1m/YngtZ2x0Zi1maWxl/LWZvcm1hdHMtLWZh/Y2Vib29rLWxvZ28t/bmF0aXZlLWphdmFz/Y3JpcHQtbGlicmFy/eS11c2VyLWludGVy/ZmFjZXMtY29kaW5n/LWxhbmctcGFjay1s/b2dvcy1pY29ucy03/NTc4MDEwLnBuZz9m/PXdlYnA',
        'https://imgs.search.brave.com/9NdMD6jJ-RmKjSx6yzex7jfoTyTDeq0wR_Rt5kSOIKg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL2ZyZWUv/dGh1bWIvZnJlZS12/dWVqcy0zZC1pY29u/LXBuZy1kb3dubG9h/ZC0zNjQwMjk3LnBu/Zw',
        'https://imgs.search.brave.com/TQk5yJFSrE7eXSh06HlEftoIB-yA9i44omX2zNBwxT0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL2ZyZWUv/dGh1bWIvZnJlZS1h/bmd1bGFyanMtM2Qt/aWNvbi1wbmctZG93/bmxvYWQtNzU3Nzk5/NC5wbmc',
        'https://imgs.search.brave.com/2UO3-1gMse6DjwoG54jbmgh4qtOtw5kkQWFlFFVX-nY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL2ZyZWUv/dGh1bWIvZnJlZS1u/b2RlanMtM2QtaWNv/bi1wbmctZG93bmxv/YWQtNzU3ODAwMi5w/bmc',
      ],
      href: '#',
    },
    { name: 'Server Instance (Ubuntu)', logo: 'https://imgs.search.brave.com/OCrJwdTRhx81i3Pr4DekKRYROpKNZ_xITGBX09r9cEI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjIv/Nzg1LzI0Mi9zbWFs/bC9zcGxlbmRpZC1j/cmVhdGl2ZS1jcmlz/cC1lZGdlcy1jbG91/ZC1pY29uLXdpdGgt/ZmxhdC13aGl0ZS1m/aWxsLXN5bW1ldHJp/Y2FsLXdpdGgtc2Nh/bGFibGUtZGVzaWdu/LWdhbGxlcnktc3Rh/bmRhcmQtcG5nLnBu/Zw', href: '#' },
    { name: 'CDN & Storage', logo: 'https://imgs.search.brave.com/RKc8qoQcyPGQZxpgi_CMh9BQScnNmWKD567HcPaWA0I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL3ByZW1p/dW0vdGh1bWIvZmls/ZS1zdG9yYWdlLTNk/LWljb24tcG5nLWRv/d25sb2FkLTEwMzQ1/MDA1LnBuZw', href: '#' },
    {
      name: 'AI Agents',
      logo:
        'https://imgs.search.brave.com/0vR2_iLR5Guz1bAhGtQYPwyEHWA89V1pyGdmxn8a-rM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL3ByZW1p/dW0vdGh1bWIvYWkt/cm9ib3QtM2QtaWNv/bi1wbmctZG93bmxv/YWQtOTEwMDAwMi5w/bmc',
      href: '#'
    },
  ];

  protected readonly primitives: PrimitiveTab[] = [
    {
      id: 'ai-gateway',
      label: 'AI Gateway',
      icon: '☁️',
      headline: 'Power AI apps with AI Gateway',
      description:
        'Call OpenAI, Anthropic, or Gemini directly from your code without juggling keys or accounts. Every request is routed through one gateway, with usage tracking and safeguards included.',
      checklist: [
        'Use AI without managing API keys',
        'Switch between 30+ models',
        'Monitor usage and costs in one place',
      ],
      ctaText: 'Read the AI Gateway docs',
      ctaLink: '#',
      codeTitle: 'GENERATE ALT TEXT WITH OPENAI',
      code: `import OpenAI from "openai";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { description } = await req.json();
    if (!description) return new Response("Missing description", { status: 400 });

    const client = new OpenAI();
    const res = await client.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "user", content: \`Write concise alt text for: \${description}\` }],
    });

    return Response.json({ altText: res.output_text });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}

export const config = { path: "/api/alt-text" };`,
    },
    {
      id: 'serverless',
      label: 'Serverless functions',
      icon: '⚡',
      headline: 'Run code at the edge',
      description:
        'Deploy serverless functions that scale automatically. Write in TypeScript, Python, or Go. No cold starts, no infrastructure to manage.',
      checklist: [
        'Zero-config deployment',
        'Automatic scaling',
        'Built-in observability',
      ],
      ctaText: 'Explore serverless docs',
      ctaLink: '#',
      codeTitle: 'HELLO WORLD FUNCTION',
      code: `export default async function handler(req: Request) {
  return Response.json({
    message: "Hello from the edge!",
    timestamp: new Date().toISOString(),
  });
}

export const config = { path: "/api/hello" };`,
    },
    {
      id: 'data-storage',
      label: 'Data & storage',
      icon: '🗄️',
      headline: 'Persistent data made simple',
      description:
        'Store files, key-value data, and relational databases. Built-in backups, point-in-time recovery, and global replication.',
      checklist: [
        'Object storage for files',
        'Key-value store',
        'PostgreSQL-compatible DB',
      ],
      ctaText: 'Learn about storage',
      ctaLink: '#',
      codeTitle: 'READ AND WRITE KV',
      code: `import { kv } from "@platform/kv";

export default async function handler(req: Request) {
  const { key, value } = await req.json();
  if (value) await kv.set(key, value);
  const data = await kv.get(key);
  return Response.json({ [key]: data });
}`,
    },
    {
      id: 'image-cdn',
      label: 'Image CDN',
      icon: '🖼️',
      headline: 'Optimize images automatically',
      description:
        'Resize, crop, and convert images on the fly. WebP and AVIF support. Global CDN for fast delivery.',
      checklist: [
        'On-the-fly transformations',
        'Format conversion',
        'Global edge caching',
      ],
      ctaText: 'Image CDN docs',
      ctaLink: '#',
      codeTitle: 'RESIZE IMAGE',
      code: `// Use: /api/image?url=...&w=400&h=300
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const imgUrl = url.searchParams.get("url");
  const w = url.searchParams.get("w") || "800";
  const h = url.searchParams.get("h") || "600";
  return fetch(\`/cdn/image?url=\${imgUrl}&w=\${w}&h=\${h}\`);
}`,
    },
    {
      id: 'forms',
      label: 'Automatic forms',
      icon: '📝',
      headline: 'Handle forms without backend code',
      description:
        'Define form schemas and get validation, spam protection, and email notifications. No server code required.',
      checklist: [
        'Schema-based validation',
        'Spam protection',
        'Email notifications',
      ],
      ctaText: 'Form docs',
      ctaLink: '#',
      codeTitle: 'CONTACT FORM SCHEMA',
      code: `{
  "name": "contact",
  "fields": [
    { "name": "email", "type": "email", "required": true },
    { "name": "message", "type": "textarea", "required": true }
  ],
  "notify": "admin@example.com"
}`,
    },
  ];

  protected readonly plans = [
    {
      name: 'Hobby',
      description: 'Complete solution for your personal projects.',
      price: 'Free',
      priceNote: 'forever',
      features: [
        { title: 'Import & deploy in seconds', desc: 'Connect your repo and deploy with zero config.' },
        { title: 'Automatic CI/CD', desc: 'Every push triggers a build and preview deployment.' },
        { title: 'Web Application Firewall', desc: 'Built-in protection against common attacks.' },
        { title: 'Global CDN', desc: 'Fast delivery from edge locations worldwide.' },
      ],
      cta: 'Start Deploying',
      ctaVariant: 'gradient' as const,
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Everything you need to build and scale your app.',
      price: '2,700 NPR',
      priceNote: '/mo + usage',
      features: [
        { title: 'Included usage credit', desc: '2,700 NPR of usage included every month.' },
        { title: 'Advanced spend management', desc: 'Set budgets and get alerts before overages.' },
        { title: 'Team collaboration', desc: 'Invite teammates with free viewer seats.' },
        { title: 'Faster builds', desc: 'No queues, cold start prevention, priority support.' },
      ],
      cta: 'Start a free trial',
      ctaVariant: 'gradient' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Critical security, performance, and dedicated support.',
      price: 'Custom',
      priceNote: null as string | null,
      features: [
        { title: 'Guest & Team access controls', desc: 'Fine-grained permissions and SCIM sync.' },
        { title: 'Managed WAF Rulesets', desc: 'Custom security rules for your workloads.' },
        { title: 'Multi-region compute', desc: 'Failover and redundancy across regions.' },
        { title: '99.99% SLA', desc: 'Dedicated success manager and advanced support.' },
      ],
      cta: 'Contact Us',
      ctaVariant: 'dark' as const,
      popular: false,
    },
  ];

  protected readonly faqItems: { question: string; answer: string }[] = [
    { question: 'Which plan is right for me?', answer: 'Hobby is perfect for personal projects and learning. Pro suits teams building production apps with advanced features. Enterprise is for organizations needing custom SLAs, security, and dedicated support.' },
    { question: 'Do you offer custom invoicing?', answer: 'Yes. Enterprise plans include custom invoicing, purchase orders, and flexible payment terms. Contact our sales team for details.' },
    { question: 'How can I manage my spend?', answer: 'Pro and Enterprise plans include advanced spend management, usage alerts, and budget controls. You can set limits and receive notifications before hitting thresholds.' },
    { question: 'What payment methods do you accept?', answer: 'We accept major credit cards, debit cards, and bank transfers for Enterprise. All prices are in NPR (Nepalese Rupees).' },
    { question: 'Can I switch plans anytime?', answer: 'Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.' },
    { question: 'Is there a free trial for Pro?', answer: 'Yes. Pro includes a free trial so you can explore all features before committing. No credit card required to start.' },
    { question: 'What happens if I exceed my usage limits?', answer: 'Pro plans bill additional usage at the rates shown in the feature table. We\'ll notify you before significant overages. Enterprise has custom arrangements.' },
    { question: 'Do you offer discounts for startups?', answer: 'Yes. We have special programs for early-stage startups. Reach out to our team to learn about eligibility and discounts.' },
  ];
}
