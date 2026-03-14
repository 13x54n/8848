import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-storage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">Storage</h2>
      <p class="page-desc">Object storage and database management for your projects.</p>
      <div class="page-placeholder">
        <p>Storage management coming soon.</p>
      </div>
    </section>
  `,
})
export class DashboardStorageComponent {}
