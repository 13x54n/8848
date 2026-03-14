import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

const DASHBOARD_PATHS = [
  'overview',
  'projects',
  'templates',
  'analytics',
  'speed-insights',
  'cdn',
  'storage',
  'agent',
  'usage',
  'support',
  'settings',
  'new-project',
];

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: '',
})
export class DashboardRedirectComponent {
  private readonly router = inject(Router);

  constructor() {
    const last =
      typeof localStorage !== 'undefined' ? localStorage.getItem('dashboardLastPath') : null;
    const path = last && DASHBOARD_PATHS.includes(last) ? last : 'overview';
    this.router.navigate(['/dashboard', path], { replaceUrl: true });
  }
}
