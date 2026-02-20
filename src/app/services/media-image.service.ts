import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MediaImage, ImageType } from '../models/media.model';

@Injectable({ providedIn: 'root' })
export class MediaImageService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/media';

    getImages(mediaItemId: number): Observable<MediaImage[]> {
        return this.http.get<MediaImage[]>(`${this.apiUrl}/${mediaItemId}/images`);
    }

    upload(mediaItemId: number, imageType: ImageType, file: File): Observable<MediaImage> {
        const formData = new FormData();
        formData.append('imageType', imageType);
        formData.append('file', file);
        return this.http.post<MediaImage>(`${this.apiUrl}/${mediaItemId}/images`, formData);
    }

    delete(mediaItemId: number, imageId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${mediaItemId}/images/${imageId}`);
    }

    getImageUrl(mediaItemId: number, imageId: number): string {
        return `${this.apiUrl}/${mediaItemId}/images/${imageId}/file`;
    }
}