# Quick Start - MongoDB Setup

## Prerequisites
- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

## Fast Setup (5 minutes)

### 1. Install MongoDB Locally (Choose One)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download installer from: https://www.mongodb.com/try/download/community

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**OR Use MongoDB Atlas (Cloud - Free Tier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

Set your MongoDB connection:
```env
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/civicpro

# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/civicpro?retryWrites=true&w=majority
```

### 3. Install Dependencies & Seed Database

```bash
# Install packages (if not already done)
npm install

# Seed the database with initial data
npm run db:seed
```

Expected output:
```
🌱 Starting MongoDB seed...
✅ Connected to MongoDB
🗑️  Clearing existing data...
👤 Creating admin user...
🏛️  Creating politicians...
📋 Creating promises...
...
✅ Seed completed successfully!
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# You should see:
# ✅ Connected to MongoDB
# Backend server running on port 3000
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Admin Login**: 
  - Username: `admin`
  - Password: `admin123`

## That's It! 🎉

Your CivicPro application is now running with MongoDB!

## Troubleshooting

### "Cannot connect to MongoDB"
- **Local**: Check if MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- **Atlas**: Check your IP is whitelisted in Atlas dashboard

### "Module not found @shared/mongodb-schema"
```bash
# TypeScript might need a restart
npm run check
```

### "Port 27017 already in use"
- Another MongoDB instance is running
- Or change the port in your connection string

### Check MongoDB is Running
```bash
# Test connection
mongosh  # or mongo (older versions)
```

## Quick Commands

```bash
# Start MongoDB (macOS)
brew services start mongodb-community

# Stop MongoDB (macOS)
brew services stop mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod

# Check MongoDB status (Linux)
sudo systemctl status mongod

# View MongoDB data (GUI)
# Download MongoDB Compass: https://www.mongodb.com/products/compass
```

## Next Steps

1. ✅ Browse politicians directory
2. ✅ Test adding/editing politicians (admin panel)
3. ✅ Submit a rating
4. ✅ View comparison between politicians

## Need Help?

- Check `MONGODB_MIGRATION.md` for detailed documentation
- Check `MIGRATION_COMPLETE.md` for complete change summary
- MongoDB docs: https://docs.mongodb.com/
- Mongoose docs: https://mongoosejs.com/
