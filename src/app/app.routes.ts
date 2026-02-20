import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./media/media-list/media-list.component').then(m => m.MediaListComponent),
    },
    {
        path: 'media/:id',
        loadComponent: () =>
            import('./media/media-detail/media-detail.component').then(m => m.MediaDetailComponent),
    },
    {
        path: '**',
        redirectTo: '',
    },
];