# Meta Ads AI Generator - Server

Backend API built with NestJS and TypeORM for the Meta Ads AI Generator.

## 🏗️ Architecture

```
server/src/
├── entities/           # TypeORM entities
├── modules/           # Feature modules
│   ├── auth/         # Authentication
│   ├── users/        # User management
│   ├── ai/           # AI services
│   ├── ads/          # Ad management
│   ├── meta/         # Meta API integration
│   └── database/     # Database configuration
├── config/           # Configuration files
└── main.ts          # Application entry point
```

## 🚀 Features

- **TypeORM Integration** - Modern ORM with PostgreSQL
- **JWT Authentication** - Secure user authentication
- **Google Gemini AI** - Advanced ad copy generation
- **Meta Marketing API** - Direct Facebook/Instagram ad creation
- **Modular Architecture** - Clean, maintainable code structure
- **Validation & Pipes** - Request validation with class-validator
- **Environment Configuration** - Flexible configuration management

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Copy and update the environment file:

```bash
cp .env.example .env
```

Required environment variables (see `.env.example` for complete list):

- Database configuration (PostgreSQL)
- Google Gemini AI API key
- Meta/Facebook API credentials
- JWT secret for authentication
- Server configuration

All credentials should be configured in your `.env` file.

## 🗄️ Database Setup

```bash
# Sync database schema (development)
npm run schema:sync

# Generate migration
npm run migration:generate

# Run migrations
npm run migration:run
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/meta-integration` - Update Meta integration

### AI Services

- `POST /api/ai/generate-copy` - Generate ad copy
- `POST /api/ai/generate-image` - Generate ad creative
- `GET /api/ai/copy-history` - Get copy history
- `GET /api/ai/creative-history` - Get creative history

### Campaigns

- `GET /api/ads/campaigns` - List campaigns
- `POST /api/ads/campaigns` - Create campaign
- `GET /api/ads/campaigns/:id` - Get campaign details
- `POST /api/ads/campaigns/:id/publish` - Publish to Meta

### Meta Integration

- `GET /api/meta/auth-url` - Get OAuth URL
- `POST /api/meta/connect` - Connect Meta account
- `GET /api/meta/ad-accounts` - List ad accounts
- `GET /api/meta/connection-status` - Check connection status

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 🔍 Database Schema

### Users

- User authentication and profile data
- Meta integration credentials

### Campaigns

- Campaign information and settings
- Meta campaign mapping

### Ad Sets

- Targeting and budget configuration
- Meta ad set mapping

### Ads

- Individual ad configuration
- Links to copy and creative

### Ad Copies

- AI-generated ad copy variations
- Generation metadata

### Ad Creatives

- AI-generated images and videos
- Creative metadata

## 🛠️ Development Tools

- **TypeORM CLI** - Database management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Swagger** - API documentation (coming soon)

## 📈 Performance

- **Connection Pooling** - Optimized database connections
- **Caching** - Redis integration (coming soon)
- **Rate Limiting** - API rate limiting (coming soon)
- **Monitoring** - Application monitoring (coming soon)
