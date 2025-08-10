# Meta Ads AI Generator - Setup Guide

## 🏗️ Project Structure

```
meta-ads-ai-generator/
├── server/                 # Backend (NestJS + TypeORM)
├── client/                 # Frontend (Next.js)
├── shared/                 # Shared types
└── docs/                   # Documentation
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

### 3. Update Configuration
Edit `server/.env`:
```bash
# Database
DB_HOST="localhost"
DB_PORT=5432
DB_USERNAME="postgres"
DB_PASSWORD="Mdasad"
DB_DATABASE="metaAds"

# Google Gemini AI
GEMINI_API_KEY="AIzaSyBSyGNE13nRsJczIFg4nIIAUujSiTW_Qd8"

# Meta/Facebook API
META_APP_ID="1077119497427018"
META_APP_SECRET="580f1f3e2ca415dbfa68283f4a1caf6e"
META_ACCESS_TOKEN="your-access-token"
META_AD_ACCOUNT_ID="act_your-ad-account-id"

# JWT
JWT_SECRET="meta-ads-ai-super-secret-jwt-key-2024"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
cd server
npm run schema:sync  # Creates tables
```

### 5. Start Development
```bash
npm run dev
```

## 🔧 Features

### ✅ Working Features
- AI Ad Copy Generation (Google Gemini)
- User Authentication (JWT)
- Campaign Management
- Database with TypeORM
- Clean Architecture

### 🔄 Meta Integration Setup
1. Get access token from Graph API Explorer
2. Add to `META_ACCESS_TOKEN` in server/.env
3. Get ad account ID and add to `META_AD_ACCOUNT_ID`
4. Test integration in app

### 🎨 Optional: Image Generation
Add Stability AI key to enable image generation:
```bash
STABILITY_API_KEY="your-stability-ai-key"
```

## 📚 Documentation

- [Server Documentation](../server/README.md)
- [Client Documentation](../client/README.md)
- [API Reference](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🛠️ Development Commands

```bash
# Root commands
npm run dev              # Start both server and client
npm run build           # Build both applications
npm run clean           # Clean all node_modules

# Server commands
npm run server:dev      # Start server only
npm run server:build    # Build server

# Client commands  
npm run client:dev      # Start client only
npm run client:build    # Build client

# Database commands (in server/)
npm run schema:sync     # Sync database schema
npm run migration:generate  # Generate migration
npm run migration:run   # Run migrations
```

## 🎯 Next Steps

1. **Complete Meta Integration:**
   - Get access token from Facebook
   - Test campaign creation
   - Set up webhooks for real-time updates

2. **Add Image Generation:**
   - Get Stability AI API key
   - Test creative generation

3. **Deploy to Production:**
   - Set up production database
   - Configure environment variables
   - Deploy to cloud platform

## 🔍 Troubleshooting

### Database Issues
- Ensure PostgreSQL is running
- Check connection credentials
- Run `npm run schema:sync` to create tables

### Meta API Issues
- Verify access token is valid
- Check app permissions in Facebook Developer Console
- Ensure ad account has proper access

### Build Issues
- Run `npm run clean` and reinstall dependencies
- Check TypeScript compilation errors
- Verify environment variables are set