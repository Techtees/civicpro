# MongoDB Migration Guide

This project has been migrated from PostgreSQL (with Drizzle ORM) to MongoDB (with Mongoose).

## Environment Variables

Update your environment variables:

### Old (PostgreSQL):
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

### New (MongoDB):
```
MONGODB_URI=mongodb://user:password@host:27017/database
# Or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Database Setup

### 1. Install MongoDB

**Local Installation:**
- macOS: `brew install mongodb-community`
- Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

**Or use MongoDB Atlas (Cloud):**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist

### 2. Seed the Database

Run the seed script to populate your MongoDB database with initial data:

```bash
npm run db:seed
```

This will create:
- 1 admin user (username: `admin`, password: `admin123`)
- 6 politicians with their profiles
- Multiple promises, bills, voting records, and ratings
- Admin log entries

## Running the Application

### Development:
```bash
npm run dev
```

### Production:
```bash
npm run build
npm start
```

## Key Changes

### Schema Definition
- **Before**: Drizzle ORM with `pgTable` (shared/schema.ts)
- **After**: Mongoose with Schema definitions (shared/mongodb-schema.ts)

### Database Connection
- **Before**: Neon PostgreSQL with connection pooling
- **After**: Mongoose connection to MongoDB

### Data Models
MongoDB uses `_id` (ObjectId) instead of auto-incrementing integer IDs. The application handles this transition internally.

### Migration Highlights

1. **User Management**: Admin authentication still works the same way
2. **Politicians**: All politician data, including manifesto points
3. **Promises**: Track politician promises with fulfillment status
4. **Bills & Voting**: Complete voting record history
5. **Ratings**: Citizen ratings with moderation system
6. **Admin Logs**: Audit trail for admin actions

## Database Schema

### Collections:
- `users` - Admin users
- `politicians` - Politician profiles
- `promises` - Campaign promises
- `bills` - Legislative bills
- `votingrecords` - How politicians voted
- `ratings` - Citizen ratings and comments
- `adminlogs` - Admin activity logs

## Troubleshooting

### Connection Issues
If you can't connect to MongoDB:
1. Check if MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
2. Verify your MONGODB_URI is correct
3. Ensure your IP is whitelisted (for Atlas)
4. Check firewall settings

### Port Conflicts
Default MongoDB port is 27017. If it's in use, specify a different port in your connection string.

### Data Validation
Mongoose provides built-in validation. Check console logs for validation errors if operations fail.

## Development Notes

- The old `seed.sql` file is retained for reference but is no longer used
- TypeScript types are maintained through Mongoose Document interfaces
- All API endpoints remain the same - no frontend changes needed
- Zod schemas still used for API request validation

## Support

For MongoDB-specific questions, refer to:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
