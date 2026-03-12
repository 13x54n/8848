import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideCircle,
  lucideCheck,
  lucideInfo,
  lucideLink,
  lucideSun,
  lucideMoon,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [HlmNavigationMenuImports, HlmIconImports, RouterLink],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideLink,
      lucideCircle,
      lucideCheck,
      lucideInfo,
      lucideSun,
      lucideMoon,
    }),
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly productItems = [
    { title: 'Deploy', description: 'Deploy your apps with one click.', href: '#' },
    { title: 'Analytics', description: 'Track performance and usage.', href: '#' },
    { title: 'Storage', description: 'Object storage and databases.', href: '#' },
    { title: 'Functions', description: 'Serverless edge functions.', href: '#' },
  ];

  protected readonly solutionsItems = [
    { title: 'Startups', description: 'Scale from zero to millions.', href: '#' },
    { title: 'Enterprise', description: 'Security and compliance.', href: '#' },
    { title: 'Ecommerce', description: 'High-performance stores.', href: '#' },
    { title: 'AI Apps', description: 'Build with AI infrastructure.', href: '#' },
  ];
}
