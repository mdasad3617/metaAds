# Meta Ads AI Generator - Client

Modern React frontend built with Next.js 14 for the Meta Ads AI Generator.

## 🏗️ Architecture

```
client/src/
├── app/              # Next.js 14 app directory
│   ├── auth/        # Authentication pages
│   ├── dashboard/   # Main application
│   └── layout.tsx   # Root layout
├── components/      # Reusable components
├── lib/            # Utilities and API client
└── types/          # TypeScript type definitions
```

## 🚀 Features

- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Modern utility-first styling
- **React Hook Form** - Efficient form handling
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library
- **Responsive Design** - Mobile-first approach

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Client environment variables are now managed in `server/.env`.

See the main project README for configuration instructions.

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Pages & Features

### Authentication
- **Login Page** - User authentication
- **Register Page** - User registration
- **Protected Routes** - Automatic redirection

### Dashboard
- **Overview** - Quick stats and actions
- **Campaign Management** - Create and manage campaigns
- **Ad Copy Generator** - AI-powered copy creation
- **Creative Generator** - AI-powered image creation
- **Analytics** - Performance insights
- **Settings** - Meta integration and preferences

### Components
- **Responsive Navigation** - Mobile-friendly navigation
- **Form Components** - Reusable form elements
- **Loading States** - Smooth loading experiences
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback

## 🎨 Styling

### Tailwind CSS Classes
- **Layout** - Flexbox and Grid utilities
- **Typography** - Consistent text styling
- **Colors** - Brand color palette
- **Spacing** - Consistent spacing scale
- **Responsive** - Mobile-first breakpoints

### Custom Components
```css
.btn - Base button styles
.btn-primary - Primary button variant
.btn-secondary - Secondary button variant
.btn-facebook - Facebook-branded button
.input - Form input styles
.card - Card container styles
.ad-preview - Ad preview container
```

## 🔌 API Integration

### API Client
- **Axios Instance** - Configured HTTP client
- **Request Interceptors** - Automatic token attachment
- **Response Interceptors** - Error handling
- **Type Safety** - Full TypeScript integration

### Authentication Context
- **User State Management** - Global user state
- **Token Management** - Automatic token handling
- **Route Protection** - Protected route wrapper

## 📊 State Management

### React Context
- **AuthContext** - User authentication state
- **Local State** - Component-level state with hooks
- **Form State** - React Hook Form integration

## 🧪 Testing

```bash
# Run tests (coming soon)
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 📱 Responsive Design

### Breakpoints
- **sm** - 640px and up
- **md** - 768px and up
- **lg** - 1024px and up
- **xl** - 1280px and up

### Mobile-First Approach
- Touch-friendly interfaces
- Optimized navigation
- Responsive layouts
- Fast loading times

## 🔍 SEO & Performance

- **Next.js Optimization** - Automatic code splitting
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Google Fonts optimization
- **Meta Tags** - Proper SEO meta tags
- **Performance Monitoring** - Web Vitals tracking

## 🛠️ Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Tailwind IntelliSense** - CSS class suggestions

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
- **Netlify** - Static site deployment
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerized deployment