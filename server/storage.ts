import {
  User, InsertUser, 
  Politician, InsertPolitician,
  Promise, InsertPromise,
  Bill, InsertBill,
  VotingRecord, InsertVotingRecord,
  Rating, InsertRating,
  AdminLog, InsertAdminLog,
  CommentStatus
} from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Politician operations
  getPolitician(id: number): Promise<Politician | undefined>;
  getPoliticianByName(name: string): Promise<Politician | undefined>;
  getPoliticians(): Promise<Politician[]>;
  createPolitician(politician: InsertPolitician): Promise<Politician>;
  updatePolitician(id: number, politician: Partial<InsertPolitician>): Promise<Politician | undefined>;
  deletePolitician(id: number): Promise<boolean>;
  
  // Promise operations
  getPromise(id: number): Promise<Promise | undefined>;
  getPromisesByPoliticianId(politicianId: number): Promise<Promise[]>;
  createPromise(promise: InsertPromise): Promise<Promise>;
  updatePromise(id: number, promise: Partial<InsertPromise>): Promise<Promise | undefined>;
  deletePromise(id: number): Promise<boolean>;
  
  // Bill operations
  getBill(id: number): Promise<Bill | undefined>;
  getBills(): Promise<Bill[]>;
  createBill(bill: InsertBill): Promise<Bill>;
  
  // Voting record operations
  getVotingRecord(id: number): Promise<VotingRecord | undefined>;
  getVotingRecordsByPoliticianId(politicianId: number): Promise<VotingRecord[]>;
  getVotingRecordsByBillId(billId: number): Promise<VotingRecord[]>;
  createVotingRecord(votingRecord: InsertVotingRecord): Promise<VotingRecord>;
  
  // Rating operations
  getRating(id: number): Promise<Rating | undefined>;
  getRatingsByPoliticianId(politicianId: number): Promise<Rating[]>;
  getUserRatingForPolitician(userId: string, politicianId: number): Promise<Rating | undefined>;
  getRatingsByStatus(status: CommentStatus): Promise<Rating[]>;
  createRating(rating: InsertRating): Promise<Rating>;
  updateRatingStatus(id: number, status: CommentStatus): Promise<Rating | undefined>;
  getPoliticianAverageRating(politicianId: number): Promise<{ average: number, count: number } | undefined>;
  
  // Admin log operations
  createAdminLog(log: InsertAdminLog): Promise<AdminLog>;
  getAdminLogs(): Promise<AdminLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private politicians: Map<number, Politician>;
  private promises: Map<number, Promise>;
  private bills: Map<number, Bill>;
  private votingRecords: Map<number, VotingRecord>;
  private ratings: Map<number, Rating>;
  private adminLogs: Map<number, AdminLog>;
  
  // Track auto-incrementing IDs
  private userId: number;
  private politicianId: number;
  private promiseId: number;
  private billId: number;
  private votingRecordId: number;
  private ratingId: number;
  private adminLogId: number;
  
  constructor() {
    this.users = new Map();
    this.politicians = new Map();
    this.promises = new Map();
    this.bills = new Map();
    this.votingRecords = new Map();
    this.ratings = new Map();
    this.adminLogs = new Map();
    
    this.userId = 1;
    this.politicianId = 1;
    this.promiseId = 1;
    this.billId = 1;
    this.votingRecordId = 1;
    this.ratingId = 1;
    this.adminLogId = 1;
    
    // Initialize with admin user
    this.createUser({
      username: 'admin',
      password: 'admin123', // In a real app, this would be hashed
      isAdmin: true
    });
    
    // Initialize with sample politicians
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Sample politicians
    const janeSmith = this.createPolitician({
      name: 'Jane Smith',
      party: 'Democratic',
      parish: 'St. Peter Port',
      bio: 'Jane Smith is a Democratic member representing St. Peter Port parish. She was first elected in 2018 and has focused her legislative efforts on environmental protection, healthcare reform, and economic equality.',
      firstElected: new Date('2018-11-06'),
      profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150'
    });
    
    const johnDoe = this.createPolitician({
      name: 'John Doe',
      party: 'Republican',
      parish: 'St. Sampson',
      bio: 'John Doe is a Republican member representing St. Sampson parish. He focuses on defense, economic growth, and fiscal responsibility.',
      firstElected: new Date('2016-11-08'),
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150'
    });
    
    const mariaRodriguez = this.createPolitician({
      name: 'Maria Rodriguez',
      party: 'Independent',
      parish: 'Vale',
      bio: 'Maria Rodriguez is an Independent member representing Vale parish. She advocates for education reform, environmental policies, and social justice.',
      firstElected: new Date('2020-11-03'),
      profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150'
    });
    
    const robertJohnson = this.createPolitician({
      name: 'Robert Johnson',
      party: 'Democratic',
      district: 'Illinois 7th District',
      bio: 'Robert Johnson is a Democratic member of the U.S. House representing Illinois\'s 7th congressional district. He focuses on urban development, healthcare access, and education.',
      firstElected: new Date('2018-11-06'),
      profileImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150'
    });
    
    const sarahWilliams = this.createPolitician({
      name: 'Sarah Williams',
      party: 'Republican',
      district: 'Florida 18th District',
      bio: 'Sarah Williams is a Republican member of the U.S. House representing Florida\'s 18th congressional district. She advocates for small business, national security, and coastal protection.',
      firstElected: new Date('2020-11-03'),
      profileImageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150'
    });
    
    // Sample promises
    // Jane Smith's promises
    this.createPromise({
      politicianId: janeSmith.id,
      title: 'Expand renewable energy investments',
      description: 'Promised to increase federal funding for renewable energy research by 25% and successfully voted for the Clean Energy Act of 2022.',
      status: 'Fulfilled',
      fulfillmentDate: new Date('2022-03-15')
    });
    
    this.createPromise({
      politicianId: janeSmith.id,
      title: 'Increase minimum wage',
      description: 'Promised to support federal minimum wage increases and voted for the Fair Wage Act of 2021.',
      status: 'Fulfilled',
      fulfillmentDate: new Date('2021-07-20')
    });
    
    this.createPromise({
      politicianId: janeSmith.id,
      title: 'Expand healthcare coverage',
      description: 'Promised to work on healthcare reform to cover more Americans. Bill still pending in committee.',
      status: 'InProgress'
    });
    
    // John Doe's promises
    this.createPromise({
      politicianId: johnDoe.id,
      title: 'Strengthen border security',
      description: 'Promised to increase funding for border patrol and security infrastructure.',
      status: 'Fulfilled',
      fulfillmentDate: new Date('2021-06-10')
    });
    
    this.createPromise({
      politicianId: johnDoe.id,
      title: 'Tax cuts for small businesses',
      description: 'Promised tax relief for small businesses affected by the pandemic.',
      status: 'InProgress'
    });
    
    // Sample bills
    const climateBill = this.createBill({
      title: 'Climate Protection Act',
      description: 'A bill to fund renewable energy research and limit carbon emissions.',
      dateVoted: new Date('2023-06-12')
    });
    
    const infrastructureBill = this.createBill({
      title: 'Infrastructure Funding Bill',
      description: 'A bill to fund infrastructure projects across the country.',
      dateVoted: new Date('2023-05-28')
    });
    
    const defenseBill = this.createBill({
      title: 'Defense Spending Increase',
      description: 'A bill to increase the defense budget by 10%.',
      dateVoted: new Date('2023-05-15')
    });
    
    const educationBill = this.createBill({
      title: 'Education Funding Act',
      description: 'A bill to increase funding for public education and teacher salaries.',
      dateVoted: new Date('2023-04-23')
    });
    
    // Sample voting records
    // Jane Smith's votes
    this.createVotingRecord({
      politicianId: janeSmith.id,
      billId: climateBill.id,
      vote: 'For'
    });
    
    this.createVotingRecord({
      politicianId: janeSmith.id,
      billId: infrastructureBill.id,
      vote: 'For'
    });
    
    this.createVotingRecord({
      politicianId: janeSmith.id,
      billId: defenseBill.id,
      vote: 'Against'
    });
    
    this.createVotingRecord({
      politicianId: janeSmith.id,
      billId: educationBill.id,
      vote: 'For'
    });
    
    // John Doe's votes
    this.createVotingRecord({
      politicianId: johnDoe.id,
      billId: climateBill.id,
      vote: 'Against'
    });
    
    this.createVotingRecord({
      politicianId: johnDoe.id,
      billId: infrastructureBill.id,
      vote: 'For'
    });
    
    this.createVotingRecord({
      politicianId: johnDoe.id,
      billId: defenseBill.id,
      vote: 'For'
    });
    
    this.createVotingRecord({
      politicianId: johnDoe.id,
      billId: educationBill.id,
      vote: 'For'
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Politician operations
  async getPolitician(id: number): Promise<Politician | undefined> {
    return this.politicians.get(id);
  }
  
  async getPoliticianByName(name: string): Promise<Politician | undefined> {
    return Array.from(this.politicians.values()).find(
      (politician) => politician.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  async getPoliticians(): Promise<Politician[]> {
    return Array.from(this.politicians.values());
  }
  
  async createPolitician(insertPolitician: InsertPolitician): Promise<Politician> {
    const id = this.politicianId++;
    const now = new Date();
    const politician: Politician = { 
      ...insertPolitician, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.politicians.set(id, politician);
    return politician;
  }
  
  async updatePolitician(id: number, updateData: Partial<InsertPolitician>): Promise<Politician | undefined> {
    const politician = this.politicians.get(id);
    if (!politician) return undefined;
    
    const updatedPolitician = { 
      ...politician, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.politicians.set(id, updatedPolitician);
    return updatedPolitician;
  }
  
  async deletePolitician(id: number): Promise<boolean> {
    if (!this.politicians.has(id)) return false;
    
    // Remove politician
    this.politicians.delete(id);
    
    // Cascade delete related data
    // Delete promises
    Array.from(this.promises.values())
      .filter((promise) => promise.politicianId === id)
      .forEach((promise) => this.promises.delete(promise.id));
    
    // Delete voting records
    Array.from(this.votingRecords.values())
      .filter((record) => record.politicianId === id)
      .forEach((record) => this.votingRecords.delete(record.id));
    
    // Delete ratings
    Array.from(this.ratings.values())
      .filter((rating) => rating.politicianId === id)
      .forEach((rating) => this.ratings.delete(rating.id));
    
    return true;
  }
  
  // Promise operations
  async getPromise(id: number): Promise<Promise | undefined> {
    return this.promises.get(id);
  }
  
  async getPromisesByPoliticianId(politicianId: number): Promise<Promise[]> {
    return Array.from(this.promises.values())
      .filter((promise) => promise.politicianId === politicianId);
  }
  
  async createPromise(insertPromise: InsertPromise): Promise<Promise> {
    const id = this.promiseId++;
    const now = new Date();
    const promise: Promise = { 
      ...insertPromise, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.promises.set(id, promise);
    return promise;
  }
  
  async updatePromise(id: number, updateData: Partial<InsertPromise>): Promise<Promise | undefined> {
    const promise = this.promises.get(id);
    if (!promise) return undefined;
    
    const updatedPromise = { 
      ...promise, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.promises.set(id, updatedPromise);
    return updatedPromise;
  }
  
  async deletePromise(id: number): Promise<boolean> {
    if (!this.promises.has(id)) return false;
    this.promises.delete(id);
    return true;
  }
  
  // Bill operations
  async getBill(id: number): Promise<Bill | undefined> {
    return this.bills.get(id);
  }
  
  async getBills(): Promise<Bill[]> {
    return Array.from(this.bills.values());
  }
  
  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = this.billId++;
    const now = new Date();
    const bill: Bill = { 
      ...insertBill, 
      id, 
      createdAt: now 
    };
    this.bills.set(id, bill);
    return bill;
  }
  
  // Voting record operations
  async getVotingRecord(id: number): Promise<VotingRecord | undefined> {
    return this.votingRecords.get(id);
  }
  
  async getVotingRecordsByPoliticianId(politicianId: number): Promise<VotingRecord[]> {
    return Array.from(this.votingRecords.values())
      .filter((record) => record.politicianId === politicianId);
  }
  
  async getVotingRecordsByBillId(billId: number): Promise<VotingRecord[]> {
    return Array.from(this.votingRecords.values())
      .filter((record) => record.billId === billId);
  }
  
  async createVotingRecord(insertVotingRecord: InsertVotingRecord): Promise<VotingRecord> {
    const id = this.votingRecordId++;
    const now = new Date();
    const votingRecord: VotingRecord = { 
      ...insertVotingRecord, 
      id, 
      createdAt: now 
    };
    this.votingRecords.set(id, votingRecord);
    return votingRecord;
  }
  
  // Rating operations
  async getRating(id: number): Promise<Rating | undefined> {
    return this.ratings.get(id);
  }
  
  async getRatingsByPoliticianId(politicianId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values())
      .filter((rating) => rating.politicianId === politicianId);
  }
  
  async getUserRatingForPolitician(userId: string, politicianId: number): Promise<Rating | undefined> {
    return Array.from(this.ratings.values())
      .find((rating) => rating.politicianId === politicianId && rating.userId === userId);
  }
  
  async getRatingsByStatus(status: CommentStatus): Promise<Rating[]> {
    return Array.from(this.ratings.values())
      .filter((rating) => rating.status === status);
  }
  
  async createRating(insertRating: InsertRating): Promise<Rating> {
    const id = this.ratingId++;
    const now = new Date();
    const rating: Rating = { 
      ...insertRating, 
      id, 
      status: 'Pending', 
      createdAt: now 
    };
    this.ratings.set(id, rating);
    return rating;
  }
  
  async updateRatingStatus(id: number, status: CommentStatus): Promise<Rating | undefined> {
    const rating = this.ratings.get(id);
    if (!rating) return undefined;
    
    const updatedRating = { 
      ...rating, 
      status 
    };
    this.ratings.set(id, updatedRating);
    return updatedRating;
  }
  
  async getPoliticianAverageRating(politicianId: number): Promise<{ average: number, count: number } | undefined> {
    const ratings = Array.from(this.ratings.values())
      .filter((rating) => rating.politicianId === politicianId && rating.status === 'Approved');
    
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return {
      average: parseFloat((total / ratings.length).toFixed(1)),
      count: ratings.length
    };
  }
  
  // Admin log operations
  async createAdminLog(insertAdminLog: InsertAdminLog): Promise<AdminLog> {
    const id = this.adminLogId++;
    const now = new Date();
    const adminLog: AdminLog = { 
      ...insertAdminLog, 
      id, 
      createdAt: now 
    };
    this.adminLogs.set(id, adminLog);
    return adminLog;
  }
  
  async getAdminLogs(): Promise<AdminLog[]> {
    return Array.from(this.adminLogs.values());
  }
}

// Import DatabaseStorage 
import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
