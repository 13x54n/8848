import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">Projects</h2>
      <p class="page-desc">Manage and deploy your projects. Connect your repositories and start building.</p>
      <div class="page-placeholder">
        <p>Project management interface coming soon.</p>
      </div>
    </section>
  `,
})
export class DashboardProjectsComponent {}
