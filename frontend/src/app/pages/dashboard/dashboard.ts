import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import {
  lucideRocket,
  lucideFileText,
  lucideBarChart3,
  lucideGauge,
  lucideEye,
  lucideShield,
  lucideGlobe,
  lucidePuzzle,
  lucideDatabase,
  lucideFlag,
  lucideUser,
  lucideLayoutGrid,
  lucideHelpCircle,
  lucideSettings,
  lucideSearch,
  lucideRefreshCw,
  lucideLayoutList,
  lucidePlus,
  lucideChevronDown,
  lucideAlertTriangle,
  lucideMoreVertical,
  lucideCheck,
  lucideExternalLink,
  lucideBox,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  href?: string;
  active?: boolean;
}

interface Project {
  name: string;
  domain: string;
  repo: string;
  commit: string;
  date: string;
  status: 'ready' | 'building' | 'error';
}

interface Preview {
  title: string;
  branch: string;
  status: 'ready' | 'error';
  commit: string;
  hash: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HlmIconImports],
  providers: [
    provideIcons({
      lucideRocket,
      lucideFileText,
      lucideBarChart3,
      lucideGauge,
      lucideEye,
      lucideShield,
      lucideGlobe,
      lucidePuzzle,
      lucideDatabase,
      lucideFlag,
      lucideUser,
      lucideLayoutGrid,
      lucideHelpCircle,
      lucideSettings,
      lucideSearch,
      lucideRefreshCw,
      lucideLayoutList,
      lucidePlus,
      lucideChevronDown,
      lucideAlertTriangle,
      lucideMoreVertical,
      lucideCheck,
      lucideExternalLink,
      lucideBox,
    }),
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);

  protected readonly navItems: NavItem[] = [
    { label: 'Projects', icon: 'lucideBox', href: '#' },

    // { label: 'Analytics', icon: 'lucideBarChart3', href: '#' },
    // { label: 'Speed Insights', icon: 'lucideGauge', href: '#' },
    // { label: 'CDN', icon: 'lucideGlobe', href: '#' },
    { label: 'Storage', icon: 'lucideDatabase', href: '#' },
    { label: 'Agent', icon: 'lucideUser', href: '#' },
    { label: 'Usage', icon: 'lucideGauge', href: '#', active: true },
    { label: 'Support', icon: 'lucideHelpCircle', href: '#' },
    { label: 'Settings', icon: 'lucideSettings', href: '#' },
  ];

  protected readonly usageMetrics = [
    { label: 'ISR Reads', value: '65K', max: '1M', pct: 6.5 },
    { label: 'Edge Requests', value: '63K', max: '1M', pct: 6.3 },
    { label: 'Fast Origin Transfer', value: '537 MB', max: '10 GB', pct: 5.4 },
    { label: 'Fluid Active CPU', value: '11m 30s', max: '4h', pct: 4.8 },
  ];

  protected readonly projects: Project[] = [
    { name: 'demo-app', domain: 'demo-app.vercel.app', repo: 'you/demo-app', commit: 'Initial setup', date: 'Mar 13 on main', status: 'ready' },
    { name: 'landing', domain: 'landing.example.com', repo: 'you/landing', commit: 'Update hero section', date: 'Mar 12 on main', status: 'ready' },
    { name: 'api-gateway', domain: 'api.example.com', repo: 'you/api-gateway', commit: 'Add auth middleware', date: 'Mar 11 on main', status: 'building' },
    { name: 'docs', domain: 'docs.example.com', repo: 'you/docs', commit: 'Fix typo', date: 'Mar 10 on main', status: 'ready' },
    { name: 'blog', domain: 'blog.example.com', repo: 'you/blog', commit: 'New post', date: 'Mar 9 on main', status: 'ready' },
    { name: 'dashboard', domain: 'dashboard.example.com', repo: 'you/dashboard', commit: 'Add charts', date: 'Mar 8 on main', status: 'ready' },
  ];

  protected readonly previews: Preview[] = [
    { title: 'Add support for frontend', branch: 'Preview #1', status: 'ready', commit: 'Added support for frontend', hash: 'a1b2c3d' },
    { title: 'Fix backend build', branch: 'Preview #2', status: 'error', commit: 'fix: backend build issue', hash: 'e4f5g6h' },
    { title: 'Update dependencies', branch: 'Preview #3', status: 'ready', commit: 'chore: bump deps', hash: 'i7j8k9l' },
  ];

  protected viewMode: 'grid' | 'list' = 'grid';

  protected get projectLabel(): string {
    const email = this.authService.getEmail();
    if (!email) return "Your projects";
    const name = email.split('@')[0];
    return `${name}`;
  }
}
