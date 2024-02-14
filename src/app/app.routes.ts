import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
  },
];

