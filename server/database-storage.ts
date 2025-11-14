import { eq, sql, and, desc } from "drizzle-orm";
import { db } from "./db";
import { IStorage } from "./storage";
import { 
  users, type User, type InsertUser,
  politicians, type Politician, type InsertPolitician,
  promises, type Promise, type InsertPromise,
  bills, type Bill, type InsertBill,
  votingRecords, type VotingRecord, type InsertVotingRecord,
  ratings, type Rating, type InsertRating,
  adminLog, type AdminLog, type InsertAdminLog,
  CommentStatus
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Politician operations
  async getPolitician(id: number): Promise<Politician | undefined> {
    const [politician] = await db.select().from(politicians).where(eq(politicians.id, id));
    return politician;
  }

  async getPoliticianByName(name: string): Promise<Politician | undefined> {
    const [politician] = await db.select().from(politicians).where(eq(politicians.name, name));
    return politician;
  }

  async getPoliticians(): Promise<Politician[]> {
    return await db.select().from(politicians);
  }

  async createPolitician(insertPolitician: InsertPolitician): Promise<Politician> {
    const [politician] = await db
      .insert(politicians)
      .values(insertPolitician)
      .returning();
    return politician;
  }

  async updatePolitician(id: number, updateData: Partial<InsertPolitician>): Promise<Politician | undefined> {
    const [politician] = await db
      .update(politicians)
      .set(updateData)
      .where(eq(politicians.id, id))
      .returning();
    return politician;
  }

  async deletePolitician(id: number): Promise<boolean> {
    const result = await db
      .delete(politicians)
      .where(eq(politicians.id, id));
    return true; // If we get here, the delete succeeded
  }
  
  // Promise operations
  async getPromise(id: number): Promise<Promise | undefined> {
    const [promise] = await db.select().from(promises).where(eq(promises.id, id));
    return promise;
  }

  async getPromisesByPoliticianId(politicianId: number): Promise<Promise[]> {
    return await db
      .select()
      .from(promises)
      .where(eq(promises.politicianId, politicianId));
  }

  async createPromise(insertPromise: InsertPromise): Promise<Promise> {
    const [promise] = await db
      .insert(promises)
      .values(insertPromise)
      .returning();
    return promise;
  }

  async updatePromise(id: number, updateData: Partial<InsertPromise>): Promise<Promise | undefined> {
    const [promise] = await db
      .update(promises)
      .set(updateData)
      .where(eq(promises.id, id))
      .returning();
    return promise;
  }

  async deletePromise(id: number): Promise<boolean> {
    const result = await db
      .delete(promises)
      .where(eq(promises.id, id));
    return true; // If we get here, the delete succeeded
  }
  
  // Bill operations
  async getBill(id: number): Promise<Bill | undefined> {
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill;
  }

  async getBills(): Promise<Bill[]> {
    return await db.select().from(bills);
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const [bill] = await db
      .insert(bills)
      .values(insertBill)
      .returning();
    return bill;
  }
  
  // Voting record operations
  async getVotingRecord(id: number): Promise<VotingRecord | undefined> {
    const [record] = await db.select().from(votingRecords).where(eq(votingRecords.id, id));
    return record;
  }

  async getVotingRecordsByPoliticianId(politicianId: number): Promise<VotingRecord[]> {
    return await db
      .select()
      .from(votingRecords)
      .where(eq(votingRecords.politicianId, politicianId));
  }

  async getVotingRecordsByBillId(billId: number): Promise<VotingRecord[]> {
    return await db
      .select()
      .from(votingRecords)
      .where(eq(votingRecords.billId, billId));
  }

  async createVotingRecord(insertVotingRecord: InsertVotingRecord): Promise<VotingRecord> {
    const [record] = await db
      .insert(votingRecords)
      .values(insertVotingRecord)
      .returning();
    return record;
  }
  
  // Rating operations
  async getRating(id: number): Promise<Rating | undefined> {
    const [rating] = await db.select().from(ratings).where(eq(ratings.id, id));
    return rating;
  }

  async getRatingsByPoliticianId(politicianId: number): Promise<Rating[]> {
    return await db
      .select()
      .from(ratings)
      .where(eq(ratings.politicianId, politicianId));
  }

  async getUserRatingForPolitician(userId: string, politicianId: number): Promise<Rating | undefined> {
    const [rating] = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.userId, userId),
          eq(ratings.politicianId, politicianId)
        )
      );
    return rating;
  }

  async getRatingsByStatus(status: CommentStatus): Promise<Rating[]> {
    return await db
      .select()
      .from(ratings)
      .where(eq(ratings.status, status));
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const [rating] = await db
      .insert(ratings)
      .values(insertRating)
      .returning();
    return rating;
  }

  async updateRatingStatus(id: number, status: CommentStatus): Promise<Rating | undefined> {
    const [rating] = await db
      .update(ratings)
      .set({ status })
      .where(eq(ratings.id, id))
      .returning();
    return rating;
  }

  async getPoliticianAverageRating(politicianId: number): Promise<{ average: number, count: number } | undefined> {
    const result = await db
      .select({
        average: sql<number>`COALESCE(AVG(${ratings.rating}), 0)`,
        count: sql<number>`COUNT(*)`
      })
      .from(ratings)
      .where(
        and(
          eq(ratings.politicianId, politicianId),
          eq(ratings.status, 'Approved')
        )
      );
    
    if (result.length === 0) {
      return { average: 0, count: 0 };
    }
    
    return {
      average: result[0].average,
      count: Number(result[0].count)
    };
  }
  
  // Admin log operations
  async createAdminLog(insertAdminLog: InsertAdminLog): Promise<AdminLog> {
    const [log] = await db
      .insert(adminLog)
      .values(insertAdminLog)
      .returning();
    return log;
  }

  async getAdminLogs(): Promise<AdminLog[]> {
    return await db
      .select()
      .from(adminLog)
      .orderBy(desc(adminLog.createdAt));
  }
}