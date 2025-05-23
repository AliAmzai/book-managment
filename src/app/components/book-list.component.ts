import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';
import { ConfirmModalComponent } from './confirm-modal.component';
import { ToastService } from '../services/toast.service';
import { ToastComponent } from './toast.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmModalComponent,
    ToastComponent
  ],
  template: `
    <app-toast></app-toast>
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-white p-4 sm:p-8">
      <div class="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <!-- Header Section -->
        <div class="bg-white rounded-3xl border border-gray-200 p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div class="flex flex-col items-center sm:flex-row sm:items-center gap-4">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-center sm:text-left">Book Manager</h1>
            <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-1 w-full">
              <div class="order-2 sm:order-1">
                <!-- View Toggle -->
                <div class="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    (click)="viewMode = 'table'"
                    [class]="viewMode === 'table' ? 
                      'px-3 py-1.5 text-sm font-medium rounded-lg bg-white shadow text-gray-900' : 
                      'px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                    </svg>
                  </button>
                  <button
                    (click)="viewMode = 'card'"
                    [class]="viewMode === 'card' ? 
                      'px-3 py-1.5 text-sm font-medium rounded-lg bg-white shadow text-gray-900' : 
                      'px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <a
                routerLink="/add"
                class="order-1 sm:order-2 inline-flex items-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Add New Book
              </a>
            </div>
          </div>

          <!-- Search and Filter Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <!-- Search Field -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                (input)="applyFilter($event)"
                placeholder="Search books by title, author, or year..."
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Sort By Dropdown -->
            <div class="relative">
              <select
                (change)="sortData($event)"
                class="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="title,asc">Title (A-Z)</option>
                <option value="title,desc">Title (Z-A)</option>
                <option value="author,asc">Author (A-Z)</option>
                <option value="author,desc">Author (Z-A)</option>
                <option value="date,asc">Date (Oldest)</option>
                <option value="date,desc">Date (Newest)</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div *ngIf="viewMode === 'table'" class="bg-white rounded-3xl border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th scope="col" class="px-4 sm:px-8 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Published</th>
                  <th scope="col" class="px-4 sm:px-8 py-3 sm:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let book of displayedBooks" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{book.title}}</div>
                  </td>
                  <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{book.author}}</div>
                  </td>
                  <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{book.date}}</div>
                  </td>
                  <td class="px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <a [routerLink]="['/edit', book.id]" class="text-blue-600 hover:text-blue-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </a>
                    <button (click)="openDeleteModal(book)" class="text-red-600 hover:text-red-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="displayedBooks.length === 0">
                  <td colspan="4" class="px-8 py-8 text-center text-sm text-gray-500">
                    No books found matching your search
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Card View -->
        <div *ngIf="viewMode === 'card'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <div *ngFor="let book of displayedBooks" 
               class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 transition-transform duration-200 hover:-translate-y-1">
            <div class="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{book.title}}</h3>
                <p class="text-sm text-gray-600">by {{book.author}}</p>
              </div>
              <div class="flex gap-2">
                <a [routerLink]="['/edit', book.id]" 
                   class="p-2 text-blue-600 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </a>
                <button (click)="openDeleteModal(book)" 
                        class="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Published: {{book.date}}
              </div>
            </div>
          </div>
          <div *ngIf="displayedBooks.length === 0" 
               class="col-span-full flex items-center justify-center p-4 sm:p-8 bg-white rounded-2xl border border-gray-200">
            <p class="text-gray-500 text-sm">No books found matching your search</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="bg-white rounded-3xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700">Show:</label>
              <select 
                [(ngModel)]="pageSize" 
                (change)="onPageSizeChange()"
                class="block w-20 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option [value]="5">5</option>
                <option [value]="10">10</option>
                <option [value]="15">15</option>
              </select>
              <span class="text-sm text-gray-700">per page</span>
            </div>

            <div class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </div>

            <div class="flex items-center gap-2">
              <button
                (click)="previousPage()"
                [disabled]="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div class="flex items-center gap-1">
                <ng-container *ngFor="let page of getPageNumbers()">
                  <button
                    *ngIf="page !== '...'"
                    (click)="goToPage(+page)"
                    [class]="currentPage === +page ? 
                      'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white' :
                      'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
                  >
                    {{ page }}
                  </button>
                  <span *ngIf="page === '...'" class="px-2 text-gray-500">...</span>
                </ng-container>
              </div>

              <button
                (click)="nextPage()"
                [disabled]="endIndex >= totalItems"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg class="h-5 w-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <app-confirm-modal
      [isOpen]="isDeleteModalOpen"
      [title]="'Delete Book'"
      [message]="'Are you sure you want to delete ' + (bookToDelete?.title || 'this book') + '? This action cannot be undone.'"
      (confirm)="handleDeleteConfirm()"
      (cancel)="closeDeleteModal()"
    ></app-confirm-modal>
  `
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  displayedBooks: Book[] = [];
  currentPage = 1;
  pageSize = 5;
  searchTerm = '';
  currentSort = 'title,asc';
  isDeleteModalOpen = false;
  bookToDelete: Book | null = null;
  viewMode: 'table' | 'card' = 'table';
  private subscriptions: Subscription[] = [];

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  get totalItems(): number {
    return this.filteredBooks.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  constructor(
    private bookService: BookService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Clear any existing subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    // Subscribe to books list
    this.subscriptions.push(
      this.bookService.getBooks().subscribe(books => {
        this.books = books;
        this.applyFiltersAndSort();
      })
    );

    // Subscribe to book events
    this.subscriptions.push(
      this.bookService.bookAdded$.subscribe(book => {
        this.toastService.show(`"${book.title}" has been added successfully`, 'success');
      })
    );

    this.subscriptions.push(
      this.bookService.bookUpdated$.subscribe(book => {
        this.toastService.show(`"${book.title}" has been updated successfully`, 'success');
      })
    );

    this.subscriptions.push(
      this.bookService.bookDeleted$.subscribe(book => {
        this.toastService.show(`"${book.title}" has been deleted`, 'success');
      })
    );
  }

  openDeleteModal(book: Book): void {
    this.bookToDelete = book;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.bookToDelete = null;
  }

  handleDeleteConfirm(): void {
    if (this.bookToDelete) {
      this.bookService.deleteBook(this.bookToDelete.id);
      this.closeDeleteModal();
    }
  }

  applyFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  sortData(event: Event): void {
    this.currentSort = (event.target as HTMLSelectElement).value;
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    // First apply search filter
    let result = this.books;
    if (this.searchTerm) {
      result = this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm) ||
        book.author.toLowerCase().includes(this.searchTerm) ||
        book.date.toString().includes(this.searchTerm)
      );
    }

    // Then sort
    const [field, direction] = this.currentSort.split(',');
    result.sort((a, b) => {
      let comparison = 0;
      if (field === 'date') {
        comparison = parseInt(a.date) - parseInt(b.date);
      } else {
        comparison = (a[field as keyof Book] as string)
          .localeCompare(b[field as keyof Book] as string);
      }
      return direction === 'asc' ? comparison : -comparison;
    });

    this.filteredBooks = result;
    this.updateDisplayedBooks();
  }

  updateDisplayedBooks(): void {
    const start = this.startIndex;
    const end = this.endIndex;
    this.displayedBooks = this.filteredBooks.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedBooks();
    }
  }

  nextPage(): void {
    if (this.endIndex < this.totalItems) {
      this.currentPage++;
      this.updateDisplayedBooks();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedBooks();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedBooks();
  }

  getPageNumbers(): (string | number)[] {
    const totalPages = this.totalPages;
    const current = this.currentPage;
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (current <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    
    if (current >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, '...', current - 1, current, current + 1, '...', totalPages];
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
