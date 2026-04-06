import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ToastType } from '../../models/toast.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toastService = inject(ToastService);

  toastClass(type: ToastType): string {
    return {
      success: 'text-bg-success',
      error:   'text-bg-danger',
      info:    'text-bg-primary'
    }[type];
  }
}
