# IslandPulse Deployment Guide for Apache/Namecheap

## Prerequisites
- Node.js hosting support (check if your Namecheap plan supports Node.js)
- Database hosting (PostgreSQL recommended)
- FTP/SSH access to your server

## Step 1: Prepare Your Database

### Option A: Use a Database Service
1. **Neon Database** (recommended):
   - Visit https://neon.tech
   - Create a free account
   - Create a new project
   - Copy the connection string

2. **PlanetScale** or **Supabase**:
   - Similar setup process
   - Get PostgreSQL connection string

### Option B: Use Namecheap's Database
1. Login to your Namecheap cPanel
2. Create a PostgreSQL database
3. Note the connection details

## Step 2: Build Your Project

Run these commands locally:

```bash
# Install dependencies
npm install

# Build the frontend
npm run build

# Push database schema (if using external DB)
npm run db:push
```

## Step 3: Prepare Files for Upload

### Create production package.json:
```json
{
  "name": "islandpulse-production",
  "version": "1.0.0",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "drizzle-orm": "^0.29.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "ws": "^8.14.2",
    "zod": "^3.22.4"
  }
}
```

### Files to upload:
- `server/` folder
- `shared/` folder  
- `dist/` folder (built frontend)
- `package.json` (production version)
- `.htaccess` (see below)

## Step 4: Create .htaccess File

Create this in your public_html root:

```apache
# Enable Node.js (if supported)
AddHandler application/x-httpd-nodejs .js

# Redirect all requests to Node.js app
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ server/index.js [L]

# Handle client-side routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Step 5: Environment Variables

Create a `.env` file on your server:

```bash
NODE_ENV=production
DATABASE_URL=your_database_connection_string
SESSION_SECRET=your_long_random_secret_key
PORT=3000
```

## Step 6: Alternative Deployment Options

### If Node.js isn't supported on Apache:

#### Option 1: Static Site + External API
1. Deploy frontend as static files
2. Use services like Railway, Render, or Vercel for the backend
3. Update API endpoints in frontend

#### Option 2: Use Netlify Functions
1. Convert server routes to Netlify functions
2. Deploy frontend to Netlify
3. Use serverless database

#### Option 3: Convert to PHP (if needed)
1. Rewrite server logic in PHP
2. Use MySQL instead of PostgreSQL
3. Keep the same frontend

## Step 7: Upload and Test

1. **Upload files** via FTP/cPanel File Manager
2. **Install dependencies** (if Node.js supported):
   ```bash
   npm install --production
   ```
3. **Set permissions** (755 for directories, 644 for files)
4. **Test the application**

## Troubleshooting

### If Node.js isn't supported:
- Contact Namecheap support to enable Node.js
- Consider upgrading hosting plan
- Use alternative deployment options above

### Database connection issues:
- Check firewall settings
- Verify connection string format
- Ensure database accepts external connections

### File upload issues:
- Check file size limits
- Verify directory permissions
- Use FTP in binary mode

## Quick Commands

Build and prepare for upload:
```bash
npm run build
mkdir deployment
cp -r server shared dist package.json deployment/
```

Would you like me to help you with any specific part of this deployment process?