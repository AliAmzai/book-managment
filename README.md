# 📚 Book Manager

A modern, responsive web application for managing your book collection. Built with Angular and styled with Tailwind CSS, this application provides an intuitive interface for organizing and tracking your books.

## ✨ Features

- 📱 Responsive design that works on desktop and mobile devices
- 📊 Toggle between table and card views for different ways to browse your collection
- 🔍 Search functionality to quickly find books
- ⚡ Real-time filtering and sorting capabilities
- 📝 CRUD operations (Create, Read, Update, Delete) for book management
- 🎨 Modern UI with smooth animations and transitions
- 📱 Mobile-first approach with optimized layouts
- 🔄 Pagination for efficient data handling

## 🎨 Design Decisions

### 1. UI Framework Choice
- **Removed Material Design** in favor of custom Tailwind CSS components for:
  - Smaller bundle size
  - More customization flexibility
  - Better performance
  - Consistent design language

### 2. Component Architecture
- **Standalone Components**: Used Angular's standalone components to:
  - Reduce bundle size
  - Improve maintainability
  - Enable better tree-shaking
  - Simplify testing

### 3. User Interface
- **Dual View System**:
  - Table view for efficient data scanning
  - Card view for visual browsing
  - Easy toggle between views
- **Mobile-First Approach**:
  - Optimized spacing for mobile devices
  - Responsive controls and layouts
  - Touch-friendly interface

### 4. Performance Optimizations
- **Efficient Data Handling**:
  - Client-side pagination
  - Real-time search and filtering
  - Optimized sorting algorithms
- **Smooth Animations**:
  - CSS transitions for better performance
  - Minimal JavaScript animations
  - Reduced layout shifts

### 5. User Experience
- **Custom Modal System**:
  - Replaced Material Dialog with lightweight custom solution
  - Added keyboard navigation
  - Improved accessibility
  - Smooth animations and backdrop blur

## 🚀 Running the Application

1. Clone the repository:
```bash
git clone https://github.com/AliAmzai/book-managment.git
cd book-managment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## 🛠️ Built With

- [Angular](https://angular.io/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - For styling

## 💡 Usage

1. **Adding a Book**
   - Click the "Add New Book" button
   - Fill in the book details
   - Click Save to add the book to your collection

2. **Managing Books**
   - Use the search bar to find specific books
   - Sort books by title, author, or publication date
   - Switch between table and card views
   - Edit or delete books using the action buttons

3. **Viewing Options**
   - Toggle between table and card views using the view switcher
   - Adjust items per page using the pagination controls
   - Use the search and filter options to organize your collection

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Tailwind CSS team for the utility-first CSS framework
- All contributors who help improve this project

---

Made with ❤️ by Ali
