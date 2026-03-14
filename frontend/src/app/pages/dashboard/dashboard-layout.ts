import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
  lucideLayoutTemplate,
  lucideSun,
  lucideMoon,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { GithubService } from '../../services/github.service';

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
      lucideLayoutTemplate,
      lucideBarChart3,
      lucideGauge,
      lucideGlobe,
      lucideDatabase,
      lucideUser,
      lucideHelpCircle,
      lucideSettings,
      lucideSearch,
      lucideSun,
      lucideMoon,
    }),
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard.css',
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  private readonly githubService = inject(GithubService);
  private readonly router = inject(Router);
  private sub?: { unsubscribe: () => void };

  protected userAvatarUrl: string | null = null;
  protected userName: string | null = null;

  protected readonly navItems: NavItem[] = [
    { label: 'Overview', icon: 'lucideLayoutDashboard', path: 'overview' },
    { label: 'Projects', icon: 'lucideBox', path: 'projects' },
    { label: 'Templates', icon: 'lucideLayoutTemplate', path: 'templates' },
    { label: 'Analytics', icon: 'lucideBarChart3', path: 'analytics' },
    { label: 'Speed Insights', icon: 'lucideGauge', path: 'speed-insights' },
    { label: 'CDN', icon: 'lucideGlobe', path: 'cdn' },
    { label: 'Storage', icon: 'lucideDatabase', path: 'storage' },
    { label: 'Agent', icon: 'lucideUser', path: 'agent' },
    { label: 'Usage', icon: 'lucideGauge', path: 'usage' },
    { label: 'Support', icon: 'lucideHelpCircle', path: 'support' },
    { label: 'Settings', icon: 'lucideSettings', path: 'settings' },
  ];

  ngOnInit(): void {
    const url = this.router.url;
    const match = url.match(/^\/dashboard\/([^/?#]+)/);
    if (match?.[1]) {
      localStorage.setItem('dashboardLastPath', match[1]);
    }
    this.githubService.getProfile().subscribe({
      next: (profile) => {
        this.userAvatarUrl = profile.avatarUrl ?? null;
        this.userName = profile.name ?? null;
      },
    });
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const match = url.match(/^\/dashboard\/([^/?#]+)/);
        if (match?.[1]) {
          localStorage.setItem('dashboardLastPath', match[1]);
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  protected get projectLabel(): string {
    if (this.userName) return this.userName;
    const email = this.authService.getEmail();
    if (!email) return 'Your projects';
    return email.split('@')[0];
  }
}
