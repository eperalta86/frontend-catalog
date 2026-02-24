import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Platform } from '../models/media.model';

@Injectable({ providedIn: 'root' })
export class PlatformService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/platforms';

    getAll(): Observable<Platform[]> {
        return this.http.get<Platform[]>(this.apiUrl);
    }
}
