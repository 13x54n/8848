import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-support',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">Support</h2>
      <p class="page-desc">Get help, browse documentation, and contact support.</p>
      <div class="page-placeholder">
        <p>Support center coming soon.</p>
      </div>
    </section>
  `,
})
export class DashboardSupportComponent {}
