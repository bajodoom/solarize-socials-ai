# Solarize Socials AI

An AI-powered social media automation platform that generates content with A/B testing variations, creates AI images, integrates trending topics, and provides a visual content calendar for scheduling posts across multiple social platforms.

## Features

### 🤖 AI-Powered Content Generation
- Generate engaging social media posts using GPT-4o
- Create 3 content variations per request for A/B testing
- Platform-specific optimization (Twitter, LinkedIn, Facebook, Instagram)
- Tone customization (professional, casual, funny, inspiring)
- Automatic hashtag extraction and suggestions

### 🎨 AI Image Generation
- DALL-E 3 integration for stunning visuals
- 1024x1024 high-quality images
- Style customization options
- Automatic prompt enhancement

### 📈 Trend Integration
- Fetch trending topics automatically
- Incorporate relevant trends into content
- 24-hour caching for performance
- Support for multiple platforms

### 📅 Smart Scheduling
- Visual content calendar with FullCalendar
- Drag-and-drop scheduling
- BullMQ + Redis for reliable job processing
- Retry logic with exponential backoff
- Support for immediate and scheduled publishing

### 🌐 Multi-Platform Publishing
- Twitter (X) integration
- LinkedIn professional posts
- Facebook page publishing
- Instagram business accounts
- Unified API for all platforms
- Platform-specific formatting

### 📊 Analytics & Tracking
- Track post performance
- Monitor likes, shares, comments
- Impressions and click tracking
- Per-platform analytics

## Tech Stack

- **Frontend & Backend**: Next.js 14 with App Router, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI API (GPT-4o, DALL-E 3)
- **Queue System**: BullMQ + Redis
- **Social APIs**: Twitter API v2, LinkedIn API, Meta Graph API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server
- OpenAI API key
- Social media API credentials (optional for full functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bajodoom/solarize-socials-ai.git
cd solarize-socials-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/solarize_socials"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OpenAI (required for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"

# Redis (required for scheduling)
REDIS_URL="redis://localhost:6379"

# Social Media APIs (optional)
TWITTER_API_KEY="your-twitter-api-key"
TWITTER_API_SECRET="your-twitter-api-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
solarize-socials-ai/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── ai/            # AI generation endpoints
│   │   │   ├── post/          # Post management
│   │   │   ├── trends/        # Trending topics
│   │   │   └── social/        # Social account connections
│   │   ├── (auth)/            # Auth pages
│   │   └── (dashboard)/       # Dashboard pages
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── calendar/          # Calendar components
│   │   ├── content/           # Content editor & variations
│   │   └── dashboard/         # Dashboard components
│   └── lib/
│       ├── ai/                # AI integration logic
│       ├── social/            # Social media APIs
│       ├── auth.ts            # NextAuth config
│       ├── db.ts              # Prisma client
│       └── utils.ts           # Utility functions
├── .env.example               # Environment template
└── package.json
```

## API Documentation

### Content Generation
**POST** `/api/ai/generate`
```json
{
  "topic": "AI and social media",
  "platform": "twitter",
  "tone": "professional",
  "includeTrends": true,
  "variations": 3
}
```

### Image Generation
**POST** `/api/ai/image`
```json
{
  "prompt": "A futuristic social media dashboard",
  "style": "modern and professional"
}
```

### Fetch Trends
**GET** `/api/trends?platform=twitter`

### Create Post
**POST** `/api/post/create`
```json
{
  "content": "Your post content",
  "platforms": ["twitter", "linkedin"],
  "imageUrl": "https://...",
  "variations": [...]
}
```

### Schedule Post
**POST** `/api/post/schedule`
```json
{
  "postId": "post-id",
  "scheduledTime": "2024-12-25T10:00:00Z",
  "platforms": ["twitter", "linkedin"]
}
```

### Publish Immediately
**POST** `/api/post/publish`
```json
{
  "postId": "post-id",
  "platforms": ["twitter", "linkedin"]
}
```

## Database Schema

The application uses Prisma with the following main models:

- **User**: User accounts with authentication
- **SocialAccount**: Connected social media accounts
- **Post**: Content with variations, scheduling, and metadata
- **Template**: Reusable content templates
- **Analytics**: Post performance metrics
- **Trend**: Cached trending topics

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Database Setup

Use a PostgreSQL provider like:
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [Railway](https://railway.app/)

### Redis Setup

Use a Redis provider like:
- [Upstash](https://upstash.com/) (recommended for serverless)
- [Redis Cloud](https://redis.com/try-free/)

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

### Database Migrations
```bash
npx prisma migrate dev
npx prisma studio  # Open Prisma Studio
```

## Security Considerations

- All API keys are stored in environment variables
- NextAuth.js handles authentication securely
- Social media tokens are encrypted in the database
- API routes are protected with authentication middleware
- Rate limiting implemented on API endpoints

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/bajodoom/solarize-socials-ai/issues)
- Documentation: Check this README and code comments

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Post performance predictions
- [ ] Team collaboration features
- [ ] Custom AI model fine-tuning
- [ ] More social platform integrations
- [ ] Mobile app

---

Built with ❤️ using Next.js, TypeScript, and OpenAI
