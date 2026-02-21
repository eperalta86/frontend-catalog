import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MediaService } from '../../services/media.service';
import { MediaImageService } from '../../services/media-image.service';
import { MediaItem, MediaImage, ImageType } from '../../models/media.model';

@Component({
    selector: 'app-media-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './media-detail.component.html',
    styleUrl: './media-detail.component.css',
})
export class MediaDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private mediaService = inject(MediaService);
    private mediaImageService = inject(MediaImageService);

    item = signal<MediaItem | null>(null);
    images = signal<MediaImage[]>([]);
    modalImageUrl = signal<string | null>(null);

    selectedImageType: ImageType = 'COVER';
    selectedFile: File | null = null;

    readonly imageTypes: ImageType[] = [
        'COVER', 'BACK_COVER', 'SPINE', 'MEDIA',
        'TOP', 'SCREENSHOT', 'MANUAL', 'OTHER'
    ];

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadItem(id);
        this.loadImages(id);
    }

    loadItem(id: number) {
        this.mediaService.getById(id).subscribe({
            next: (data) => this.item.set(data),
            error: (err) => console.error('Error al cargar item:', err),
        });
    }

    loadImages(id: number) {
        this.mediaImageService.getImages(id).subscribe({
            next: (data) => this.images.set(data),
            error: (err) => console.error('Error al cargar imágenes:', err),
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    uploadImage() {
        const id = this.item()?.id;
        if (!id || !this.selectedFile) return;

        this.mediaImageService.upload(id, this.selectedImageType, this.selectedFile).subscribe({
            next: () => {
                this.selectedFile = null;
                this.loadImages(id);
            },
            error: (err) => console.error('Error al subir imagen:', err),
        });
    }

    deleteImage(image: MediaImage) {
        const id = this.item()?.id;
        if (!id) return;
        if (!confirm(`¿Eliminar imagen "${image.originalFileName}"?`)) return;

        this.mediaImageService.delete(id, image.id).subscribe({
            next: () => this.loadImages(id),
            error: (err) => console.error('Error al eliminar imagen:', err),
        });
    }

    getImageUrl(image: MediaImage): string {
        const id = this.item()?.id;
        if (!id) return '';
        return this.mediaImageService.getImageUrl(id, image.id);
    }

    openImage(image: MediaImage) {
        this.modalImageUrl.set(this.getImageUrl(image));
    }

    closeImage() {
        this.modalImageUrl.set(null);
    }

    volver() {
        this.router.navigate(['/']);
    }
}
