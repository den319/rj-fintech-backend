# SaaS Backend API

A robust TypeScript-based backend API for a SaaS application built with Express.js, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with access & refresh tokens
- **User Management** - User registration, login, and profile management
- **Company Management** - Multi-tenant company structure support
- **Session Tracking** - Track user sessions and activities
- **Security** - Helmet, CORS, rate limiting, and input validation
- **Database** - PostgreSQL with Prisma ORM
- **TypeScript** - Full type safety
- **Error Handling** - Centralized error handling middleware
- **Logging** - Structured logging with Pino

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/den319/rj-fintech-backend.git
cd saas_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dbname?schema=public

# Server
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_ORIGIN=http://localhost:3000

# Rate Limiting (optional)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### 4. Set up the database

Generate Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

(Optional) Launch Prisma Studio to view your database:

```bash
npm run prisma:studio
```

## 🏃‍♂️ Running the Application

### Development mode

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or your configured PORT) with auto-reload on file changes.

### Production build

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Authentication (`/api/v1/auth`)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/status` - Get authentication status
- `POST /auth/refresh` - Refresh access token

### Users (`/api/v1/users`)
- User management endpoints

### Companies (`/api/v1/companies`)
- Company management endpoints

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run load/concurrency tests:

```bash
npm run test:concurrency
```

## 🌱 Database Seeding

Seed the database with sample data:

```bash
npm run seed
```

## 📁 Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   │   ├── env.config.ts
│   │   ├── http.config.ts
│   │   ├── passport.config.ts
│   │   └── prismaClient.ts
│   ├── middlewares/     # Express middlewares
│   │   ├── asyncHandler.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── user/        # User module
│   │   └── company/     # Company module
│   ├── routes/          # Route definitions
│   ├── script/          # Scripts (seeding, etc.)
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── test/                # Test files
└── package.json
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm run build` | Build TypeScript for production |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run seed` | Seed database with sample data |
| `npm run clean:db` | remove every record from the database |
| `npm test` | Run test suite |
| `npm run test:concurrency` | Run load tests |
| `npm run typecheck` | Run TypeScript type checking (no emit) |
| `npm run lint` | Run ESLint to check for linting errors |
| `npm run lint:fix` | Run ESLint and auto-fix fixable issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is formatted correctly |
| `npm run validate` | Run typecheck, lint, and format:check (CI validation) |

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **Input Validation** with Zod schemas
- **CORS Protection** with configurable origins
- **Rate Limiting** to prevent abuse
- **Helmet.js** for security headers
- **HTTP-only Cookies** for token storage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.