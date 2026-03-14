import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-speed-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">Speed Insights</h2>
      <p class="page-desc">Monitor real user metrics and Core Web Vitals for your deployments.</p>
      <div class="page-placeholder">
        <p>Speed insights coming soon.</p>
      </div>
    </section>
  `,
})
export class DashboardSpeedInsightsComponent {}
