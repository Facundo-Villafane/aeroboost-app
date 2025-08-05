# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Technology Stack

- **Frontend**: React 19 with Vite 6 as build tool
- **Styling**: Tailwind CSS 4 (configured via @tailwindcss/vite plugin)
- **Routing**: React Router 7 with nested routes
- **Authentication**: Firebase Auth with custom AuthProvider context
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage for file uploads
- **Text Editor**: Quill 2.0 for rich text editing (blog posts)
- **Animations**: Framer Motion for UI animations
- **Icons**: React Icons library
- **SEO**: React Helmet for dynamic meta tags

## Architecture Overview

### Application Structure
This is a bilingual (Spanish/English) educational platform called "AeroBoost/CODISEA" that teaches programming to children and youth. The app has two main sections:

1. **Public Website** (`/src/pages/`, `/src/components/`)
   - Landing page, services, about, blog, contact
   - Uses MainLayout wrapper with Header/Footer
   - All routes use MainLayout except admin routes

2. **Admin Dashboard** (`/src/admin/`)
   - Role-based access (founder/instructor roles)
   - Blog management with Quill editor
   - Financial system for service requests and payments
   - Instructor management
   - Comment moderation

### Authentication System
- Firebase Authentication with custom AuthProvider context
- Role-based permissions stored in user profile
- Two user roles: "founder" (full access) and "instructor" (limited access)
- ProtectedRoute component wraps admin routes
- AuthProvider is used in both main.jsx and App.jsx (double-wrapped)

### Routing Structure
- Public routes: `/`, `/servicios`, `/sobre-nosotros`, `/blog`, `/blog/:id`, `/contacto`
- Admin routes: `/admin/login`, `/admin/*` (nested under Dashboard component)
- Admin nested routes: dashboard, blog, comments, instructors, financials, service-requests, payments

### Firebase Configuration
- Uses environment variables with VITE_ prefix
- Services: auth, db (Firestore), storage
- Configuration in `/src/firebase.js`

### Key Components
- **AuthProvider**: Global authentication state management
- **Dashboard**: Main admin layout with nested routing
- **ProtectedRoute**: Route guard for admin access
- **QuillEditor**: Reusable rich text editor component
- **MainLayout**: Public site layout wrapper

### Financial System
The admin panel includes a comprehensive financial management system:
- Service pricing models with volume discounts
- Service request creation and assignment
- Instructor payment tracking
- Financial reporting and balance management

## Firebase Setup Requirements
Requires `.env` file with Firebase configuration variables:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_DATABASE_URL
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## Contact Form
Uses PHP backend for contact form processing (separate from React app)
- Endpoint expected at `/api/contact.php` or similar
- Form data sent via POST request

## SEO Configuration
- Comprehensive meta tags in index.html
- Open Graph and Twitter Card meta tags
- Structured data for educational organization
- Dynamic meta tags managed via React Helmet in components

## Code Conventions
- Uses ES6+ modules with JSX
- ESLint configured with React hooks and refresh plugins
- Tailwind CSS for styling (no custom CSS files except index.css)
- Spanish language used in UI text and comments
- File naming: PascalCase for components, camelCase for utilities