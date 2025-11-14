import { pgTable, text, serial, integer, boolean, date, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Party enum for consistency
export const PartyEnum = z.enum(["Democratic", "Republican", "Independent"]);
export type Party = z.infer<typeof PartyEnum>;

// Promise status enum
export const PromiseStatusEnum = z.enum(["Fulfilled", "InProgress", "Unfulfilled"]);
export type PromiseStatus = z.infer<typeof PromiseStatusEnum>;

// Vote enum for tracking voting decisions
export const VoteEnum = z.enum(["For", "Against", "Abstained", "Absent"]);
export type Vote = z.infer<typeof VoteEnum>;

// Comment status for moderation purposes
export const CommentStatusEnum = z.enum(["Pending", "Approved", "Rejected"]);
export type CommentStatus = z.infer<typeof CommentStatusEnum>;

// Users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Politicians table
export const politicians = pgTable("politicians", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  party: text("party").notNull(),
  parish: text("parish").notNull(),
  numberOfVotes: integer("number_of_votes").default(0),
  status: text("status").default("Current"),
  bio: text("bio"),
  firstElected: date("first_elected"),
  profileImageUrl: text("profile_image_url"),
  manifestoPoint1: text("manifesto_point_1"),
  manifestoPoint2: text("manifesto_point_2"),
  manifestoPoint3: text("manifesto_point_3"),
  manifestoPoint4: text("manifesto_point_4"),
  manifestoPoint5: text("manifesto_point_5"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPoliticianSchema = createInsertSchema(politicians).pick({
  name: true,
  party: true,
  parish: true,
  numberOfVotes: true,
  status: true,
  bio: true,
  firstElected: true,
  profileImageUrl: true,
  manifestoPoint1: true,
  manifestoPoint2: true,
  manifestoPoint3: true,
  manifestoPoint4: true,
  manifestoPoint5: true,
});

// Promises made by politicians
export const promises = pgTable("promises", {
  id: serial("id").primaryKey(),
  politicianId: integer("politician_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("InProgress"),
  fulfillmentDate: date("fulfillment_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPromiseSchema = createInsertSchema(promises).pick({
  politicianId: true,
  title: true,
  description: true,
  status: true,
  fulfillmentDate: true,
});

// Bills that politicians vote on
export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dateVoted: date("date_voted").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBillSchema = createInsertSchema(bills).pick({
  title: true,
  description: true,
  dateVoted: true,
});

// Voting records linking politicians to bills
export const votingRecords = pgTable("voting_records", {
  id: serial("id").primaryKey(),
  politicianId: integer("politician_id").notNull(),
  billId: integer("bill_id").notNull(),
  vote: text("vote").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVotingRecordSchema = createInsertSchema(votingRecords).pick({
  politicianId: true,
  billId: true,
  vote: true,
});

// Ratings given by users to politicians
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  politicianId: integer("politician_id").notNull(),
  userId: text("user_id").notNull(), // Using a string for anonymous users
  rating: real("rating").notNull(),
  comment: text("comment"),
  status: text("status").notNull().default("Pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRatingSchema = createInsertSchema(ratings).pick({
  politicianId: true,
  userId: true,
  rating: true,
  comment: true,
});

// Admin log for tracking changes
export const adminLog = pgTable("admin_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdminLogSchema = createInsertSchema(adminLog).pick({
  userId: true,
  action: true,
  details: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPolitician = z.infer<typeof insertPoliticianSchema>;
export type Politician = typeof politicians.$inferSelect;

export type InsertPromise = z.infer<typeof insertPromiseSchema>;
export type Promise = typeof promises.$inferSelect;

export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;

export type InsertVotingRecord = z.infer<typeof insertVotingRecordSchema>;
export type VotingRecord = typeof votingRecords.$inferSelect;

export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;
export type AdminLog = typeof adminLog.$inferSelect;
