# Eternal Chase - Deployment Guide

## Project Overview
Complete Young Adult sci-fi romance thriller web application with authentication and subscription system.

## Platform Compatibility
This project can be deployed on:
- **Vercel** (Recommended for frontend + serverless functions)
- **Netlify** (Frontend with serverless functions)
- **Railway** (Full-stack with database)
- **Render** (Full-stack with database)
- **Heroku** (Full-stack with database)
- **DigitalOcean App Platform**
- **AWS** (Lambda + RDS)
- **Self-hosted VPS**

## Requirements

### Environment Variables
Copy these from your Replit secrets or set them in your new platform:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/dbname
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database-name

# Authentication
SESSION_SECRET=your-random-session-secret
REPL_ID=your-replit-app-id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-domain.com

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
VITE_STRIPE_PUBLIC_KEY=pk_test_... (or pk_live_...)
```

### Database Setup
1. Create PostgreSQL database on your hosting platform
2. Run database migrations: `npm run db:push`
3. Tables will be created automatically: users, newsletters, purchases, sessions

## Deployment Steps

### Option 1: Vercel (Recommended)
1. Upload project to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy database on Neon, Supabase, or PlanetScale
5. Update DATABASE_URL

### Option 2: Railway
1. Upload to GitHub
2. Connect Railway to repository
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Option 3: Render
1. Upload to GitHub
2. Create Web Service on Render
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

### Option 4: Self-Hosted
1. Set up Node.js server (18+)
2. Install PostgreSQL
3. Clone repository
4. Run: `npm install`
5. Set environment variables
6. Run: `npm run db:push`
7. Start: `npm run dev` (development) or `npm run build && npm start` (production)

## Build Commands
```bash
# Install dependencies
npm install

# Database setup
npm run db:push

# Development
npm run dev

# Production build
npm run build

# Start production
npm start
```

## Features Included
- **Authentication**: Replit OAuth integration
- **Subscriptions**: $9.99/month Stripe billing
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: React + TypeScript + TailwindCSS
- **Content**: Complete trilogy showcase with audiobooks
- **E-commerce**: Subscription management and purchases

## Important Files
- `server/routes.ts` - API endpoints
- `server/replitAuth.ts` - Authentication setup
- `shared/schema.ts` - Database schema
- `client/src/App.tsx` - Frontend routing
- `package.json` - Dependencies and scripts

## Support
- Database migrations: `npm run db:push`
- Reset database: Drop tables and re-run migrations
- Authentication issues: Check REPLIT_DOMAINS and REPL_ID
- Payment issues: Verify Stripe keys in dashboard

## Security Notes
- Never commit environment variables to Git
- Use HTTPS in production
- Set secure session cookies
- Validate Stripe webhooks in production
- Keep dependencies updated

---
Created: January 27, 2025
Last Updated: January 27, 2025