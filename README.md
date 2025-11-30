# 🌍 WorldStats

<div align="center">

![WorldStats Banner](https://img.shields.io/badge/WorldStats-Global%20Intelligence%20Platform-9d4edd?style=for-the-badge&logo=globe&logoColor=white)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=flat-square&logo=d3.js&logoColor=white)](https://d3js.org/)

**A futuristic, high-contrast interactive web platform for exploring real-time global statistics**

[Live Demo](#) • [Features](#-features) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation)

</div>

---

## 📸 Preview

<div align="center">
  <img src="https://via.placeholder.com/800x450/050505/9d4edd?text=WorldStats+Interactive+Map" alt="WorldStats Preview" width="100%"/>
</div>

## ✨ Features

### 🗺️ Interactive World Map
- **D3.js-powered** SVG world map with smooth zoom and pan
- **Hover effects** with neon glow highlighting
- **Click to select** any country for detailed statistics
- **Graticule grid** overlay for geographical reference

### 📊 Real-Time Statistics Dashboard
- **Demographics** - Population, IQ averages, literacy rates, gender ratios
- **Military** - Global power rankings, personnel, defense budgets, assets
- **Crime** - Crime indices, safety scores, category breakdowns
- **Economic** - GDP per capita, government types, international memberships

### 🎨 Futuristic UI/UX
- **Neon cyberpunk aesthetic** with purple/pink color scheme
- **Smooth animations** powered by Framer Motion
- **Glassmorphism** panels with backdrop blur
- **Responsive design** - works on desktop and mobile

### 🔌 Production-Ready Backend
- **RESTful API** with comprehensive country data endpoints
- **WebSocket support** for real-time country comparisons
- **Rate limiting** and security headers (Helmet)
- **Scheduled data sync** via cron jobs
- **AI-powered summaries** (OpenAI integration ready)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **TailwindCSS 4** | Styling |
| **D3.js** | World Map Visualization |
| **Framer Motion** | Animations |
| **TanStack Query** | Data Fetching & Caching |
| **Recharts** | Statistical Charts |
| **Radix UI** | Accessible Components |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | Web Framework |
| **Prisma** | ORM & Database |
| **SQLite** | Database (easily swappable to PostgreSQL) |
| **Zod** | Schema Validation |
| **WebSocket (ws)** | Real-time Communication |
| **node-cron** | Scheduled Jobs |
| **Redis** | Caching (optional) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yunusemre274/WorldStats.git
   cd WorldStats
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed initial data (16 countries)
   npm run db:seed
   ```

5. **Configure environment variables**
   ```bash
   # Create .env file in /backend
   cp .env.example .env
   ```
   
   ```env
   # Backend .env
   DATABASE_URL="file:./dev.db"
   PORT=3001
   NODE_ENV=development
   
   # Optional
   REDIS_URL=redis://localhost:6379
   OPENAI_API_KEY=your_openai_key
   ```

### Running the Application

**Start the Backend (Port 3001)**
```bash
cd backend
npm run dev
```

**Start the Frontend (Port 5000)**
```bash
# From root directory
npm run dev:client
```

**Access the application**
- Frontend: http://localhost:5000
- Backend API: http://localhost:3001/api
- Prisma Studio: `npx prisma studio` (database viewer)

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Countries
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/countries` | List all countries |
| `GET` | `/country/:code` | Get country by ISO code (e.g., US, DE) |
| `GET` | `/countries/search?q=` | Search countries by name |
| `GET` | `/countries/region/:region` | Filter by region |

#### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats/overview` | Global statistics overview |
| `GET` | `/stats/compare?countries=US,DE,JP` | Compare multiple countries |

#### Real-time
| Protocol | Endpoint | Description |
|----------|----------|-------------|
| `WebSocket` | `/ws/compare` | Real-time country comparison |

### Example Response

```json
GET /api/country/US

{
  "success": true,
  "data": {
    "country": "United States",
    "code": "US",
    "code3": "USA",
    "capital": "Washington, D.C.",
    "categories": {
      "demographics": {
        "totalPopulation": 331449281,
        "medianAge": 38.5,
        "lifeExpectancy": 78.8,
        "averageIQ": 98
      },
      "economy": {
        "gdp": 25462700000000,
        "gdpPerCapita": 76330,
        "currency": "US Dollar"
      },
      "military": {
        "globalRank": 1,
        "activeSoldiers": 1390000,
        "defenseSpending": 877000000000
      },
      "political": {
        "governmentType": "Federal Presidential Republic",
        "isNato": true,
        "isG7": true
      },
      "crime": {
        "crimeIndex": 49.2,
        "safetyIndex": 50.8
      }
    }
  }
}
```

---

## 📁 Project Structure

```
WorldStats/
├── 📂 client/                    # Frontend React application
│   ├── 📂 src/
│   │   ├── 📂 components/        # React components
│   │   │   ├── WorldMap.tsx      # D3.js interactive map
│   │   │   ├── StatsPanel.tsx    # Statistics sidebar
│   │   │   ├── TopNav.tsx        # Navigation header
│   │   │   ├── LandingOverlay.tsx # Intro animation
│   │   │   └── 📂 ui/            # Radix UI components
│   │   ├── 📂 hooks/             # Custom React hooks
│   │   │   └── useCountryData.ts # API data fetching
│   │   ├── 📂 pages/             # Page components
│   │   ├── 📂 lib/               # Utilities
│   │   └── App.tsx               # Main app entry
│   └── index.html
│
├── 📂 backend/                   # Backend Node.js API
│   ├── 📂 src/
│   │   ├── 📂 controllers/       # Route handlers
│   │   ├── 📂 services/          # Business logic
│   │   ├── 📂 providers/         # External data providers
│   │   ├── 📂 middleware/        # Express middleware
│   │   ├── 📂 routes/            # API route definitions
│   │   ├── 📂 realtime/          # WebSocket handlers
│   │   ├── 📂 cron/              # Scheduled jobs
│   │   ├── 📂 ai/                # AI integration
│   │   └── index.ts              # Server entry point
│   ├── 📂 prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── seed.ts               # Initial data seeding
│   │   └── seed-more.ts          # Additional countries
│   └── package.json
│
├── 📂 shared/                    # Shared types/schemas
├── package.json                  # Root package.json
├── vite.config.ts               # Vite configuration
└── README.md
```

---

## 🗄️ Database Schema

The application uses **Prisma ORM** with the following main models:

```prisma
model Country {
  id           String         @id
  code         String         @unique  // ISO 3166-1 alpha-2
  name         String
  capital      String?
  population   BigInt?
  
  // Relations
  demographics Demographics?
  economy      Economy?
  military     Military?
  politics     Politics?
  crime        Crime?
  healthStats  HealthStats?
  education    Education?
}
```

### Available Countries (16)
🇺🇸 USA • 🇩🇪 Germany • 🇬🇧 UK • 🇫🇷 France • 🇯🇵 Japan • 🇨🇳 China • 🇮🇳 India • 🇧🇷 Brazil • 🇷🇺 Russia • 🇦🇺 Australia • 🇨🇦 Canada • 🇮🇹 Italy • 🇪🇸 Spain • 🇰🇷 South Korea • 🇲🇽 Mexico • 🇹🇷 Turkey

---

## 🎨 UI Customization

### Color Palette
```css
--neon-purple: #9d4edd;
--neon-pink: #ff1b6b;
--dark-bg: #050505;
--glass-bg: rgba(0, 0, 0, 0.8);
```

### Tailwind Configuration
The project uses custom Tailwind classes for the cyberpunk aesthetic:
- `text-neon-purple` / `text-neon-pink`
- `border-neon-purple/30`
- `shadow-[0_0_30px_rgba(157,78,221,0.3)]`

---

## 🔒 Security Features

- **Helmet.js** - Secure HTTP headers
- **CORS** - Configured for frontend origin
- **Rate Limiting** - 100 requests per 15 minutes
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma parameterized queries

---

## 📈 Performance

- **TanStack Query** - Intelligent caching & background refetching
- **Code Splitting** - Lazy-loaded routes
- **Optimized D3 Rendering** - Efficient SVG updates
- **Compression** - Gzip response compression
- **Redis Caching** - Optional in-memory cache layer

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Yunus Emre**

- GitHub: [@yunusemre274](https://github.com/yunusemre274)

---

<div align="center">

**⭐ Star this repo if you find it useful! ⭐**

Made with ❤️ and ☕

</div>
