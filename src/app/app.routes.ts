import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./auth/register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./media/media-list/media-list.component').then(m => m.MediaListComponent),
    },
    {
        path: 'media/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./media/media-detail/media-detail.component').then(m => m.MediaDetailComponent),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
