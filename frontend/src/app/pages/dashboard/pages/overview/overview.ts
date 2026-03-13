import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideLayoutGrid,
  lucideLayoutList,
  lucideSearch,
  lucideChevronDown,
  lucideCheck,
  lucideAlertTriangle,
  lucideExternalLink,
  lucideMoreVertical,
  lucideRefreshCw,
  lucideBell,
  lucideGitBranch,
  lucideZap,
  lucideActivity,
  lucideEye,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';

const DEFAULT_AVATAR_URL = 'https://avatars.githubusercontent.com/u/179059125?s=200&v=4';

interface Project {
  name: string;
  domain: string;
  repo: string;
  commit: string;
  date: string;
  branch: string;
  status: 'ready' | 'building' | 'error';
  /** Performance/quality score 0–100, shown as green badge when present */
  score?: number;
  /** Avatar image URL; falls back to first letter if absent */
  avatarUrl?: string;
  /** Show warning indicator (e.g. install issue) */
  hasWarning?: boolean;
}

interface Preview {
  title: string;
  branch: string;
  status: 'ready' | 'error';
  commit: string;
  hash: string;
  /** PR/Issue number (e.g. 1 → "#1") */
  prNumber?: number;
  /** Avatar URL; falls back to Ming when absent */
  avatarUrl?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmIconImports],
  providers: [
    provideIcons({
      lucideLayoutGrid,
      lucideLayoutList,
      lucideSearch,
      lucideChevronDown,
      lucideCheck,
      lucideAlertTriangle,
      lucideExternalLink,
      lucideMoreVertical,
      lucideRefreshCw,
      lucideBell,
      lucideGitBranch,
      lucideZap,
      lucideActivity,
      lucideEye,
    }),
  ],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css', '../../dashboard.css'],
})
export class DashboardOverviewComponent {
  protected readonly defaultAvatarUrl = DEFAULT_AVATAR_URL;

  protected readonly usageMetrics = [
    { label: 'ISR Reads', value: '65K', max: '1M', pct: 6.5 },
    { label: 'Edge Requests', value: '63K', max: '1M', pct: 6.3 },
    { label: 'Fast Origin Transfer', value: '537.08 MB', max: '10 GB', pct: 5.4 },
    { label: 'Fluid Active CPU', value: '11m 30s', max: '4h', pct: 4.8 },
  ];

  protected readonly projects: Project[] = [
    { name: 'ming-dev', domain: 'www.minginc.xyz', repo: '13x54n/ming-dev', commit: 'Added project links', date: '11/20/25', branch: 'main', status: 'ready', score: 99 },
    { name: 'laxmanrai', domain: 'laxmanrai-eta.vercel.app', repo: '13x54n/laxmanrai', commit: 'fix: minor streamlit issue', date: 'Mar 3', branch: 'main', status: 'ready' },
    { name: 'prompt-library', domain: 'prompt.minginc.xyz', repo: '13x54n/prompt-library', commit: 'Added GTag', date: 'Mar 2', branch: 'main', status: 'ready' },
    { name: 'rose', domain: 'rose.minginc.xyz', repo: '13x54n/rose', commit: 'Added firebase authentication', date: '11/26/25', branch: 'main', status: 'ready' },
    { name: 'sunya-landing-page', domain: 'sunya.minginc.xyz', repo: '13x54n/sunya-v1', commit: 'fix: trying fix for windows installation', date: 'Feb 23', branch: 'main', status: 'ready' },
    { name: 'sunya', domain: 'sunya.vercel.app', repo: '13x54n/sunya', commit: 'note: install.sh stopped and required to install...', date: '9/20/24', branch: 'main', status: 'ready', hasWarning: true },
    { name: 'thameltoronto', domain: 'thameltoronto.vercel.app', repo: '13x54n/thameltoronto', commit: 'chore: update deps', date: 'Mar 1', branch: 'main', status: 'ready' },
    { name: 'blog-ming-open-web', domain: 'blog-minginc.vercel.app', repo: '13x54n/blog-ming-open-web', commit: 'feat: add new article', date: 'Feb 28', branch: 'main', status: 'ready' },
  ];

  protected readonly previews: Preview[] = [
    { title: 'Fix React Server Components CVE vulnerability', branch: 'Preview #1', status: 'error', commit: 'fix: CVE patch', hash: '3ErXUBFuP', prNumber: 1 },
    { title: 'Added support for frontend', branch: 'Preview #2', status: 'ready', commit: 'Added support for frontend', hash: '3ErXUBFuP', prNumber: 11, avatarUrl: DEFAULT_AVATAR_URL },
    { title: 'fix: backend build issue fix', branch: 'Preview #3', status: 'ready', commit: 'fix: backend build', hash: '5wNYhx4TS', prNumber: 7, avatarUrl: DEFAULT_AVATAR_URL },
    { title: 'feat: added google auth to mobile except web', branch: 'Preview #4', status: 'ready', commit: 'feat: google auth', hash: 'D5xftw4na', prNumber: 6, avatarUrl: DEFAULT_AVATAR_URL },
    { title: 'Mobile auth test 58870 Fix: build issue fix', branch: 'Preview #5', status: 'error', commit: 'fix: build', hash: 'a1b2c3d', prNumber: 5 },
  ];

  protected viewMode: 'grid' | 'list' = 'grid';

  protected notificationOpen = false;

  protected readonly notifications: Notification[] = [
    { id: '1', title: 'Build completed', message: 'demo-app deployed successfully to production', time: '2m ago', read: false },
    { id: '2', title: 'Preview ready', message: 'Preview #3 for Add support for frontend is ready', time: '15m ago', read: false },
    { id: '3', title: 'Build failed', message: 'api-gateway build failed — check logs for details', time: '1h ago', read: true },
  ];

  protected get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  protected toggleNotifications(): void {
    this.notificationOpen = !this.notificationOpen;
  }

  protected closeNotifications(): void {
    this.notificationOpen = false;
  }
}
