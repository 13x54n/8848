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
  styles: [`
    .dashboard-page-content { padding: 0; }
    .page-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; }
    .page-desc { font-size: 0.875rem; color: rgba(255,255,255,0.5); margin: 0 0 1.5rem; }
    .page-placeholder { padding: 2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.5rem; color: rgba(255,255,255,0.5); }
  `],
})
export class DashboardAgentComponent {}
