# Meta Ads AI Generator

A complete AI-powered Meta (Facebook) ads generator with TypeORM and modern architecture.

## 🏗️ Project Structure

```
meta-ads-ai-generator/
├── server/                 # Backend (NestJS + TypeORM)
│   ├── src/
│   │   ├── entities/      # TypeORM entities
│   │   ├── modules/       # Feature modules
│   │   ├── config/        # Configuration
│   │   └── main.ts        # Application entry
│   ├── .env               # Environment variables
│   └── package.json
├── client/                # Frontend (Next.js)
│   ├── src/
│   │   ├── app/          # Next.js 14 app directory
│   │   ├── components/   # Reusable components
│   │   ├── lib/          # Utilities and API
│   │   └── types/        # TypeScript types
│   ├── .env.local        # Client environment
│   └── package.json
├── shared/               # Shared types and utilities
│   └── types/           # Common TypeScript interfaces
└── package.json         # Root package.json
```

## 🚀 Features

- ✅ AI Ad Copy Generation (Google Gemini)
- ✅ AI Creative Generation (Stability AI)
- ✅ Meta Ads API Integration
- ✅ TypeORM Database Management
- ✅ JWT Authentication
- ✅ Campaign Management
- ✅ Real-time Analytics

## 🛠️ Tech Stack

**Backend:**
- NestJS
- TypeORM
- PostgreSQL
- Google Gemini AI
- Meta Marketing API

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form

## 📦 Installation

```bash
# Install all dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

## 🔧 Configuration

1. Copy environment files:
```bash
cp server/.env.example server/.env
```

2. Update configuration in `server/.env` with your actual credentials
3. Run database migrations
4. Start development servers

## 🚀 Development

```bash
# Start both server and client
npm run dev

# Start only server
npm run server:dev

# Start only client
npm run client:dev
```

## 📚 Documentation

- [Server Setup](./server/README.md)
- [Client Setup](./client/README.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)