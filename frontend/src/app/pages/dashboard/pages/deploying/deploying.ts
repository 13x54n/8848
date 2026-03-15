import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideGithub,
  lucideGitBranch,
  lucideFolder,
  lucideChevronDown,
  lucideChevronRight,
  lucideSearch,
  lucideGlobe,
  lucideZap,
  lucideClock,
  lucideExternalLink,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DeploymentService } from '../../../../services/deployment.service';
import { AuthService } from '../../../../services/auth.service';

type DeployStage = 'preparing' | 'deploying' | 'success';

const WAITING_LOGS = ['Waiting for build logs...'];

@Component({
  selector: 'app-dashboard-deploying',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmIconImports],
  providers: [
    provideIcons({
      lucideGithub,
      lucideGitBranch,
      lucideFolder,
      lucideChevronDown,
      lucideChevronRight,
      lucideSearch,
      lucideGlobe,
      lucideZap,
      lucideClock,
      lucideExternalLink,
    }),
  ],
  templateUrl: './deploying.html',
  styleUrls: ['./deploying.css', '../../dashboard.css'],
})
export class DashboardDeployingComponent implements OnInit, OnDestroy {
  private readonly deploymentService = inject(DeploymentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly stage = signal<DeployStage>('preparing');
  protected readonly deployStartedAt = signal<number>(0);
  protected readonly buildLogsExpanded = signal(true);
  protected readonly deploySummaryExpanded = signal(false);
  protected readonly domainsExpanded = signal(false);

  protected readonly ctx = computed(() => this.deploymentService.context());

  protected readonly teamLabel = computed(() => {
    const email = this.authService.getEmail();
    const username = email?.split('@')[0] ?? 'Your';
    return `${username}'s projects`;
  });

  protected readonly elapsedSeconds = computed(() => {
    const start = this.deployStartedAt();
    if (!start) return 0;
    return Math.floor((Date.now() - start) / 1000);
  });

  private timers: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    const ctx = this.deploymentService.context();
    if (!ctx) {
      this.router.navigate(['/dashboard/new-project']);
      return;
    }
    this.deployStartedAt.set(Date.now());

    this.timers.push(
      setTimeout(() => this.stage.set('deploying'), 2500),
      setTimeout(() => this.stage.set('success'), 8000)
    );
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
  }

  protected getBuildLogs(): string[] {
    return WAITING_LOGS;
  }

  protected continueToDashboard(): void {
    this.deploymentService.clearContext();
    this.router.navigate(['/dashboard/overview']);
  }

  protected importDifferent(): void {
    this.deploymentService.clearContext();
    this.router.navigate(['/dashboard/new-project']);
  }
}
