import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  private nextId = 0;

  getToasts(): Observable<Toast[]> {
    return this.toasts.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Clear any existing toasts first
    this.toasts.next([]);

    const toast: Toast = {
      id: this.nextId++,
      message,
      type
    };

    this.toasts.next([toast]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      this.remove(toast.id);
    }, 3000);
  }

  remove(id: number): void {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(toast => toast.id !== id));
  }
} 