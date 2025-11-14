# CivicPro Backend

## Overview
Express.js backend API for the CivicPro political accountability platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure your database connection in `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/civicpro
```

4. Push database schema:
```bash
npm run db:push
```

## Development

Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`.

## Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Database Management

- **Push schema changes**: `npm run db:push`
- **View database**: `npm run db:studio`

## Deployment Options

### Node.js Hosting
- **Railway**: Connect GitHub repo and deploy
- **Render**: Web service deployment
- **DigitalOcean App Platform**: Container deployment
- **AWS Elastic Beanstalk**: Node.js environment

### VPS/Server Deployment
- Install Node.js 20+
- Clone repository
- Install dependencies
- Set environment variables
- Use PM2 for process management

### Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random string for session encryption

Optional:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

## API Endpoints

- `GET /api/politicians` - List all politicians
- `GET /api/politicians/:id` - Get politician details
- `POST /api/politicians` - Create politician (admin)
- `GET /api/promises` - List promises
- `POST /api/ratings` - Submit rating
- `GET /api/admin/*` - Admin endpoints

## Tech Stack

- Express.js with TypeScript
- Drizzle ORM with PostgreSQL
- Passport.js for authentication
- Zod for validation
- CORS enabled for frontend communication