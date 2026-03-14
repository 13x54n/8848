import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-cdn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">CDN</h2>
      <p class="page-desc">Configure and manage your global content delivery network.</p>
      <div class="page-placeholder">
        <p>CDN settings coming soon.</p>
      </div>
    </section>
  `,
})
export class DashboardCdnComponent {}
