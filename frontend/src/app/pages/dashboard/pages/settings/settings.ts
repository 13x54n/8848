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
})
export class DashboardSettingsComponent {
  protected readonly authService = inject(AuthService);
}
