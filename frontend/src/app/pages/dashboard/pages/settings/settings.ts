import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideLogOut } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [CommonModule, HlmIconImports],
  providers: [provideIcons({ lucideLogOut })],
  template: `
    <section class="dashboard-page-content">
      <h2 class="page-title">Settings</h2>
      <p class="page-desc">Manage your account, team, and project settings.</p>
      <div class="page-placeholder">
        <p>Settings panel coming soon.</p>
      </div>
      <div class="settings-signout">
        <button type="button" class="settings-signout-btn" (click)="authService.logout()">
          <ng-icon name="lucideLogOut" class="settings-signout-icon" />
          Sign out
        </button>
      </div>
    </section>
  `,
  styles: [`
    .dashboard-page-content { padding: 0; }
    .page-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; }
    .page-desc { font-size: 0.875rem; color: rgba(255,255,255,0.5); margin: 0 0 1.5rem; }
    .page-placeholder { padding: 2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.5rem; color: rgba(255,255,255,0.5); }
    .settings-signout { margin-top: 2rem; }
    .settings-signout-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .settings-signout-btn:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
    }
    .settings-signout-icon { width: 1rem; height: 1rem; }
  `],
})
export class DashboardSettingsComponent {
  protected readonly authService = inject(AuthService);
}
