# WorldStats Backend API

A production-ready Node.js/Express backend for real-time global country statistics, powering a futuristic neon UI with 3D interactive world map.

## 🌍 Features

- **Real-time data sync** from 8 authoritative global data sources
- **AI-powered country summaries** via OpenAI GPT-4
- **WebSocket support** for live country comparisons
- **SSE fallback** for real-time updates
- **Redis caching** with configurable TTLs
- **Fuzzy search** with Fuse.js
- **Scheduled sync** via node-cron
- **Full TypeScript** with strict typing

## 📊 Data Sources

| Provider | Data Type | API |
|----------|-----------|-----|
| World Bank | GDP, Population, Economic indicators | World Development Indicators API |
| United Nations | Demographics, HDI, SDG metrics | UN Data API |
| OECD | Economic statistics, OECD countries | OECD.Stat API |
| CIA Factbook | Geography, Government, Languages | REST Countries (mirror) |
| Global Firepower | Military rankings, Defense data | GFP API |
| Henley & Partners | Passport power, Visa-free access | Henley Index |
| WHO | Health statistics, Life expectancy | WHO GHO API |
| Numbeo | Cost of living, Crime indices | Numbeo API |

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript (ES2022)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis (ioredis)
- **Real-time**: WebSocket (ws) + Server-Sent Events
- **AI**: OpenAI GPT-4
- **Scheduler**: node-cron
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data (10 countries)
├── src/
│   ├── index.ts           # Main entry point
│   ├── db/
│   │   └── client.ts      # Prisma client singleton
│   ├── utils/
│   │   ├── config.ts      # Environment configuration
│   │   ├── redis.ts       # Redis client & helpers
│   │   ├── logger.ts      # Winston logger
│   │   ├── errors.ts      # Custom error classes
│   │   └── helpers.ts     # Utility functions
│   ├── providers/         # Data source integrations
│   │   ├── base.provider.ts
│   │   ├── worldbank.provider.ts
│   │   ├── un.provider.ts
│   │   ├── oecd.provider.ts
│   │   ├── cia.provider.ts
│   │   ├── gfp.provider.ts
│   │   ├── henley.provider.ts
│   │   ├── who.provider.ts
│   │   ├── numbeo.provider.ts
│   │   └── index.ts
│   ├── services/          # Business logic
│   │   ├── country.service.ts
│   │   ├── chart.service.ts
│   │   ├── comparison.service.ts
│   │   ├── sync.service.ts
│   │   └── index.ts
│   ├── ai/
│   │   └── countrySummary.generator.ts
│   ├── realtime/
│   │   ├── realtime.service.ts
│   │   ├── sse.ts
│   │   └── compare.ws.ts
│   ├── cron/
│   │   └── syncAll.cron.ts
│   ├── controllers/
│   │   └── country.controller.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   └── routes/
│       └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- OpenAI API key (for AI summaries)

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your environment variables in .env
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/worldstats"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI (for AI summaries)
OPENAI_API_KEY="sk-..."

# Server
PORT=3001
NODE_ENV=development

# Optional: API keys for providers
NUMBEO_API_KEY=""
GFP_API_KEY=""
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with initial data
npx prisma db seed
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### Countries

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/countries` | List all countries (basic info) |
| `GET` | `/api/countries/:code` | Get full country details |
| `GET` | `/api/countries/:code/charts` | Get chart data for country |
| `GET` | `/api/countries/:code/summary` | Get AI-generated summary |
| `GET` | `/api/countries/search?q=` | Search countries |

### Comparison

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/compare?c1=US&c2=CN` | Compare two countries |

### Sync

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sync` | Trigger manual sync |
| `GET` | `/api/sync/status` | Get sync status |

### Real-time

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/realtime/sse` | SSE stream for updates |
| `WS` | `/ws/compare` | WebSocket for live comparison |

## 📋 API Response Examples

### GET /api/countries

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "DE",
      "name": "Germany",
      "capital": "Berlin",
      "region": "Europe",
      "flagUrl": "https://flagcdn.com/de.svg",
      "population": 83200000,
      "gdpNominal": 4072000000000
    }
  ],
  "meta": {
    "cached": true,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/countries/DE

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "DE",
    "name": "Germany",
    "officialName": "Federal Republic of Germany",
    "capital": "Berlin",
    "region": "Europe",
    "subregion": "Western Europe",
    "demographics": {
      "population": 83200000,
      "medianAge": 45.7,
      "averageIq": 102,
      "literacyRate": 99.0
    },
    "economy": {
      "gdpNominal": 4072000000000,
      "gdpPerCapita": 48940,
      "unemploymentRate": 3.1
    },
    "military": {
      "globalRank": 16,
      "totalPersonnel": 184000,
      "natoMember": true,
      "nuclearWeapons": false
    },
    "politics": {
      "governmentType": "Federal Parliamentary Republic",
      "euMember": true,
      "passportRank": 3
    },
    "crime": {
      "overallIndex": 35.1,
      "homicideRate": 0.9
    },
    "health": {
      "lifeExpectancyOverall": 81.3,
      "healthcareSpendingPercent": 11.7
    }
  }
}
```

### GET /api/countries/DE/summary

```json
{
  "success": true,
  "data": {
    "countryCode": "DE",
    "countryName": "Germany",
    "summary": "Germany is a highly developed nation in Western Europe with the largest economy in the EU...",
    "highlights": [
      "4th largest economy globally with $4.07T GDP",
      "Population of 83.2 million with 45.7 median age",
      "NATO member ranking 16th in military power",
      "EU founding member with strong democratic institutions"
    ],
    "generatedAt": "2024-01-15T10:30:00Z",
    "cached": true
  }
}
```

### GET /api/compare?c1=US&c2=CN

```json
{
  "success": true,
  "data": {
    "countries": ["USA", "China"],
    "differences": [
      {
        "category": "Economy",
        "metrics": [
          {
            "name": "GDP (Nominal)",
            "country1Value": 25460000000000,
            "country2Value": 17960000000000,
            "unit": "USD",
            "winner": "US"
          }
        ]
      }
    ],
    "summary": "The United States leads in nominal GDP while China has a larger population..."
  }
}
```

## 🔄 Real-time Updates

### Server-Sent Events (SSE)

```javascript
const eventSource = new EventSource('http://localhost:3001/api/realtime/sse');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
};
```

### WebSocket Comparison

```javascript
const ws = new WebSocket('ws://localhost:3001/ws/compare');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'join',
    payload: { codes: ['US', 'CN'] }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'comparison_update') {
    console.log('Comparison updated:', data.payload);
  }
};
```

## ⏰ Scheduled Tasks

The backend runs automatic data sync daily at 3:00 AM UTC:

```typescript
// Configured in src/cron/syncAll.cron.ts
cron.schedule('0 3 * * *', () => syncService.syncAll());
```

## 🔒 Security

- **Helmet** for HTTP security headers
- **CORS** with configurable origins
- **Rate limiting** per provider to respect API limits
- **Input validation** on all endpoints
- **SQL injection protection** via Prisma parameterized queries

## 📊 Caching Strategy

| Data Type | TTL | Key Pattern |
|-----------|-----|-------------|
| Country list | 6 hours | `countries:all` |
| Country detail | 6 hours | `country:{code}` |
| Charts | 12 hours | `charts:{code}` |
| Comparison | 1 hour | `compare:{c1}:{c2}` |
| AI Summary | 24 hours | `summary:{code}` |

## 🧪 Development

```bash
# Run in development mode
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format

# Database studio
npx prisma studio
```

## 📦 Production Deployment

```bash
# Build TypeScript
npm run build

# Set NODE_ENV
export NODE_ENV=production

# Run with PM2 (recommended)
pm2 start dist/index.js --name worldstats-api

# Or with Docker
docker-compose up -d
```

## 🤝 Frontend Integration

The frontend API client is located at `client/src/api/`:

```typescript
import { countryApi } from '@/api';

// Fetch all countries
const countries = await countryApi.getAll();

// Get country details
const germany = await countryApi.getOne('DE');

// Compare countries
const comparison = await countryApi.compare('US', 'CN');

// AI summary
const summary = await countryApi.summary('JP');
```

React Query hooks are available at `client/src/hooks/useCountryApi.ts`:

```typescript
import { useCountry, useCountryComparison } from '@/hooks/useCountryApi';

function CountryPage({ code }) {
  const { data, isLoading } = useCountry(code);
  // ...
}
```

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for the WorldStats project
