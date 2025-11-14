# CivicPro Deployment Guide - Separated Frontend & Backend

## Project Structure

The project has been separated into two independent folders:

```
├── frontend/          # React frontend application
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── backend/           # Express.js API server
│   ├── routes.ts
│   ├── index.ts
│   ├── package.json
│   └── README.md
└── shared/            # Common schema types (duplicated in both folders)
```

## Quick Start for Development

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL in .env
npm run db:push
npm run dev  # Runs on port 3000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:3000 in .env
npm run dev  # Runs on port 5173
```

## Production Deployment Options

### Option 1: Full Cloud Deployment (Recommended)

**Backend Deployment (Railway/Render/DigitalOcean)**
1. Connect your GitHub repository
2. Deploy backend folder as Node.js service
3. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Random secure string
   - `NODE_ENV=production`
   - `FRONTEND_URL`: Your frontend domain
4. Service will run on assigned port

**Frontend Deployment (Netlify/Vercel)**
1. Connect your GitHub repository
2. Set build folder to `frontend`
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set environment variable: `VITE_API_URL` to your backend URL
6. Deploy automatically on git push

### Option 2: Traditional Web Hosting

**Backend on VPS/Dedicated Server**
```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Deploy backend
git clone your-repo
cd your-repo/backend
npm install
npm run build

# Set environment variables
echo "DATABASE_URL=your_postgres_url" > .env
echo "SESSION_SECRET=your_secret" >> .env
echo "NODE_ENV=production" >> .env

# Install PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name civicpro-backend
pm2 startup
pm2 save
```

**Frontend on Apache/Nginx**
```bash
cd frontend
npm install
npm run build

# Copy dist folder to web server
scp -r dist/* user@server:/var/www/html/

# Configure web server for SPA routing
# Apache: Enable mod_rewrite and add .htaccess
# Nginx: Add try_files directive
```

### Option 3: Docker Deployment

**Backend Dockerfile**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Frontend Dockerfile (Multi-stage)**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Docker Compose**
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SESSION_SECRET=${SESSION_SECRET}
    depends_on:
      - postgres

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:3000

  postgres:
    image: postgres:16
    environment:
      - POSTGRES_DB=civicpro
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Database Setup

### PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE civicpro;

-- Create user
CREATE USER civicpro_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE civicpro TO civicpro_user;
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@host:5432/civicpro
SESSION_SECRET=your-super-secure-random-string-here
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env)**
```
VITE_API_URL=https://your-backend-api.com
```

## Specific Hosting Services

### Netlify (Frontend)
1. Connect GitHub repository
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Environment variables: `VITE_API_URL`
4. Add `_redirects` file for SPA routing:
   ```
   /*    /index.html   200
   ```

### Vercel (Frontend)
1. Import GitHub repository
2. Framework preset: Vite
3. Root directory: `frontend`
4. Environment variables: `VITE_API_URL`

### Railway (Backend)
1. Connect GitHub repository
2. Select backend folder
3. Add PostgreSQL service
4. Set environment variables
5. Deploy automatically

### DigitalOcean App Platform
1. Create new app from GitHub
2. Add backend service (Node.js)
3. Add database (PostgreSQL)
4. Add frontend service (Static Site)
5. Configure environment variables

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (development)
- Your production frontend URL (set via FRONTEND_URL env var)

Update CORS settings in `backend/index.ts` if needed:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-domain.com"
  ],
  credentials: true
}));
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use connection pooling and SSL in production
3. **CORS**: Restrict to your frontend domain only
4. **Session Secret**: Use cryptographically secure random string
5. **HTTPS**: Always use HTTPS in production
6. **Database Credentials**: Use strong passwords and limit access

## Monitoring and Logging

- Use PM2 for Node.js process management
- Set up log rotation
- Monitor database connections
- Use health check endpoints
- Consider APM tools like New Relic or DataDog

## Troubleshooting

**Common Issues:**
1. **CORS Errors**: Check FRONTEND_URL environment variable
2. **Database Connection**: Verify DATABASE_URL format
3. **Build Failures**: Check Node.js version compatibility
4. **404 on Frontend Routes**: Configure SPA routing on web server

**Health Check Endpoints:**
- Backend: `GET /api/health`
- Frontend: Served files indicate health

This separation allows for independent scaling, deployment, and maintenance of frontend and backend components.