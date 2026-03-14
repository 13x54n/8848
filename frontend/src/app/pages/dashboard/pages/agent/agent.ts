import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-agent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">Agent</h2>
      <p class="page-desc">Configure AI agents and automation for your projects.</p>
      <div class="page-placeholder">
        <p>Agent configuration coming soon.</p>
      </div>
    </section>
  `,
})
export class DashboardAgentComponent {}
