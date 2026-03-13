import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideGlobe, lucideShield, lucideCpu, lucideFileText } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NavbarComponent } from '../../components/navbar/navbar';

type CellValue = 'check' | 'dash' | string;

interface FeatureRow {
  name: string;
  hobby: CellValue;
  pro: CellValue;
  enterprise: CellValue;
  info?: boolean;
}

interface FeatureSection {
  category: string;
  title: string;
  subtitle: string;
  icon?: string;
  subsections: { name?: string; rows: FeatureRow[] }[];
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, HlmIconImports],
  providers: [
    provideIcons({ lucideChevronDown, lucideGlobe, lucideShield, lucideCpu, lucideFileText }),
  ],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class PricingComponent {
  protected expandedFaq = signal<number | null>(null);

  protected toggleFaq(index: number): void {
    this.expandedFaq.update((v) => (v === index ? null : index));
  }

  protected readonly plans = [
    {
      name: 'Hobby',
      description: 'The perfect starting place for your web app or personal project.',
      price: 'Free forever.',
      priceNote: null,
      features: [
        'Import your repo, deploy in seconds',
        'Automatic CI/CD',
        'Web Application Firewall',
        'Global, automated CDN',
        'Fluid compute',
        'DDoS Mitigation',
        'Traffic & performance insights',
      ],
      cta: 'Start Deploying',
      ctaVariant: 'secondary' as const,
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Everything you need to build and scale your app.',
      price: '2,700 NPR',
      priceNote: '/mo + additional usage',
      features: [
        '2,700 NPR of included usage credit',
        'Advanced spend management',
        'Team collaboration & free viewer seats',
        'Faster builds + no queues',
        'Cold start prevention',
        'Enterprise add-ons',
      ],
      cta: 'Start a free trial',
      ctaVariant: 'primary' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Critical security, performance, observability, platform SLAs, and support.',
      price: 'Custom',
      priceNote: null,
      features: [
        'Guest & Team access controls',
        'SCIM & Directory Sync',
        'Managed WAF Rulesets',
        'Multi-region compute & failover',
        '99.99% SLA',
        'Advanced Support',
      ],
      cta: 'Get a demo',
      ctaVariant: 'primary' as const,
      ctaSecondary: 'Request Trial',
      popular: false,
    },
  ];

  protected readonly featureSections: FeatureSection[] = [
    {
      category: 'Managed Infrastructure',
      title: 'Vercel Delivery Network',
      subtitle: 'Ultra-fast, secure by default global application delivery.',
      icon: 'globe',
      subsections: [
        {
          name: 'Vercel Network',
          rows: [
            { name: 'Global Points of Presence', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Vercel Regions', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Automatic Routing', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'HTTPS Certificates', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'TLS/SSL Encryption', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Traffic Load Balancing', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Private Inter-Region Network', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Automatic Region Failover', hobby: 'check', pro: 'check', enterprise: 'check' },
          ],
        },
        {
          name: 'Configurable Routing',
          rows: [
            { name: 'Reverse Proxy', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Rewrites', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Redirects', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Middleware Support', hobby: 'check', pro: 'check', enterprise: 'check' },
          ],
        },
        {
          rows: [
            { name: 'Edge Requests', hobby: '1M / month included', pro: '10M / month included then starting at ₨270 per 1M', enterprise: 'Custom', info: true },
            { name: 'Fast Data Transfer', hobby: '100 GB / month included', pro: '1TB / month included then starting at NPR 20 per GB', enterprise: 'Custom', info: true },
          ],
        },
      ],
    },
    {
      category: 'Managed Infrastructure',
      title: 'Content, Caching & Optimization',
      subtitle: 'Store and cache content close to your customers.',
      subsections: [
        {
          name: 'Content Delivery',
          rows: [
            { name: 'Zero-config CDN cache', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Automated Compression', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Background Revalidation', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Stale-While-Revalidate', hobby: 'check', pro: 'check', enterprise: 'check' },
          ],
        },
        {
          rows: [
              { name: 'ISR Reads', hobby: '1M / month included', pro: 'Starting at NPR 54 per 1M', enterprise: 'Custom', info: true },
            { name: 'ISR Writes', hobby: '200,000 / month included', pro: 'Starting at NPR 540 per 1M', enterprise: 'Custom', info: true },
            { name: 'Bulk Redirects', hobby: 'dash', pro: '1K included per project, NPR 6,750 per month per 25K redirects', enterprise: 'Custom' },
            { name: 'Blob Storage Size', hobby: '1 GB / month included', pro: 'NPR 3 per GB', enterprise: 'Custom', info: true },
            { name: 'Blob Simple Operations', hobby: '10,000 / month included', pro: 'NPR 54 per 1M', enterprise: 'Custom', info: true },
            { name: 'Blob Advanced Operations', hobby: '2,000 / month included', pro: 'NPR 675 per 1M', enterprise: 'Custom', info: true },
            { name: 'Blob Data Transfer', hobby: '10 GB / month included', pro: 'Starting at ₨7 per GB', enterprise: 'Custom', info: true },
          ],
        },
      ],
    },
    {
      category: 'DX Platform',
      title: 'Build & Deploy',
      subtitle: 'Workflows from code to production.',
      icon: 'cpu',
      subsections: [
        {
          name: 'Builds',
          rows: [
            { name: 'Automatic CI/CD', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Environment Variables', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Build Logs', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Remote Cache', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Monorepo Support', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Webhook Triggers', hobby: 'dash', pro: 'check', enterprise: 'check' },
            { name: 'Custom Environments', hobby: 'dash', pro: '1 environment', enterprise: '12 environments' },
          ],
        },
        {
          name: 'Build minutes',
          rows: [
            { name: 'Standard machines', hobby: 'dash', pro: 'Starting at NPR 2 per minute', enterprise: 'Custom' },
            { name: 'Enhanced machines', hobby: 'dash', pro: 'Starting at NPR 4 per minute', enterprise: 'Custom' },
            { name: 'Turbo machines', hobby: 'dash', pro: 'Starting at NPR 17 per minute', enterprise: 'Custom' },
          ],
        },
        {
          name: 'Deployments',
          rows: [
            { name: 'Unlimited Deployments', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Environment Variables', hobby: 'check', pro: 'check', enterprise: 'check' },
            { name: 'Instant Rollback', hobby: 'check', pro: 'check', enterprise: 'check' },
          ],
        },
      ],
    },
    {
      category: 'Managed Infrastructure',
      title: 'Vercel Firewall',
      subtitle: 'Customizable security to protect your applications.',
      icon: 'shield',
      subsections: [
        {
          name: 'Web Application Firewall',
          rows: [
            { name: 'Custom Firewall Rules', hobby: 'Up to 3', pro: 'Up to 40', enterprise: 'Up to 1,000' },
            { name: 'IP Blocking', hobby: 'Up to 3', pro: 'Up to 100', enterprise: 'Up to 1,000' },
            { name: 'Rate Limiting', hobby: '1M allowed requests included / month', pro: 'Starting at NPR 68 per 1M allowed requests', enterprise: 'Custom' },
          ],
        },
      ],
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

  protected isCheck(value: CellValue): boolean {
    return value === 'check';
  }

  protected isDash(value: CellValue): boolean {
    return value === 'dash';
  }
}
