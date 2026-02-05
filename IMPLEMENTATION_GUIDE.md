# Implementation Guide - Solarize Socials AI

## Overview
This guide provides step-by-step instructions for setting up, deploying, and using the AI Social Media Automation Platform.

## Project Status

### ✅ Completed Features
1. **Core Infrastructure**
   - Next.js 14 with App Router and TypeScript
   - Tailwind CSS + shadcn/ui components
   - Prisma ORM with PostgreSQL
   - NextAuth.js authentication

2. **AI Integration**
   - OpenAI GPT-4o for content generation with A/B testing variations
   - DALL-E 3 for AI image generation
   - Trend integration system with caching

3. **Social Media APIs**
   - Twitter API v2 integration
   - LinkedIn API integration
   - Facebook Graph API integration
   - Instagram Business API integration

4. **Scheduling System**
   - BullMQ + Redis for reliable job scheduling
   - Retry logic with exponential backoff
   - Support for immediate and scheduled publishing

5. **API Routes**
   - `/api/ai/generate` - Generate content with variations
   - `/api/ai/image` - Generate AI images
   - `/api/trends` - Fetch trending topics
   - `/api/post/*` - Post management (create, schedule, publish)
   - `/api/social/*` - Social account management
   - `/api/auth/*` - Authentication endpoints

6. **User Interface**
   - Professional landing page
   - Login/Signup pages
   - Basic dashboard with quick actions
   - Responsive design

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Redis server (local or cloud)
- OpenAI API key
- Social media API credentials (optional)

### Step 1: Clone and Install

```bash
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai
npm install
```

### Step 2: Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/solarize_socials"

# NextAuth (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# OpenAI (Required for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"

# Redis (Required for scheduling)
REDIS_URL="redis://localhost:6379"

# Social Media APIs (Optional - configure as needed)
TWITTER_API_KEY="your-key"
TWITTER_API_SECRET="your-secret"
LINKEDIN_CLIENT_ID="your-id"
LINKEDIN_CLIENT_SECRET="your-secret"
META_APP_ID="your-id"
META_APP_SECRET="your-secret"
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Database Options:**
- [Supabase](https://supabase.com/) - Free PostgreSQL
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Railway](https://railway.app/) - PostgreSQL + Redis

**Redis Options:**
- [Upstash](https://upstash.com/) - Serverless Redis (recommended)
- [Redis Cloud](https://redis.com/try-free/)

### Option 2: Self-Hosted

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Set up Redis and PostgreSQL
4. Configure environment variables
5. Set up reverse proxy (nginx)

## Usage Guide

### 1. Create Account
- Visit `/signup`
- Enter name, email, and password
- Account is created and auto-logged in

### 2. Connect Social Accounts
- Go to Settings (to be implemented in UI)
- Use `/api/social/connect` endpoint
- Follow OAuth flow for each platform

### 3. Generate Content

**Via API:**
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI and social media",
    "platform": "twitter",
    "tone": "professional",
    "includeTrends": true,
    "variations": 3
  }'
```

**Response:**
```json
{
  "variations": [
    {
      "text": "Content variation 1...",
      "hashtags": ["#AI", "#SocialMedia"],
      "characterCount": 250
    },
    {
      "text": "Content variation 2...",
      "hashtags": ["#AI", "#Tech"],
      "characterCount": 240
    },
    {
      "text": "Content variation 3...",
      "hashtags": ["#ArtificialIntelligence"],
      "characterCount": 260
    }
  ],
  "platform": "twitter",
  "tone": "professional",
  "aiModel": "gpt-4o"
}
```

### 4. Generate Images

```bash
curl -X POST http://localhost:3000/api/ai/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic social media dashboard",
    "style": "modern and professional"
  }'
```

### 5. Create and Schedule Posts

```bash
# Create post
curl -X POST http://localhost:3000/api/post/create \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your post content",
    "platforms": ["twitter", "linkedin"],
    "imageUrl": "https://...",
    "variations": [...]
  }'

# Schedule post
curl -X POST http://localhost:3000/api/post/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "post-id",
    "scheduledTime": "2024-12-25T10:00:00Z",
    "platforms": ["twitter", "linkedin"]
  }'

# Publish immediately
curl -X POST http://localhost:3000/api/post/publish \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "post-id",
    "platforms": ["twitter"]
  }'
```

## Architecture

### Database Schema
```
User
├── SocialAccount (connected platforms)
├── Post (content + variations)
└── Template (reusable prompts)

Post
├── Analytics (performance metrics)
└── variations (A/B testing content)

Trend (cached trending topics)
```

### API Flow
```
1. User creates content request
   ↓
2. AI generates variations
   ↓
3. User selects best variation
   ↓
4. Post is created in database
   ↓
5. BullMQ schedules publishing job
   ↓
6. Worker publishes to platforms
   ↓
7. Analytics are tracked
```

### Worker Process (Background Jobs)

To process scheduled posts, run a worker process:

```javascript
// worker.js
const { createPostWorker } = require('./src/lib/social/scheduler');

const worker = createPostWorker();

console.log('Worker started');

process.on('SIGTERM', async () => {
  await worker.close();
});
```

Run with:
```bash
node worker.js
```

Or use a process manager like PM2:
```bash
pm2 start worker.js --name social-worker
```

## API Reference

### Authentication Required
All API endpoints (except auth routes) require authentication via NextAuth session cookie.

### Rate Limits
- AI Generation: Depends on OpenAI API limits
- Social Publishing: Depends on platform API limits
- Recommendation: Implement rate limiting middleware

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db push

# View database in browser
npx prisma studio
```

### OpenAI API Errors
- Check API key is valid
- Ensure billing is set up
- Monitor usage limits

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping

# Check Redis URL format
redis://localhost:6379
redis://username:password@host:port
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Next Steps

### Recommended Improvements
1. **UI Enhancements**
   - Complete content editor with rich text
   - FullCalendar integration for scheduling
   - Platform-specific preview components
   - Analytics dashboard with charts

2. **Features**
   - Post templates system
   - Bulk scheduling
   - Content library/media management
   - Team collaboration
   - Advanced analytics

3. **Security**
   - API rate limiting
   - Input validation middleware
   - CORS configuration
   - API key rotation

4. **Performance**
   - Image optimization
   - CDN integration
   - Database query optimization
   - Caching strategies

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/bajodoom/solarize-socials-ai/issues)
- Documentation: See README.md

## License
MIT License - see LICENSE file for details
