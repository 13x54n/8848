import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { PricingComponent } from './pages/pricing/pricing';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { DashboardLayoutComponent } from './pages/dashboard/dashboard-layout';
import { DashboardOverviewComponent } from './pages/dashboard/pages/overview/overview';
import { DashboardProjectsComponent } from './pages/dashboard/pages/projects/projects';
import { DashboardAnalyticsComponent } from './pages/dashboard/pages/analytics/analytics';
import { DashboardSpeedInsightsComponent } from './pages/dashboard/pages/speed-insights/speed-insights';
import { DashboardCdnComponent } from './pages/dashboard/pages/cdn/cdn';
import { DashboardStorageComponent } from './pages/dashboard/pages/storage/storage';
import { DashboardAgentComponent } from './pages/dashboard/pages/agent/agent';
import { DashboardUsageComponent } from './pages/dashboard/pages/usage/usage';
import { DashboardSupportComponent } from './pages/dashboard/pages/support/support';
import { DashboardSettingsComponent } from './pages/dashboard/pages/settings/settings';
import { DashboardNewProjectComponent } from './pages/dashboard/pages/new-project/new-project';
import { DashboardDeployingComponent } from './pages/dashboard/pages/deploying/deploying';
import { DashboardTemplatesComponent } from './pages/dashboard/pages/templates/templates';
import { TemplateDetailComponent } from './pages/dashboard/pages/templates/template-detail/template-detail';
import { DashboardRedirectComponent } from './pages/dashboard/dashboard-redirect';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [guestGuard] },
  { path: 'pricing', component: PricingComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', component: DashboardRedirectComponent },
      { path: 'overview', component: DashboardOverviewComponent },
      { path: 'new-project', component: DashboardNewProjectComponent },
      { path: 'deploying', component: DashboardDeployingComponent },
      { path: 'templates', component: DashboardTemplatesComponent },
      { path: 'templates/:id', component: TemplateDetailComponent },
      { path: 'usage', component: DashboardUsageComponent },
      { path: 'projects', component: DashboardProjectsComponent },
      { path: 'analytics', component: DashboardAnalyticsComponent },
      { path: 'speed-insights', component: DashboardSpeedInsightsComponent },
      { path: 'cdn', component: DashboardCdnComponent },
      { path: 'storage', component: DashboardStorageComponent },
      { path: 'agent', component: DashboardAgentComponent },
      { path: 'support', component: DashboardSupportComponent },
      { path: 'settings', component: DashboardSettingsComponent },
    ],
  },
];
