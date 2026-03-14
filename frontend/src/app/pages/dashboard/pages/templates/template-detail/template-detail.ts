import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideExternalLink } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { TEMPLATES, type TemplateItem } from '../../../../../data/templates.data';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmIconImports],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideExternalLink,
    }),
  ],
  templateUrl: './template-detail.html',
  styleUrl: './template-detail.css',
})
export class TemplateDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly template = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return TEMPLATES.find((t) => t.id === id) ?? null;
  });

  protected readonly relatedTemplates = computed(() => {
    const t = this.template();
    if (!t) return [];
    return TEMPLATES.filter((x) => x.id !== t.id).slice(0, 4);
  });

  protected getRepoDisplay(t: TemplateItem): string {
    return t.repoDisplay ?? this.parseRepoFromUrl(t.repoUrl) ?? '—';
  }

  private parseRepoFromUrl(url?: string): string | null {
    if (!url) return null;
    const m = url.match(/github\.com\/([^/]+\/[^/?#]+)/);
    return m ? m[1] : null;
  }

  protected deployTemplate(): void {
    const t = this.template();
    if (t) {
      this.router.navigate(['/dashboard/new-project'], { queryParams: { template: t.id } });
    }
  }
}
