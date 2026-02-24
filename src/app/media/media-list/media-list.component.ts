import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MediaService } from '../../services/media.service';
import { MediaImageService } from '../../services/media-image.service';
import { PlatformService } from '../../services/platform.service';
import { MediaItem, MediaStatus, Platform } from '../../models/media.model';

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
    private platformService = inject(PlatformService);
    private router = inject(Router);

    mediaItems = signal<MediaItem[]>([]);
    platforms = signal<Platform[]>([]);
    coverUrls = signal<Map<number, string>>(new Map());

    newTitle = '';
    newPlatformId: number | null = null;
    newStatus: MediaStatus = 'BACKLOG';

    ngOnInit() {
        this.loadPlatforms();
        this.loadData();
    }

    loadPlatforms() {
        this.platformService.getAll().subscribe({
            next: (data) => {
                this.platforms.set(data);
                if (data.length > 0 && !this.newPlatformId) {
                    this.newPlatformId = data[0].id;
                }
            },
            error: (err) => console.error('Error al cargar plataformas:', err),
        });
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
        if (!this.newTitle.trim() || !this.newPlatformId) return;
        this.mediaService.create(this.newTitle, this.newPlatformId, this.newStatus).subscribe({
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
