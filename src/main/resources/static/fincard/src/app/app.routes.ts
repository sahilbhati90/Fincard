import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
    title: 'Sign in · Fincard',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardPage),
        title: 'Dashboard · Fincard',
      },
      {
        path: 'my-banks',
        loadComponent: () => import('./pages/my-banks/my-banks').then((m) => m.MyBanksPage),
        title: 'My Banks · Fincard',
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./pages/transactions/transactions').then((m) => m.TransactionsPage),
        title: 'Transactions · Fincard',
      },
      {
        path: 'transfer',
        loadComponent: () => import('./pages/transfer/transfer').then((m) => m.TransferPage),
        title: 'Transfer Funds · Fincard',
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfilePage),
        title: 'My Profile · Fincard',
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.SettingsPage),
        title: 'Settings · Fincard',
      },
    ],
  },
  {
    path: 'error/500',
    loadComponent: () =>
      import('./pages/not-found/server-error').then((m) => m.ServerErrorPage),
    title: 'Server Error · Fincard',
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/not-found/unauthorized').then((m) => m.UnauthorizedPage),
    title: 'Unauthorized · Fincard',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'Page Not Found · Fincard',
  },
];
