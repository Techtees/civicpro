import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// Enums for consistency
export const PartyEnum = z.enum(["Democratic", "Republican", "Independent"]);
export type Party = z.infer<typeof PartyEnum>;

export const PromiseStatusEnum = z.enum(["Fulfilled", "InProgress", "Unfulfilled"]);
export type PromiseStatus = z.infer<typeof PromiseStatusEnum>;

export const VoteEnum = z.enum(["For", "Against", "Abstained", "Absent"]);
export type Vote = z.infer<typeof VoteEnum>;

export const CommentStatusEnum = z.enum(["Pending", "Approved", "Rejected"]);
export type CommentStatus = z.infer<typeof CommentStatusEnum>;

// User Interface
export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model<IUser>("User", userSchema);

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  isAdmin: z.boolean().optional().default(false)
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = IUser;

// Politician Interface
export interface IPolitician extends Document {
  name: string;
  party: string;
  parish: string;
  numberOfVotes?: number;
  status?: string;
  bio?: string;
  firstElected?: Date;
  profileImageUrl?: string;
  manifestoPoint1?: string;
  manifestoPoint2?: string;
  manifestoPoint3?: string;
  manifestoPoint4?: string;
  manifestoPoint5?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Politician Schema
const politicianSchema = new Schema<IPolitician>({
  name: { type: String, required: true },
  party: { type: String, required: true },
  parish: { type: String, required: true },
  numberOfVotes: { type: Number, default: 0 },
  status: { type: String, default: "Current" },
  bio: { type: String },
  firstElected: { type: Date },
  profileImageUrl: { type: String },
  manifestoPoint1: { type: String },
  manifestoPoint2: { type: String },
  manifestoPoint3: { type: String },
  manifestoPoint4: { type: String },
  manifestoPoint5: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
politicianSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const PoliticianModel = mongoose.model<IPolitician>("Politician", politicianSchema);

export const insertPoliticianSchema = z.object({
  name: z.string(),
  party: z.string(),
  parish: z.string(),
  numberOfVotes: z.number().optional(),
  status: z.string().optional(),
  bio: z.string().optional(),
  firstElected: z.union([z.string(), z.date()]).optional(),
  profileImageUrl: z.string().optional(),
  manifestoPoint1: z.string().optional(),
  manifestoPoint2: z.string().optional(),
  manifestoPoint3: z.string().optional(),
  manifestoPoint4: z.string().optional(),
  manifestoPoint5: z.string().optional()
});

export type InsertPolitician = z.infer<typeof insertPoliticianSchema>;
export type Politician = IPolitician;

// Promise Interface
export interface IPromise extends Document {
  politicianId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: string;
  fulfillmentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Promise Schema
const promiseSchema = new Schema<IPromise>({
  politicianId: { type: Schema.Types.ObjectId, ref: "Politician", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "InProgress" },
  fulfillmentDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

promiseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const PromiseModel = mongoose.model<IPromise>("Promise", promiseSchema);

export const insertPromiseSchema = z.object({
  politicianId: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string().optional(),
  fulfillmentDate: z.union([z.string(), z.date()]).optional()
});

export type InsertPromise = z.infer<typeof insertPromiseSchema>;
export type PromiseType = IPromise;

// Bill Interface
export interface IBill extends Document {
  title: string;
  description: string;
  dateVoted: Date;
  createdAt: Date;
}

// Bill Schema
const billSchema = new Schema<IBill>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateVoted: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const BillModel = mongoose.model<IBill>("Bill", billSchema);

export const insertBillSchema = z.object({
  title: z.string(),
  description: z.string(),
  dateVoted: z.union([z.string(), z.date()])
});

export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = IBill;

// Voting Record Interface
export interface IVotingRecord extends Document {
  politicianId: mongoose.Types.ObjectId;
  billId: mongoose.Types.ObjectId;
  vote: string;
  createdAt: Date;
}

// Voting Record Schema
const votingRecordSchema = new Schema<IVotingRecord>({
  politicianId: { type: Schema.Types.ObjectId, ref: "Politician", required: true },
  billId: { type: Schema.Types.ObjectId, ref: "Bill", required: true },
  vote: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const VotingRecordModel = mongoose.model<IVotingRecord>("VotingRecord", votingRecordSchema);

export const insertVotingRecordSchema = z.object({
  politicianId: z.string(),
  billId: z.string(),
  vote: z.string()
});

export type InsertVotingRecord = z.infer<typeof insertVotingRecordSchema>;
export type VotingRecord = IVotingRecord;

// Rating Interface
export interface IRating extends Document {
  politicianId: mongoose.Types.ObjectId;
  userId: string;
  rating: number;
  comment?: string;
  status: string;
  createdAt: Date;
}

// Rating Schema
const ratingSchema = new Schema<IRating>({
  politicianId: { type: Schema.Types.ObjectId, ref: "Politician", required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export const RatingModel = mongoose.model<IRating>("Rating", ratingSchema);

export const insertRatingSchema = z.object({
  politicianId: z.string(),
  userId: z.string(),
  rating: z.number().min(0).max(5),
  comment: z.string().optional()
});

export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = IRating;

// Admin Log Interface
export interface IAdminLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  details?: any;
  createdAt: Date;
}

// Admin Log Schema
const adminLogSchema = new Schema<IAdminLog>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export const AdminLogModel = mongoose.model<IAdminLog>("AdminLog", adminLogSchema);

export const insertAdminLogSchema = z.object({
  userId: z.string(),
  action: z.string(),
  details: z.any().optional()
});

export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;
export type AdminLog = IAdminLog;
