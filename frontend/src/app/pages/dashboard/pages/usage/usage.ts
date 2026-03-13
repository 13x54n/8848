import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import {
  lucideClock,
  lucideCalendar,
  lucideChevronDown,
  lucideInfo,
  lucideBarChart3,
  lucideMaximize2,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-dashboard-usage',
  standalone: true,
  imports: [CommonModule, HlmIconImports],
  providers: [
    provideIcons({
      lucideClock,
      lucideCalendar,
      lucideChevronDown,
      lucideInfo,
      lucideBarChart3,
      lucideMaximize2,
    }),
  ],
  templateUrl: './usage.html',
  styleUrl: './usage.css',
})
export class DashboardUsageComponent {
  protected readonly overviewMetrics = [
    { label: 'Fast Data Transfer', value: '1.01 GB', max: '100 GB' },
    { label: 'Fast Origin Transfer', value: '537.08 MB', max: '10 GB' },
    { label: 'Edge Requests', value: '63K', max: '1M' },
    { label: 'Edge Request CPU Duration', value: '3s', max: '1h' },
    { label: 'Microfrontends Routing', value: '0', max: '50K' },
  ];

  protected readonly chartLabels = ['Feb 12', 'Feb 16', 'Feb 20', 'Feb 24', 'Feb 28', 'Mar 4', 'Mar 9', 'Mar 10'];

  protected readonly chartBars = [
    { id: 1, total: 52, outgoing: 95, incoming: 5 },
    { id: 2, total: 68, outgoing: 92, incoming: 8 },
    { id: 3, total: 45, outgoing: 98, incoming: 2 },
    { id: 4, total: 78, outgoing: 90, incoming: 10 },
    { id: 5, total: 85, outgoing: 88, incoming: 12 },
    { id: 6, total: 62, outgoing: 93, incoming: 7 },
    { id: 7, total: 70, outgoing: 91, incoming: 9 },
    { id: 8, total: 55, outgoing: 96, incoming: 4 },
  ];
}
