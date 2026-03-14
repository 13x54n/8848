import { Injectable, signal } from '@angular/core';

export interface DeploymentContext {
  projectName: string;
  source: 'git' | 'template';
  /** e.g. "vercel/next.js" or "13x54n/repo-name" */
  sourceRepo: string;
  branch?: string;
  rootDir?: string;
  teamName?: string;
  commitHash?: string;
  /** Preview/screenshot image for the success card */
  previewImage?: string;
  /** Framework or template name (e.g. "NEXT.js") */
  projectTitle?: string;
}

@Injectable({ providedIn: 'root' })
export class DeploymentService {
  private readonly contextSignal = signal<DeploymentContext | null>(null);

  readonly context = this.contextSignal.asReadonly();

  setContext(ctx: DeploymentContext): void {
    this.contextSignal.set(ctx);
  }

  clearContext(): void {
    this.contextSignal.set(null);
  }
}
