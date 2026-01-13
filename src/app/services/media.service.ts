import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MediaItem } from '../models/media.model'; 

@Injectable({ providedIn: 'root' })
export class MediaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/media';

  getAll(): Observable<MediaItem[]> {
    return this.http.get<MediaItem[]>(this.apiUrl);
  }

  create(title: string, type: string, status: string): Observable<MediaItem> {
    return this.http.post<MediaItem>(this.apiUrl, { title, type, status });
  }
}