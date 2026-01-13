import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MediaService } from './services/media.service';
import { MediaItem } from './models/media.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private mediaService = inject(MediaService);
  
  mediaItems = signal<MediaItem[]>([]);
  
  newTitle = '';
  newType = 'GAME';
  newStatus = 'BACKLOG';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.mediaService.getAll().subscribe({
      next: (data) => this.mediaItems.set(data),
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  save() {
    if (!this.newTitle.trim()) return;
    
    this.mediaService.create(this.newTitle, this.newType, this.newStatus)
      .subscribe({
        next: () => {
          this.loadData();
          this.newTitle = '';
        },
        error: (err) => console.error('Error al guardar:', err)
      });
  }
}