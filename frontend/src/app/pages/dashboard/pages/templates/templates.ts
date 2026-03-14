import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideSearch, lucideChevronDown, lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { TEMPLATES, USE_CASES, type TemplateItem } from '../../../../data/templates.data';

@Component({
  selector: 'app-dashboard-templates',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HlmIconImports],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideSearch,
      lucideChevronDown,
      lucideChevronRight,
    }),
  ],
  templateUrl: './templates.html',
  styleUrl: './templates.css',
})
export class DashboardTemplatesComponent {
  private readonly router = inject(Router);

  protected searchQuery = signal('');
  protected useCaseFilters = signal<Set<string>>(new Set());
  protected useCaseExpanded = signal(true);

  protected readonly allTemplates = TEMPLATES;
  protected readonly useCases = USE_CASES;

  protected filteredTemplates = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const filters = this.useCaseFilters();
    return this.allTemplates.filter((t) => {
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchesFilter = filters.size === 0 || t.useCases.some((uc) => filters.has(uc));
      return matchesSearch && matchesFilter;
    });
  });

  protected toggleUseCase(useCase: string): void {
    const current = new Set(this.useCaseFilters());
    if (current.has(useCase)) {
      current.delete(useCase);
    } else {
      current.add(useCase);
    }
    this.useCaseFilters.set(current);
  }

  protected isUseCaseChecked(useCase: string): boolean {
    return this.useCaseFilters().has(useCase);
  }

  protected selectTemplate(template: TemplateItem): void {
    this.router.navigate(['/dashboard/templates', template.id]);
  }
}
