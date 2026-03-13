import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideLink,
  lucideSearch,
  lucideChevronDown,
  lucideExternalLink,
  lucideGithub,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { AuthService } from '../../../../services/auth.service';
import { GithubService } from '../../../../services/github.service';

const DEFAULT_AVATAR_URL = 'https://avatars.githubusercontent.com/u/179059125?s=200&v=4';

interface Repo {
  name: string;
  updated: string;
  avatarUrl?: string;
}

interface Template {
  title: string;
  description: string;
  thumbnail: string;
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
    }),
  ],
  templateUrl: './new-project.html',
  styleUrls: ['./new-project.css', '../../dashboard.css'],
})
export class DashboardNewProjectComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly githubService = inject(GithubService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly defaultAvatarUrl = DEFAULT_AVATAR_URL;
  protected gitUrl = '';
  protected githubLoading = true;

  protected readonly repos: Repo[] = [
    { name: '8848', updated: '21h ago', avatarUrl: 'https://avatars.githubusercontent.com/u/179059125?s=200&v=4' },
    { name: 'laxmanrai', updated: 'Mar 6' },
    { name: 'prompt-library', updated: 'Mar 6' },
    { name: 'rose', updated: 'Mar 6' },
    { name: 'sunya-v1', updated: 'Mar 6' },
  ];

  protected readonly templates: Template[] = [
    { title: 'Next.js Boilerplate', description: 'Get started with Next.js and React in seconds.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4' },
    { title: 'Chatbot', description: 'A full-featured, hackable Next.js AI chatbot built by Vercel.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4' },
    { title: 'Vite + React Starter', description: 'Vite/React site that can be deployed to Vercel.', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4' },
    { title: 'Express.js on Vercel', description: 'Simple Express.js + Vercel example that serves html conten...', thumbnail: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4' },
  ];

  protected githubConnected = false;

  ngOnInit(): void {
    const justConnected = this.route.snapshot.queryParamMap.get('github') === 'connected';
    if (justConnected) {
      this.githubService.connect();
      this.githubConnected = true;
      this.githubLoading = false;
      this.router.navigate(['/dashboard/new-project'], { replaceUrl: true });
      return;
    }
    this.githubService.checkConnectionFromBackend().then(connected => {
      this.githubConnected = connected;
      this.githubLoading = false;
    });
  }

  protected connectGithub(): void {
    const url = this.authService.getGithubConnectUrl();
    if (url) {
      window.location.href = url;
    }
  }
}
