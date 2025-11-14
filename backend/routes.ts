import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import { insertRatingSchema, insertPoliticianSchema, insertPromiseSchema, insertBillSchema, insertVotingRecordSchema } from "../shared/mongodb-schema";

const SessionStore = MemoryStore(session);

// Helper function to convert Mongoose documents to plain objects with id field
function toJSON(doc: any): any {
  if (!doc) return null;
  if (Array.isArray(doc)) {
    return doc.map(toJSON);
  }
  
  // Handle Mongoose documents
  let obj;
  if (doc._doc) {
    // It's a Mongoose document, extract _doc
    obj = { ...doc._doc };
  } else if (doc.toObject) {
    // It has toObject method
    obj = doc.toObject();
  } else {
    // Already a plain object
    obj = { ...doc };
  }
  
  // Convert _id to id
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  
  // Remove Mongoose metadata
  delete obj.__v;
  delete obj.$__;
  delete obj.$isNew;
  
  // Convert nested ObjectIds to strings
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      if (obj[key]._bsontype === 'ObjectId') {
        obj[key] = obj[key].toString();
      } else if (obj[key] instanceof Date) {
        // Keep dates as is
      } else if (obj[key]._doc) {
        // Nested Mongoose document
        obj[key] = toJSON(obj[key]);
      }
    }
  });
  
  return obj;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "civicview-secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    })
  );

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || user.password !== password) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const ensureAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const ensureAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && (req.user as any)?.isAdmin) {
      return next();
    }
    res.status(403).json({ message: "Forbidden: Admin access required" });
  };

  // Auth routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.json({ success: true });
    });
  });

  app.get("/api/auth/session", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Politicians routes
  app.get("/api/politicians", async (req, res) => {
    try {
      const politicians = await storage.getPoliticians();
      
      // Fetch average ratings for all politicians
      const politiciansWithRatings = await Promise.all(
        politicians.map(async (politician) => {
          const politicianObj = toJSON(politician);
          const rating = await storage.getPoliticianAverageRating(politicianObj.id);
          return {
            ...politicianObj,
            rating: rating?.average || 0,
            ratingCount: rating?.count || 0
          };
        })
      );
      
      res.json(politiciansWithRatings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching politicians" });
    }
  });

  app.get("/api/politicians/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid politician ID" });
      }

      const politician = await storage.getPolitician(id as any);
      if (!politician) {
        return res.status(404).json({ message: "Politician not found" });
      }

      const politicianObj = toJSON(politician);

      // Get promises
      const promises = await storage.getPromisesByPoliticianId(id as any);
      const promisesObj = toJSON(promises);
      
      // Get voting records with bill details
      const votingRecords = await storage.getVotingRecordsByPoliticianId(id as any);
      const votesWithBills = await Promise.all(
        votingRecords.map(async (record) => {
          const recordObj = toJSON(record);
          const bill = await storage.getBill(recordObj.billId);
          return {
            ...recordObj,
            bill: toJSON(bill)
          };
        })
      );
      
      // Get ratings
      const ratingStats = await storage.getPoliticianAverageRating(id as any);
      const ratings = await storage.getRatingsByPoliticianId(id as any);
      const approvedRatings = ratings.filter(r => r.status === "Approved");
      
      // Calculate promise fulfillment rate
      const fulfillmentStats = {
        fulfilled: promisesObj.filter((p: any) => p.status === "Fulfilled").length,
        inProgress: promisesObj.filter((p: any) => p.status === "InProgress").length,
        unfulfilled: promisesObj.filter((p: any) => p.status === "Unfulfilled").length,
        total: promisesObj.length
      };
      
      const fulfillmentRate = fulfillmentStats.total > 0 
        ? Math.round((fulfillmentStats.fulfilled / fulfillmentStats.total) * 100) 
        : 0;

      res.json({
        politician: politicianObj,
        promises: promisesObj,
        votingRecords: votesWithBills,
        ratingStats: {
          average: ratingStats?.average || 0,
          count: ratingStats?.count || 0
        },
        ratings: toJSON(approvedRatings),
        fulfillmentStats,
        fulfillmentRate
      });
    } catch (error) {
      console.error("Error fetching politician details:", error);
      res.status(500).json({ message: "Error fetching politician details" });
    }
  });

  // Admin routes - Politicians
  app.post("/api/admin/politicians", ensureAdmin, async (req, res) => {
    try {
      const validationResult = insertPoliticianSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid politician data", errors: validationResult.error.flatten() });
      }

      const politician = await storage.createPolitician(validationResult.data);
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "CREATE_POLITICIAN",
        details: { politicianId: politician.id }
      });
      
      res.status(201).json(politician);
    } catch (error) {
      res.status(500).json({ message: "Error creating politician" });
    }
  });

  app.put("/api/admin/politicians/:id", ensureAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid politician ID" });
      }

      const validationResult = insertPoliticianSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid politician data", errors: validationResult.error.flatten() });
      }

      // Extract politician data
      const { promises, votingRecords, ...politicianData } = req.body;
      
      // Update politician basic info
      const updatedPolitician = await storage.updatePolitician(id, politicianData);
      if (!updatedPolitician) {
        return res.status(404).json({ message: "Politician not found" });
      }
      
      // Handle promises if present
      if (Array.isArray(promises) && promises.length > 0) {
        // First, get existing promises to determine what to update vs. what to create
        const existingPromises = await storage.getPromisesByPoliticianId(id);
        
        // Process each promise
        for (const promise of promises) {
          if (promise.title) {
            await storage.createPromise({
              politicianId: id,
              title: promise.title,
              description: promise.description || "",
              status: promise.status || "Unfulfilled"
            });
          }
        }
      }
      
      // Handle voting records if present
      if (Array.isArray(votingRecords) && votingRecords.length > 0) {
        for (const record of votingRecords) {
          if (record.billTitle) {
            // Create a bill first
            const bill = await storage.createBill({
              title: record.billTitle,
              description: record.billDescription || "",
              dateVoted: new Date().toISOString()
            });
            
            // Then create the voting record
            await storage.createVotingRecord({
              politicianId: id,
              billId: bill.id,
              vote: record.vote || "For"
            });
          }
        }
      }
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "UPDATE_POLITICIAN",
        details: { 
          politicianId: id,
          updatedPromises: promises?.length || 0,
          updatedVotingRecords: votingRecords?.length || 0
        }
      });
      
      res.json(updatedPolitician);
    } catch (error) {
      console.error("Error updating politician:", error);
      res.status(500).json({ message: "Error updating politician" });
    }
  });

  app.delete("/api/admin/politicians/:id", ensureAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid politician ID" });
      }

      const success = await storage.deletePolitician(id);
      if (!success) {
        return res.status(404).json({ message: "Politician not found" });
      }
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "DELETE_POLITICIAN",
        details: { politicianId: id }
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting politician" });
    }
  });

  // Admin routes - Promises
  app.post("/api/admin/promises", ensureAdmin, async (req, res) => {
    try {
      const validationResult = insertPromiseSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid promise data", errors: validationResult.error.flatten() });
      }

      const politician = await storage.getPolitician(validationResult.data.politicianId);
      if (!politician) {
        return res.status(404).json({ message: "Politician not found" });
      }

      const promise = await storage.createPromise(validationResult.data);
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "CREATE_PROMISE",
        details: { promiseId: promise.id, politicianId: politician.id }
      });
      
      res.status(201).json(promise);
    } catch (error) {
      res.status(500).json({ message: "Error creating promise" });
    }
  });

  app.put("/api/admin/promises/:id", ensureAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promise ID" });
      }

      const validationResult = insertPromiseSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid promise data", errors: validationResult.error.flatten() });
      }

      const updatedPromise = await storage.updatePromise(id, validationResult.data);
      if (!updatedPromise) {
        return res.status(404).json({ message: "Promise not found" });
      }
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "UPDATE_PROMISE",
        details: { promiseId: id }
      });
      
      res.json(updatedPromise);
    } catch (error) {
      res.status(500).json({ message: "Error updating promise" });
    }
  });

  app.delete("/api/admin/promises/:id", ensureAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promise ID" });
      }

      const success = await storage.deletePromise(id);
      if (!success) {
        return res.status(404).json({ message: "Promise not found" });
      }
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "DELETE_PROMISE",
        details: { promiseId: id }
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting promise" });
    }
  });

  // Admin routes - Bills and voting records
  app.post("/api/admin/bills", ensureAdmin, async (req, res) => {
    try {
      const validationResult = insertBillSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid bill data", errors: validationResult.error.flatten() });
      }

      const bill = await storage.createBill(validationResult.data);
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "CREATE_BILL",
        details: { billId: bill.id }
      });
      
      res.status(201).json(bill);
    } catch (error) {
      res.status(500).json({ message: "Error creating bill" });
    }
  });

  app.post("/api/admin/voting-records", ensureAdmin, async (req, res) => {
    try {
      const validationResult = insertVotingRecordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid voting record data", errors: validationResult.error.flatten() });
      }

      const politician = await storage.getPolitician(validationResult.data.politicianId);
      if (!politician) {
        return res.status(404).json({ message: "Politician not found" });
      }

      const bill = await storage.getBill(validationResult.data.billId);
      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      const votingRecord = await storage.createVotingRecord(validationResult.data);
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: "CREATE_VOTING_RECORD",
        details: { votingRecordId: votingRecord.id, politicianId: politician.id, billId: bill.id }
      });
      
      res.status(201).json(votingRecord);
    } catch (error) {
      res.status(500).json({ message: "Error creating voting record" });
    }
  });

  // Rating routes
  app.post("/api/ratings", async (req, res) => {
    try {
      const validationSchema = insertRatingSchema.extend({
        userId: z.string().optional()
      });

      const validationResult = validationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid rating data", errors: validationResult.error.flatten() });
      }

      const politician = await storage.getPolitician(validationResult.data.politicianId);
      if (!politician) {
        return res.status(404).json({ message: "Politician not found" });
      }

      // Generate anonymous user ID if not provided
      const userId = validationResult.data.userId || `anon-${Math.random().toString(36).substring(2, 15)}`;
      
      // Check if user has already rated this politician
      const existingRating = await storage.getUserRatingForPolitician(userId, validationResult.data.politicianId);
      if (existingRating) {
        return res.status(400).json({ 
          message: "You have already submitted a rating for this politician." 
        });
      }

      const rating = await storage.createRating({
        ...validationResult.data,
        userId
      });

      res.status(201).json({
        ...rating,
        message: "Thank you for your rating. It will be visible after moderation."
      });
    } catch (error) {
      res.status(500).json({ message: "Error submitting rating" });
    }
  });

  // Admin routes - Rating moderation
  app.get("/api/admin/ratings/pending", ensureAdmin, async (req, res) => {
    try {
      const pendingRatings = await storage.getRatingsByStatus("Pending");
      
      // Include politician information with each rating
      const ratingsWithPolitician = await Promise.all(
        pendingRatings.map(async (rating) => {
          const ratingObj = toJSON(rating);
          const politician = await storage.getPolitician(ratingObj.politicianId);
          return {
            ...ratingObj,
            politician: toJSON(politician)
          };
        })
      );
      
      res.json(ratingsWithPolitician);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending ratings" });
    }
  });

  app.put("/api/admin/ratings/:id", ensureAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid rating ID" });
      }

      const { status } = req.body;
      if (!status || !["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedRating = await storage.updateRatingStatus(id, status as "Approved" | "Rejected");
      if (!updatedRating) {
        return res.status(404).json({ message: "Rating not found" });
      }
      
      // Log admin action
      await storage.createAdminLog({
        userId: (req.user as any).id,
        action: status === "Approved" ? "APPROVE_RATING" : "REJECT_RATING",
        details: { ratingId: id }
      });
      
      res.json(updatedRating);
    } catch (error) {
      res.status(500).json({ message: "Error updating rating status" });
    }
  });

  // Comparison endpoint
  app.get("/api/comparison", async (req, res) => {
    try {
      const ids = (req.query.ids as string || "").split(",").filter(id => id.trim());
      
      if (ids.length < 2) {
        return res.status(400).json({ message: "At least two politician IDs are required for comparison" });
      }
      
      const politicianData = await Promise.all(
        ids.map(async (id) => {
          const politician = await storage.getPolitician(id);
          if (!politician) {
            return null;
          }
          
          const politicianObj = toJSON(politician);
          const promises = await storage.getPromisesByPoliticianId(id);
          const promisesObj = toJSON(promises);
          const votingRecords = await storage.getVotingRecordsByPoliticianId(id);
          const votingRecordsObj = toJSON(votingRecords);
          const ratingStats = await storage.getPoliticianAverageRating(id);
          
          // Calculate promise fulfillment rate
          const fulfillmentStats = {
            fulfilled: promisesObj.filter((p: any) => p.status === "Fulfilled").length,
            inProgress: promisesObj.filter((p: any) => p.status === "InProgress").length,
            unfulfilled: promisesObj.filter((p: any) => p.status === "Unfulfilled").length,
            total: promisesObj.length
          };
          
          const fulfillmentRate = fulfillmentStats.total > 0 
            ? Math.round((fulfillmentStats.fulfilled / fulfillmentStats.total) * 100) 
            : 0;
          
          return {
            politician: politicianObj,
            promises: promisesObj,
            votingRecords: votingRecordsObj,
            ratingStats: {
              average: ratingStats?.average || 0,
              count: ratingStats?.count || 0
            },
            fulfillmentRate,
            fulfillmentStats
          };
        })
      );
      
      // Filter out null values (politicians that weren't found)
      const validData = politicianData.filter(data => data !== null);
      
      if (validData.length < 2) {
        return res.status(400).json({ message: "At least two valid politician IDs are required for comparison" });
      }
      
      // Find common bills that politicians voted on
      const allBillIds = new Set<string>();
      validData.forEach(data => {
        data?.votingRecords.forEach((record: any) => {
          allBillIds.add(record.billId);
        });
      });
      
      const commonBills = await Promise.all(
        Array.from(allBillIds).map(async (billId) => {
          // Get the bill
          const bill = await storage.getBill(billId);
          
          // Get votes for each politician
          const votes = validData.map(data => {
            const record = data?.votingRecords.find((r: any) => r.billId === billId);
            return {
              politicianId: data?.politician.id,
              vote: record?.vote || "Absent"
            };
          });
          
          return {
            billId,
            bill: toJSON(bill),
            votes
          };
        })
      );
      
      res.json({
        politicians: validData.map(data => data?.politician),
        comparisonData: validData,
        commonBills
      });
    } catch (error) {
      console.error("Error generating comparison:", error);
      res.status(500).json({ message: "Error generating comparison" });
    }
  });

  // Stats for admin dashboard
  app.get("/api/admin/stats", ensureAdmin, async (req, res) => {
    try {
      const politicians = await storage.getPoliticians();
      
      // Count by party
      const partyDistribution = politicians.reduce((acc: Record<string, number>, politician) => {
        const party = politician.party;
        acc[party] = (acc[party] || 0) + 1;
        return acc;
      }, {});
      
      // Total ratings
      const allRatings = [
        ...await storage.getRatingsByStatus("Approved"),
        ...await storage.getRatingsByStatus("Pending"),
        ...await storage.getRatingsByStatus("Rejected")
      ];
      
      // Pending ratings count
      const pendingRatings = await storage.getRatingsByStatus("Pending");
      
      res.json({
        totalPoliticians: politicians.length,
        totalRatings: allRatings.length,
        pendingRatings: pendingRatings.length,
        partyDistribution,
        recentActivity: []  // This would be populated with recent ratings, comments, etc.
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching admin stats" });
    }
  });

  // Get politician promises for admin editing
  app.get("/api/politicians/:id/promises", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid politician ID" });
      }
      
      const promises = await storage.getPromisesByPoliticianId(id);
      res.json({ promises });
    } catch (error) {
      console.error("Error fetching promises:", error);
      res.status(500).json({ message: "Error fetching promises" });
    }
  });
  
  // Get politician voting records with bills for admin editing
  app.get("/api/politicians/:id/voting-records", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid politician ID" });
      }
      
      const votingRecords = await storage.getVotingRecordsByPoliticianId(id);
      const votingRecordsObj = toJSON(votingRecords);
      
      // Get all related bills
      const billsMap: Record<string, any> = {};
      
      for (const record of votingRecordsObj) {
        const bill = await storage.getBill(record.billId);
        if (bill) {
          billsMap[record.billId] = toJSON(bill);
        }
      }
      
      res.json({ 
        votingRecords: votingRecordsObj, 
        bills: billsMap 
      });
    } catch (error) {
      console.error("Error fetching voting records:", error);
      res.status(500).json({ message: "Error fetching voting records" });
    }
  });

  // Create an HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
