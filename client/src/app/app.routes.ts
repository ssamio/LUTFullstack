import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'expenses', component: ExpensesComponent, canActivate: [authGuard] },
  {
    path: 'user-settings',
    component: UserSettingsComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
