import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBarChart3,
  lucideGauge,
  lucideGlobe,
  lucideDatabase,
  lucideUser,
  lucideHelpCircle,
  lucideSettings,
  lucideSearch,
  lucideBox,
  lucideLayoutDashboard,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, HlmIconImports],
  providers: [
    provideIcons({
      lucideBox,
      lucideLayoutDashboard,
      lucideBarChart3,
      lucideGauge,
      lucideGlobe,
      lucideDatabase,
      lucideUser,
      lucideHelpCircle,
      lucideSettings,
      lucideSearch,
    }),
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard.css',
})
export class DashboardLayoutComponent {
  protected readonly authService = inject(AuthService);

  protected readonly navItems: NavItem[] = [
    { label: 'Overview', icon: 'lucideLayoutDashboard', path: 'overview' },
    { label: 'Projects', icon: 'lucideBox', path: 'projects' },
    { label: 'Analytics', icon: 'lucideBarChart3', path: 'analytics' },
    { label: 'Speed Insights', icon: 'lucideGauge', path: 'speed-insights' },
    { label: 'CDN', icon: 'lucideGlobe', path: 'cdn' },
    { label: 'Storage', icon: 'lucideDatabase', path: 'storage' },
    { label: 'Agent', icon: 'lucideUser', path: 'agent' },
    { label: 'Usage', icon: 'lucideGauge', path: 'usage' },
    { label: 'Support', icon: 'lucideHelpCircle', path: 'support' },
    { label: 'Settings', icon: 'lucideSettings', path: 'settings' },
  ];

  protected get projectLabel(): string {
    const email = this.authService.getEmail();
    if (!email) return 'Your projects';
    return email.split('@')[0];
  }
}
