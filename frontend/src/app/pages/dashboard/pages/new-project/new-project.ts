import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EMPTY, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideLink,
  lucideSearch,
  lucideChevronDown,
  lucideExternalLink,
  lucideGithub,
  lucideLock,
  lucideGitBranch,
  lucideFolder,
  lucideChevronRight,
  lucideChevronUp,
  lucideAlertTriangle,
  lucideClock,
  lucideGlobe,
  lucideZap,
  lucideInfo,
  lucideFileText,
  lucideMinus,
  lucidePlus,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { AuthService } from '../../../../services/auth.service';
import { ThemeService } from '../../../../services/theme.service';
import { GithubService, RepoInfo } from '../../../../services/github.service';
import { DeploymentService } from '../../../../services/deployment.service';
import { ProjectService } from '../../../../services/project.service';
import { TEMPLATES } from '../../../../data/templates.data';

const DEFAULT_AVATAR_URL = 'https://avatars.githubusercontent.com/u/179059125?s=200&v=4';

type DeployStage = 'idle' | 'preparing' | 'deploying' | 'success' | 'failed';

/** Shown only when deploying and no real logs have arrived yet */
const WAITING_LOGS = ['Waiting for build logs...'];

interface Template {
  title: string;
  description: string;
  thumbnail: string;
  repoUrl?: string;
  rootDir?: string;
}

@Component({
  selector: 'app-dashboard-new-project',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HlmIconImports],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideLink,
      lucideSearch,
      lucideChevronDown,
      lucideExternalLink,
      lucideGithub,
      lucideLock,
      lucideGitBranch,
      lucideFolder,
      lucideChevronRight,
    lucideChevronUp,
    lucideAlertTriangle,
    lucideClock,
    lucideGlobe,
    lucideZap,
    lucideInfo,
    lucideFileText,
    lucideMinus,
    lucidePlus,
  }),
  ],
  templateUrl: './new-project.html',
  styleUrls: ['./new-project.css', '../../dashboard.css'],
})
export class DashboardNewProjectComponent implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly githubService = inject(GithubService);
  private readonly deploymentService = inject(DeploymentService);
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly defaultAvatarUrl = DEFAULT_AVATAR_URL;
  protected gitUrl = '';
  protected githubLoading = true;
  protected reposLoading = false;
  protected repos: RepoInfo[] = [];
  protected repoSearch = '';
  private recentRepos: RepoInfo[] = [];
  private search$ = new Subject<string>();
  private searchSub?: { unsubscribe: () => void };

  protected readonly templates: Template[] = [
    { title: 'Next.js Boilerplate', description: 'Get started with Next.js and React in seconds.', thumbnail: 'https://imgs.search.brave.com/M3G6-uCQzBReMrqZMR1iApS5xW4HBIZSJzg7W6SO6no/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bmV4dGpzLmNuL3N0/YXRpYy9pbWFnZXMv/bmV4dGpzLWJpZy1s/b2dvLnBuZw', repoUrl: 'https://github.com/vercel/vercel/tree/main/examples/nextjs' },
    { title: 'Chatbot', description: 'A full-featured, hackable Next.js AI chatbot built by Vercel.', thumbnail: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', repoUrl: 'https://github.com/vercel/ai-chatbot' },
    { title: 'Vite + React Starter', description: 'Vite/React site that can be deployed to Vercel.', thumbnail: 'https://imgs.search.brave.com/PIr7d9GA92IugBRVujTlVzkYkEQKz2pIvLvMgCBQ4Vk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW5ub2tyZWEuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA2L3JlYWN0LXZp/dGUtMTAyNHg1NzYu/anBn', repoUrl: 'https://github.com/vercel/vite' },
    { title: 'Express.js on Vercel', description: 'Simple Express.js + Vercel example that serves html conten...', thumbnail: 'https://imgs.search.brave.com/fI6g_ccITXY0dYgym3IrpEGRcS4nNReQDQtI-50S4P4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibGFu/Y2hlZGFsbW9uZC1s/b3VzZS0zNTEzNDYu/aG9zdGluZ2Vyc2l0/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjUvMDQvMjkt/MS0xMDI0eDU3Ni5w/bmc', repoUrl: 'https://github.com/vercel/examples/tree/main/express' },
  ];

  protected selectedSource: 'none' | 'git' | 'template' = 'none';
  protected selectedRepo: RepoInfo | null = null;
  protected selectedTemplate: Template | null = null;
  protected projectName = '';
  protected privateRepoName = '';
  protected privateRepo = true;
  protected applicationPreset = 'Other';
  protected rootDirectory = './';
  protected buildExpanded = false;
  protected envExpanded = false;
  protected rootDirModalOpen = false;
  protected buildCommand = '';
  protected outputDirectory = '';
  protected installCommand = '';
  protected useDefaultBuild = false;
  protected useDefaultOutput = false;
  protected useDefaultInstall = false;
  protected envVars: { key: string; value: string }[] = [{ key: 'EXAMPLE_NAME', value: 'I9JU23NF394R6HH' }];
  protected presetDropdownOpen = false;
  protected teamDropdownOpen = false;
  protected gitScopeDropdownOpen = false;
  protected selectedTeam = { label: "Your projects", plan: 'Hobby' };
  protected selectedGitScope = { label: 'Your account', icon: 'lucideGithub' };

  protected readonly deploymentStage = signal<DeployStage>('idle');
  protected readonly deployStartedAt = signal<number>(0);
  protected readonly deployEndedAt = signal<number | null>(null);
  private readonly deployTick = signal(0);
  protected readonly buildLogs = signal<string[]>([]);
  protected readonly deploymentError = signal<string | null>(null);
  protected readonly deploymentErrorStatus = signal<number | null>(null);
  protected readonly buildLogsExpanded = signal(true);
  protected readonly deploySummaryExpanded = signal(false);
  protected readonly domainsExpanded = signal(false);

  protected readonly deployCtx = computed(() => this.deploymentService.context());
  protected readonly teamLabel = computed(() => {
    const email = this.authService.getEmail();
    const username = email?.split('@')[0] ?? 'Your';
    return `${username}'s projects`;
  });
  protected readonly elapsedSeconds = computed(() => {
    const start = this.deployStartedAt();
    this.deployTick(); // depend on tick so we recompute every second
    if (!start) return 0;
    const end = this.deployEndedAt();
    const now = end ?? Date.now();
    return Math.floor((now - start) / 1000);
  });
  protected readonly deployStartedAtStr = computed(() => {
    const t = this.deployStartedAt();
    if (!t) return '';
    return new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  });
  protected readonly deployEndedAtStr = computed(() => {
    const t = this.deployEndedAt();
    if (!t) return '';
    return new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  });

  private deploymentTimers: ReturnType<typeof setTimeout>[] = [];
  private deploymentTickInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly rootDirTree: { id: string; label: string; path: string; expandable: boolean; hasWarning?: boolean; hasAlert?: boolean }[] = [
    { id: 'root', label: '8848 (root)', path: './', expandable: false, hasWarning: true },
    { id: 'backend', label: 'backend', path: 'backend', expandable: true, hasWarning: true },
    { id: 'docs', label: 'docs', path: 'docs', expandable: true, hasWarning: true },
    { id: 'frontend', label: 'frontend', path: 'frontend', expandable: true, hasAlert: true },
  ];

  protected readonly applicationPresets = [
    'Angular',
    'Astro',
    'Blitz.js (Legacy)',
    'Brunch',
    'Create React App',
    'Django',
    'Docusaurus',
    'Eleventy',
    'Expo',
    'Gatsby',
    'Hugo',
    'Next.js',
    'Nuxt.js',
    'Other',
    'Preact',
    'Remix',
    'Svelte',
    'Vite',
    'Vue',
  ];

  protected readonly teamOptions = [
    { label: "Your projects", plan: 'Hobby' },
  ];

  protected readonly gitScopeOptions = [
    { label: 'Your account', icon: 'lucideGithub' },
  ];

  protected selectPreset(preset: string): void {
    this.applicationPreset = preset;
    this.presetDropdownOpen = false;
    this.cdr.markForCheck();
  }

  protected selectTeam(opt: { label: string; plan: string }): void {
    this.selectedTeam = opt;
    this.teamDropdownOpen = false;
    this.cdr.markForCheck();
  }

  protected selectGitScope(opt: { label: string; icon: string }): void {
    this.selectedGitScope = opt;
    this.gitScopeDropdownOpen = false;
    this.cdr.markForCheck();
  }

  protected githubConnected = false;
  protected reposError = '';
  private loadTimeout: ReturnType<typeof setTimeout> | null = null;
  private reposTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    const templateId = this.route.snapshot.queryParamMap.get('template');
    if (templateId) {
      const t = TEMPLATES.find((x) => x.id === templateId);
      if (t) {
        this.selectTemplate({ title: t.title, description: t.description, thumbnail: t.thumbnail, repoUrl: t.repoUrl, rootDir: t.rootDir });
        this.router.navigate(['/dashboard/new-project'], { replaceUrl: true });
        this.cdr.markForCheck();
        return;
      }
    }
    const justConnected = this.route.snapshot.queryParamMap.get('github') === 'connected';
    if (justConnected) {
      this.githubService.connect();
      this.githubConnected = true;
      this.githubLoading = false;
      this.router.navigate(['/dashboard/new-project'], { replaceUrl: true });
      this.loadRecentRepos();
      this.setupSearch();
      return;
    }

    // Fallback: if API doesn't respond in 5s, show Connect GitHub
    this.loadTimeout = setTimeout(() => {
      if (this.githubLoading) {
        this.githubConnected = false;
        this.githubLoading = false;
        this.cdr.markForCheck();
      }
    }, 5000);

    this.githubService.getProfile().subscribe({
      next: (res) => {
        this.clearLoadTimeout();
        this.githubConnected = res?.githubConnected ?? false;
        this.githubLoading = false;
        this.githubService.setConnected(this.githubConnected);
        if (this.githubConnected) {
          this.loadRecentRepos();
          this.setupSearch();
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.clearLoadTimeout();
        this.githubConnected = false;
        this.githubLoading = false;
        this.githubService.setConnected(false);
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    this.deploymentTimers.forEach((t) => clearTimeout(t));
    if (this.deploymentTickInterval) {
      clearInterval(this.deploymentTickInterval);
    }
  }

  private setupSearch(): void {
    this.searchSub = this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          if (!q.trim()) {
            this.repos = [...this.recentRepos];
            this.reposLoading = false;
            this.reposError = '';
            this.cdr.markForCheck();
            return EMPTY;
          }
          this.reposLoading = true;
          this.reposError = '';
          this.cdr.markForCheck();
          return this.githubService.getRepos(q);
        }),
      )
      .subscribe({
        next: (repos) => {
          this.repos = Array.isArray(repos) ? repos : [];
          this.reposLoading = false;
          this.reposError = '';
          this.cdr.markForCheck();
        },
        error: () => {
          this.reposLoading = false;
          this.reposError = 'Could not search repositories.';
          this.cdr.markForCheck();
        },
      });
  }

  protected onRepoSearchInput(): void {
    const q = this.repoSearch.trim();
    if (!q) {
      this.repos = [...this.recentRepos];
      this.reposLoading = false;
      this.reposError = '';
      this.cdr.markForCheck();
      return;
    }
    this.search$.next(this.repoSearch);
  }

  private clearLoadTimeout(): void {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }
  }

  protected loadRecentRepos(): void {
    this.reposLoading = true;
    this.reposError = '';
    this.repos = [];
    this.recentRepos = [];

    // Fallback: if repos don't load in 15s, show error
    this.reposTimeout = setTimeout(() => {
      if (this.reposLoading) {
        this.reposLoading = false;
        this.reposError = 'Could not load repositories. You can still paste a Git URL above to deploy.';
        this.cdr.markForCheck();
      }
    }, 15000);

    this.githubService.getRepos().subscribe({
      next: (repos) => {
        this.clearReposTimeout();
        const list = repos ?? [];
        this.recentRepos = list;
        this.repos = list;
        this.reposLoading = false;
        this.reposError = '';
        this.cdr.markForCheck();
      },
      error: () => {
        this.clearReposTimeout();
        this.repos = [];
        this.recentRepos = [];
        this.reposLoading = false;
        this.reposError = 'Could not load repositories. Make sure GitHub is connected.';
        this.cdr.markForCheck();
      },
    });
  }

  protected loadRepos(): void {
    this.loadRecentRepos();
  }

  private clearReposTimeout(): void {
    if (this.reposTimeout) {
      clearTimeout(this.reposTimeout);
      this.reposTimeout = null;
    }
  }

  protected getProjectTypeLogo(projectType: string | null): string {
    const t = (projectType ?? 'Other').toLowerCase();
    const isDark = this.themeService.isDark();
    const base = 'https://cdn.simpleicons.org';
    // Icons with black/dark fill need light color on dark theme
    const darkOnLight = (slug: string, lightHex: string) =>
      `${base}/${slug}/${isDark ? 'fafafa' : lightHex}`;
    const brand = (slug: string, hex: string) => `${base}/${slug}/${hex}`;
    if (t.includes('next')) return darkOnLight('nextdotjs', '000000');
    if (t.includes('react')) return brand('react', '61DAFB');
    if (t.includes('angular')) return brand('angular', 'DD0031');
    if (t.includes('vue')) return brand('vuedotjs', '4FC08D');
    if (t.includes('svelte')) return brand('svelte', 'FF3E00');
    if (t.includes('nuxt')) return brand('nuxtdotjs', '00DC82');
    if (t.includes('remix')) return darkOnLight('remix', '000000');
    if (t.includes('express')) return darkOnLight('express', '000000');
    if (t.includes('node')) return brand('nodedotjs', '339933');
    if (t.includes('python')) return brand('python', '3776AB');
    if (t.includes('java')) return brand('openjdk', '437291');
    if (t.includes('go')) return brand('go', '00ADD8');
    if (t.includes('rust')) return darkOnLight('rust', '000000');
    if (t.includes('ruby')) return brand('ruby', 'CC342D');
    if (t.includes('php')) return brand('php', '777BB4');
    return brand('github', isDark ? 'fafafa' : '171515');
  }

  protected formatUpdated(updatedAt: string | null): string {
    if (!updatedAt) return '';
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  protected importRepo(repo: RepoInfo): void {
    this.selectedRepo = repo;
    this.selectedTemplate = null;
    this.selectedSource = 'git';
    this.gitUrl = repo.cloneUrl ?? '';
    this.privateRepoName = repo.name + '-' + Math.random().toString(36).slice(2, 6);
    this.projectName = repo.name + '-' + Math.random().toString(36).slice(2, 6);
    this.cdr.markForCheck();
  }

  protected selectTemplate(t: Template): void {
    this.selectedTemplate = t;
    this.selectedRepo = null;
    this.selectedSource = 'template';
    const base = t.title.toLowerCase().replace(/\s+/g, '-');
    const suffix = Math.random().toString(36).slice(2, 6);
    this.privateRepoName = base + '-' + suffix;
    this.projectName = base + '-' + suffix;
    this.rootDirectory = t.rootDir ?? './';
    this.cdr.markForCheck();
  }

  protected clearSelection(): void {
    this.selectedSource = 'none';
    this.selectedRepo = null;
    this.selectedTemplate = null;
    this.gitUrl = '';
    this.cdr.markForCheck();
  }

  protected openRootDirModal(): void {
    this.rootDirModalOpen = true;
  }

  protected closeRootDirModal(): void {
    this.rootDirModalOpen = false;
  }

  protected selectRootDir(path: string): void {
    this.rootDirectory = path === './' ? './' : path;
    this.rootDirModalOpen = false;
    this.cdr.markForCheck();
  }

  protected addEnvVar(): void {
    this.envVars.push({ key: '', value: '' });
    this.cdr.markForCheck();
  }

  protected removeEnvVar(index: number): void {
    this.envVars.splice(index, 1);
    this.cdr.markForCheck();
  }

  protected getRootDirRepoName(): string {
    return this.selectedRepo?.name ?? '8848';
  }

  protected proceedFromGitUrl(): void {
    const url = this.gitUrl.trim();
    if (!url) return;
    const parsed = this.parseGitUrl(url);
    if (parsed) {
      this.selectedRepo = parsed;
      this.selectedTemplate = null;
      this.selectedSource = 'git';
      this.privateRepoName = parsed.name + '-' + Math.random().toString(36).slice(2, 6);
      this.projectName = parsed.name + '-' + Math.random().toString(36).slice(2, 6);
      this.cdr.markForCheck();
    }
  }

  private parseGitUrl(url: string): RepoInfo | null {
    try {
      const m = url.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
      if (m) {
        const owner = m[1];
        const name = m[2].replace(/\.git$/, '');
        const fullName = owner + '/' + name;
        return {
          id: 0,
          name,
          fullName,
          isPrivate: false,
          htmlUrl: `https://github.com/${fullName}`,
          cloneUrl: url.startsWith('http') ? url : `https://github.com/${fullName}.git`,
          description: null,
          defaultBranch: 'main',
          projectType: null,
          stargazersCount: 0,
          updatedAt: null,
        };
      }
    } catch {
      // ignore
    }
    return null;
  }

  protected createFromGit(): void {
    const repo = this.selectedRepo;
    if (!repo) return;
    const teamName = this.authService.getEmail()?.split('@')[0] ?? 'user';
    const projectTitle = repo.projectType || this.applicationPreset || 'Project';
    const repoUrl = repo.cloneUrl ?? `https://github.com/${repo.fullName}.git`;
    const rootDir = this.rootDirectory && this.rootDirectory !== './' ? this.rootDirectory : undefined;

    this.deploymentService.setContext({
      projectName: this.projectName || repo.name,
      source: 'git',
      sourceRepo: repo.fullName,
      branch: repo.defaultBranch ?? 'main',
      rootDir,
      teamName,
      commitHash: '1ae57b',
      projectTitle,
    });
    this.startDeployment({
      name: this.projectName || repo.name,
      repoUrl,
      rootDir,
    });
  }

  protected deployFromTemplate(): void {
    const t = this.selectedTemplate;
    if (!t) return;
    const sourceRepo = this.parseRepoFromUrl(t.repoUrl) ?? 'vercel/vercel';
    const teamName = this.authService.getEmail()?.split('@')[0] ?? 'user';
    const templateFromData = TEMPLATES.find((x) => this.parseRepoFromUrl(x.repoUrl) === sourceRepo);
    const previewImage = templateFromData?.previewImage ?? templateFromData?.thumbnail ?? t.thumbnail;

    const repoUrl = this.toCloneUrl(t.repoUrl);
    const rootDir = t.rootDir;

    this.deploymentService.setContext({
      projectName: this.privateRepoName || 'nextjs-boilerplate',
      source: 'template',
      sourceRepo,
      branch: 'main',
      rootDir,
      teamName,
      commitHash: '1ae57b',
      previewImage,
      projectTitle: t.title,
    });
    this.startDeployment({
      name: this.privateRepoName || 'nextjs-boilerplate',
      repoUrl,
      rootDir,
    });
  }

  private toCloneUrl(repoUrl?: string): string {
    if (!repoUrl) return 'https://github.com/vercel/vercel.git';
    const m = repoUrl.match(/github\.com\/([^/]+\/[^/?#]+)/);
    if (m) return `https://github.com/${m[1]}.git`;
    return repoUrl.includes('.git') ? repoUrl : repoUrl.replace(/\/?$/, '.git');
  }

  private startDeployment(request: { name: string; repoUrl: string; rootDir?: string }): void {
    this.deploymentStage.set('preparing');
    this.deployStartedAt.set(Date.now());
    this.deployEndedAt.set(null);
    this.buildLogs.set([]);
    this.deploymentError.set(null);
    this.deploymentErrorStatus.set(null);
    this.deploymentTickInterval = setInterval(() => {
      this.deployTick.update((n) => n + 1);
      this.cdr.markForCheck();
    }, 1000);

    this.projectService.createProject(request).subscribe({
      next: (project) => {
        this.deploymentStage.set('deploying');
        this.cdr.markForCheck();

        this.projectService.streamLogs(project.id, {
          onLog: (line) => {
            this.buildLogs.update((logs) => [...logs, line]);
            this.cdr.markForCheck();
          },
          onComplete: () => {
            this.deployEndedAt.set(Date.now());
            if (this.deploymentTickInterval) {
              clearInterval(this.deploymentTickInterval);
              this.deploymentTickInterval = null;
            }
            if (!this.deploymentError()) {
              this.deploymentStage.set('success');
            }
            this.cdr.markForCheck();
          },
          onError: (msg) => {
            this.deployEndedAt.set(Date.now());
            this.deploymentError.set(msg);
            this.deploymentStage.set('failed');
            if (this.deploymentTickInterval) {
              clearInterval(this.deploymentTickInterval);
              this.deploymentTickInterval = null;
            }
            this.cdr.markForCheck();
          },
        });
      },
      error: (err) => {
        this.deployEndedAt.set(Date.now());
        const status = err?.status ?? err?.statusCode;
        this.deploymentErrorStatus.set(status ?? null);
        const msg = status === 401 || status === 403
          ? 'Session expired or invalid. Please log in again.'
          : (err?.error?.message ?? err?.error?.error ?? err?.message ?? 'Failed to create project');
        this.deploymentError.set(msg);
        this.deploymentStage.set('failed');
        if (this.deploymentTickInterval) {
          clearInterval(this.deploymentTickInterval);
          this.deploymentTickInterval = null;
        }
        this.cdr.markForCheck();
      },
    });
  }

  protected getBuildLogs(): string[] {
    const logs = this.buildLogs();
    if (logs.length > 0) return logs;
    if (this.deploymentStage() === 'preparing' || this.deploymentStage() === 'deploying') {
      return WAITING_LOGS;
    }
    return [];
  }

  /** Parse log line: backend sends "HH:mm:ss.SSS message" */
  protected parseLogLine(line: string): { time: string; text: string } {
    const match = line.match(/^(\d{2}:\d{2}:\d{2}\.\d{3})\s+(.*)$/);
    if (match) return { time: match[1], text: match[2] };
    return { time: '', text: line };
  }

  protected continueToDashboard(): void {
    this.deploymentService.clearContext();
    this.deploymentStage.set('idle');
    this.deployEndedAt.set(null);
    this.deploymentError.set(null);
    this.buildLogs.set([]);
    this.deploymentTimers.forEach((t) => clearTimeout(t));
    this.deploymentTimers = [];
    if (this.deploymentTickInterval) {
      clearInterval(this.deploymentTickInterval);
      this.deploymentTickInterval = null;
    }
    this.router.navigate(['/dashboard/overview']);
  }

  protected isAuthError(): boolean {
    const s = this.deploymentErrorStatus();
    return s === 401 || s === 403;
  }

  protected resetDeployment(): void {
    this.deploymentStage.set('idle');
    this.deployEndedAt.set(null);
    this.deploymentError.set(null);
    this.deploymentErrorStatus.set(null);
    this.buildLogs.set([]);
    if (this.deploymentTickInterval) {
      clearInterval(this.deploymentTickInterval);
      this.deploymentTickInterval = null;
    }
    this.cdr.markForCheck();
  }

  private parseRepoFromUrl(url?: string): string | null {
    if (!url) return null;
    const m = url.match(/github\.com\/([^/]+\/[^/?#]+)/);
    return m ? m[1] : null;
  }

  protected connectGithub(): void {
    const url = this.authService.getGithubConnectUrl();
    if (url) {
      window.location.href = url;
    } else {
      // User not logged in or token missing – use login flow
      window.location.href = '/api/auth/github?state=login';
    }
  }
}
