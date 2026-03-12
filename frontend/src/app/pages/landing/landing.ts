import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {
  protected readonly themeService = inject(ThemeService);

  protected getLogo(template: { logo: string; logoDark?: string }): string {
    return this.themeService.isDark() && template.logoDark ? template.logoDark : template.logo;
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
    'Next.js',
    'React',
    'Vue',
    'Svelte',
    'Angular',
    'Nuxt',
    'Astro',
  ];

  protected readonly templates = [
    { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs/000', logoDark: 'https://cdn.simpleicons.org/nextdotjs/fff', href: '#' },
    { name: 'Svelte', logo: 'https://cdn.simpleicons.org/svelte/ff3e00', href: '#' },
    { name: 'React', logo: 'https://cdn.simpleicons.org/react/61dafb', href: '#' },
    { name: 'Node', logo: 'https://imgs.search.brave.com/QeyLGtJg2ZFN6KTGHm_v51C1IiiHA22LAJfCNSq_X_8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yYXcu/Z2l0aHVidXNlcmNv/bnRlbnQuY29tL3Bo/ZXJhbGIvc3ZnbC9t/YWluL3N0YXRpYy9s/aWJyYXJ5L25vZGVq/cy5zdmc', href: '#' },
    { name: 'Astro', logo: 'https://cdn.simpleicons.org/astro/ff5d01', href: '#' },
    { name: 'Python', logo: 'https://cdn.simpleicons.org/python/3776ab', href: '#' },
  ];
}
