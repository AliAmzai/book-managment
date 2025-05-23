import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list.component';
import { BookFormComponent } from './components/book-form.component';

export const routes: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: 'books',
    component: BookListComponent
  },
  { path: 'add', component: BookFormComponent },
  { path: 'edit/:id', component: BookFormComponent },
];
