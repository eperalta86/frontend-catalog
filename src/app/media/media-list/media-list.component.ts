import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MediaService } from '../../services/media.service';
import { MediaImageService } from '../../services/media-image.service';
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
    private mediaImageService = inject(MediaImageService);
    private router = inject(Router);

    mediaItems = signal<MediaItem[]>([]);
    coverUrls = signal<Map<number, string>>(new Map());

    newTitle = '';
    newType: MediaType = 'GAME';
    newStatus: MediaStatus = 'BACKLOG';

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.mediaService.getAll().subscribe({
            next: (items) => {
                this.mediaItems.set(items);
                this.loadCovers(items);
            },
            error: (err) => console.error('Error al cargar:', err),
        });
    }

    loadCovers(items: MediaItem[]) {
        if (items.length === 0) return;

        const requests = items.map(item =>
            this.mediaImageService.getImages(item.id).pipe(catchError(() => of([])))
        );

        forkJoin(requests).subscribe(results => {
            const map = new Map<number, string>();
            results.forEach((images, index) => {
                const cover = images.find(img => img.imageType === 'COVER') ?? images[0];
                if (cover) {
                    map.set(items[index].id, this.mediaImageService.getImageUrl(items[index].id, cover.id));
                }
            });
            this.coverUrls.set(map);
        });
    }

    getCoverUrl(itemId: number): string | null {
        return this.coverUrls().get(itemId) ?? null;
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
