import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { PricingComponent } from './pages/pricing/pricing';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
