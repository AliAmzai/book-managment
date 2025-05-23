import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', date: '1925' },
    { id: 2, title: '1984', author: 'George Orwell', date: '1949' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', date: '1960' },
    { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger', date: '1951' },
    { id: 5, title: 'Pride and Prejudice', author: 'Jane Austen', date: '1813' },
    { id: 6, title: 'The Hobbit', author: 'J.R.R. Tolkien', date: '1937' },
    { id: 7, title: 'Lord of the Flies', author: 'William Golding', date: '1954' },
    { id: 8, title: 'Animal Farm', author: 'George Orwell', date: '1945' },
    { id: 9, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', date: '1954' },
    { id: 10, title: 'Brave New World', author: 'Aldous Huxley', date: '1932' },
    { id: 11, title: 'The Grapes of Wrath', author: 'John Steinbeck', date: '1939' },
    { id: 12, title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', date: '1967' },
    { id: 13, title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', date: '1890' },
    { id: 14, title: 'The Adventures of Huckleberry Finn', author: 'Mark Twain', date: '1884' },
    { id: 15, title: 'Fahrenheit 451', author: 'Ray Bradbury', date: '1953' }
  ];

  private booksSubject = new BehaviorSubject<Book[]>(this.books);
  private bookAddedSubject = new Subject<Book>();
  private bookUpdatedSubject = new Subject<Book>();
  private bookDeletedSubject = new Subject<Book>();

  bookAdded$ = this.bookAddedSubject.asObservable();
  bookUpdated$ = this.bookUpdatedSubject.asObservable();
  bookDeleted$ = this.bookDeletedSubject.asObservable();

  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  addBook(book: Omit<Book, 'id'>): void {
    const newBook = {
      ...book,
      id: this.books.length + 1
    };
    this.books.push(newBook);
    this.booksSubject.next(this.books);
    this.bookAddedSubject.next(newBook);
  }

  updateBook(book: Book): void {
    const index = this.books.findIndex(b => b.id === book.id);
    if (index !== -1) {
      this.books[index] = book;
      this.booksSubject.next(this.books);
      this.bookUpdatedSubject.next(book);
    }
  }

  deleteBook(id: number): void {
    const bookToDelete = this.books.find(book => book.id === id);
    if (bookToDelete) {
      this.books = this.books.filter(book => book.id !== id);
      this.booksSubject.next(this.books);
      this.bookDeletedSubject.next(bookToDelete);
    }
  }

  getById(id: number): Book | undefined {
    return this.books.find(b => b.id === id);
  }
}
