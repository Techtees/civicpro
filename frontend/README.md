# CivicPro Frontend

## Overview
React-based frontend for the CivicPro political accountability platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the API URL in `.env` to point to your backend:
```
VITE_API_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API requests to the backend.

## Production Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to any static hosting service.

## Deployment Options

### Static Hosting (Recommended)
- **Netlify**: Connect your GitHub repo and deploy automatically
- **Vercel**: Import project and deploy with zero configuration
- **GitHub Pages**: Deploy from the `dist` folder
- **AWS S3 + CloudFront**: Upload dist folder to S3 bucket

### Traditional Web Hosting
- Upload the contents of `dist` folder to your web server's public directory
- Ensure your server supports single-page applications (SPA) routing

## Environment Variables

- `VITE_API_URL`: Backend API URL (required for production)

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- TanStack Query for data fetching
- Wouter for routing