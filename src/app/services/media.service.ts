import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MediaItem, MediaStatus, Page } from '../models/media.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MediaService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/media`;

  getAll(page = 0, size = 20, sort = 'title,asc'): Observable<Page<MediaItem>> {
    return this.http.get<Page<MediaItem>>(
      `${this.apiUrl}?page=${page}&size=${size}&sort=${sort}`
    );
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
