import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">Analytics</h2>
      <p class="page-desc">View traffic, page views, and audience insights for your projects.</p>
      <div class="page-placeholder">
        <p>Analytics dashboard coming soon.</p>
      </div>
    </section>
  `,
})
export class DashboardAnalyticsComponent {}
