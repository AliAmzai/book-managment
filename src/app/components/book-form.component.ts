import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center">
      <div class="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-10 m-4">
        <!-- Back link -->
        <div class="flex items-center space-x-2 text-sm text-gray-600 font-medium cursor-pointer hover:text-blue-600 transition-colors"
             (click)="onCancel()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>Back to Books</span>
        </div>

        <!-- Heading -->
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{ isEditMode ? 'Edit Book' : 'Add New Book' }}
        </h1>

        <!-- Form -->
        <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Title -->
          <div class="space-y-1">
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              placeholder="e.g., Clean Code"
              class="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [ngClass]="{'border-red-500': bookForm.get('title')?.invalid && bookForm.get('title')?.touched}"
            >
            <p *ngIf="bookForm.get('title')?.hasError('required') && bookForm.get('title')?.touched" 
               class="mt-1 text-sm text-red-600">
              Title is required
            </p>
          </div>

          <!-- Author -->
          <div class="space-y-1">
            <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
            <input
              id="author"
              type="text"
              formControlName="author"
              placeholder="e.g., Robert C. Martin"
              class="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [ngClass]="{'border-red-500': bookForm.get('author')?.invalid && bookForm.get('author')?.touched}"
            >
            <p *ngIf="bookForm.get('author')?.hasError('required') && bookForm.get('author')?.touched" 
               class="mt-1 text-sm text-red-600">
              Author is required
            </p>
          </div>

          <!-- Date -->
          <div class="space-y-1">
            <label for="date" class="block text-sm font-medium text-gray-700">Published Date</label>
            <input
              id="date"
              type="date"
              formControlName="date"
              class="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [ngClass]="{'border-red-500': bookForm.get('date')?.invalid && bookForm.get('date')?.touched}"
            >
            <p *ngIf="bookForm.get('date')?.hasError('required') && bookForm.get('date')?.touched" 
               class="mt-1 text-sm text-red-600">
              Date is required
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-4 pt-6">
            <button
              type="button"
              (click)="onCancel()"
              class="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!bookForm.valid"
              class="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg *ngIf="!isEditMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              <svg *ngIf="isEditMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              {{ isEditMode ? 'Update' : 'Add' }} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  private bookId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      date: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = Number(id);
      const book = this.bookService.getById(this.bookId);
      if (book) {
        // Format the date to YYYY-MM-DD for the date input
        const date = new Date(book.date);
        const formattedDate = date.toISOString().split('T')[0];
        
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          date: formattedDate
        });
      }
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      const date = new Date(formValue.date);
      const year = date.getFullYear().toString();

      if (this.isEditMode && this.bookId) {
        this.bookService.update({
          id: this.bookId,
          title: formValue.title,
          author: formValue.author,
          date: year
        });
      } else {
        this.bookService.addBook({
          title: formValue.title,
          author: formValue.author,
          date: year
        });
      }
      this.router.navigate(['/']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
