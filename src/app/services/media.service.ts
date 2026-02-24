import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MediaItem, MediaStatus } from '../models/media.model';

@Injectable({ providedIn: 'root' })
export class MediaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/media';

  getAll(): Observable<MediaItem[]> {
    return this.http.get<MediaItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<MediaItem> {
    return this.http.get<MediaItem>(`${this.apiUrl}/${id}`);
  }

  create(title: string, platformId: number, status: MediaStatus): Observable<MediaItem> {
    return this.http.post<MediaItem>(this.apiUrl, { title, platformId, status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
