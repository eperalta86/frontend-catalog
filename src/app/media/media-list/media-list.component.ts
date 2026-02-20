import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MediaService } from '../../services/media.service';
import { MediaItem, MediaType, MediaStatus } from '../../models/media.model';

@Component({
    selector: 'app-media-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './media-list.component.html',
    styleUrl: './media-list.component.css',
})
export class MediaListComponent implements OnInit {
    private mediaService = inject(MediaService);
    private router = inject(Router);

    mediaItems = signal<MediaItem[]>([]);

    newTitle = '';
    newType: MediaType = 'GAME';
    newStatus: MediaStatus = 'BACKLOG';

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.mediaService.getAll().subscribe({
            next: (data) => this.mediaItems.set(data),
            error: (err) => console.error('Error al cargar:', err),
        });
    }

    save() {
        if (!this.newTitle.trim()) return;

        this.mediaService.create(this.newTitle, this.newType, this.newStatus).subscribe({
            next: () => {
                this.loadData();
                this.newTitle = '';
            },
            error: (err) => console.error('Error al guardar:', err),
        });
    }

    delete(item: MediaItem) {
        if (!confirm(`¿Seguro que quieres borrar "${item.title}"?`)) return;
        this.mediaService.delete(item.id).subscribe({
            next: () => this.loadData(),
            error: (err) => console.error('Error al eliminar:', err),
        });
    }

    verDetalle(item: MediaItem) {
        this.router.navigate(['/media', item.id]);
    }
}