import mongoose from "mongoose";
import { IStorage } from "./storage";
import {
  UserModel,
  PoliticianModel,
  PromiseModel,
  BillModel,
  VotingRecordModel,
  RatingModel,
  AdminLogModel,
  CommentStatus
} from "../shared/mongodb-schema";
import type { User, InsertUser } from "../shared/mongodb-schema";
import type { Politician, InsertPolitician } from "../shared/mongodb-schema";
import type { PromiseType, InsertPromise } from "../shared/mongodb-schema";
import type { Bill, InsertBill } from "../shared/mongodb-schema";
import type { VotingRecord, InsertVotingRecord } from "../shared/mongodb-schema";
import type { Rating, InsertRating } from "../shared/mongodb-schema";
import type { AdminLog, InsertAdminLog } from "../shared/mongodb-schema";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel(insertUser);
    await user.save();
    return user;
  }
  
  async getPolitician(id: number | string): Promise<Politician | undefined> {
    const politician = await PoliticianModel.findById(id).lean().exec();
    return politician as any || undefined;
  }

  async getPoliticianByName(name: string): Promise<Politician | undefined> {
    const politician = await PoliticianModel.findOne({ name }).lean().exec();
    return politician as any || undefined;
  }

  async getPoliticians(): Promise<Politician[]> {
    return await PoliticianModel.find().lean().exec() as any;
  }

  async createPolitician(insertPolitician: InsertPolitician): Promise<Politician> {
    const politician = new PoliticianModel(insertPolitician);
    await politician.save();
    return politician;
  }

  async updatePolitician(id: number | string, updateData: Partial<InsertPolitician>): Promise<Politician | undefined> {
    const politician = await PoliticianModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    return politician || undefined;
  }

  async deletePolitician(id: number | string): Promise<boolean> {
    const result = await PoliticianModel.findByIdAndDelete(id);
    
    if (result) {
      await PromiseModel.deleteMany({ politicianId: id });
      await VotingRecordModel.deleteMany({ politicianId: id });
      await RatingModel.deleteMany({ politicianId: id });
    }
    
    return !!result;
  }
  
  async getPromise(id: number | string): Promise<PromiseType | undefined> {
    const promise = await PromiseModel.findById(id).lean();
    return promise as any || undefined;
  }

  async getPromisesByPoliticianId(politicianId: number | string): Promise<PromiseType[]> {
    return await PromiseModel.find({ politicianId }).lean() as any;
  }

  async createPromise(insertPromise: InsertPromise): Promise<PromiseType> {
    const promise = new PromiseModel(insertPromise);
    await promise.save();
    return promise.toObject() as any;
  }

  async updatePromise(id: number | string, updateData: Partial<InsertPromise>): Promise<PromiseType | undefined> {
    const promise = await PromiseModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, lean: true }
    );
    return promise as any || undefined;
  }

  async deletePromise(id: number | string): Promise<boolean> {
    const result = await PromiseModel.findByIdAndDelete(id);
    return !!result;
  }
  
  async getBill(id: number | string): Promise<Bill | undefined> {
    const bill = await BillModel.findById(id).lean();
    return bill as any || undefined;
  }

  async getBills(): Promise<Bill[]> {
    return await BillModel.find().lean() as any;
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const bill = new BillModel(insertBill);
    await bill.save();
    return bill.toObject() as any;
  }
  
  async getVotingRecord(id: number | string): Promise<VotingRecord | undefined> {
    const record = await VotingRecordModel.findById(id).lean();
    return record as any || undefined;
  }

  async getVotingRecordsByPoliticianId(politicianId: number | string): Promise<VotingRecord[]> {
    return await VotingRecordModel.find({ politicianId }).lean() as any;
  }

  async getVotingRecordsByBillId(billId: number | string): Promise<VotingRecord[]> {
    return await VotingRecordModel.find({ billId }).lean() as any;
  }

  async createVotingRecord(insertVotingRecord: InsertVotingRecord): Promise<VotingRecord> {
    const record = new VotingRecordModel(insertVotingRecord);
    await record.save();
    return record;
  }
  
  async getRating(id: number | string): Promise<Rating | undefined> {
    const rating = await RatingModel.findById(id).lean();
    return rating as any || undefined;
  }

  async getRatingsByPoliticianId(politicianId: number | string): Promise<Rating[]> {
    return await RatingModel.find({ politicianId }).lean() as any;
  }

  async getUserRatingForPolitician(userId: string, politicianId: number | string): Promise<Rating | undefined> {
    const rating = await RatingModel.findOne({ userId, politicianId }).lean();
    return rating as any || undefined;
  }

  async getRatingsByStatus(status: CommentStatus): Promise<Rating[]> {
    return await RatingModel.find({ status }).lean() as any;
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const rating = new RatingModel({
      ...insertRating,
      status: 'Pending'
    });
    await rating.save();
    return rating.toObject() as any;
  }

  async updateRatingStatus(id: number | string, status: CommentStatus): Promise<Rating | undefined> {
    const rating = await RatingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, lean: true }
    );
    return rating as any || undefined;
  }

  async getPoliticianAverageRating(politicianId: number | string): Promise<{ average: number, count: number } | undefined> {
    const result = await RatingModel.aggregate([
      {
        $match: {
          politicianId: typeof politicianId === 'string' ? new mongoose.Types.ObjectId(politicianId) : new mongoose.Types.ObjectId(politicianId.toString()),
          status: 'Approved'
        }
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length === 0) {
      return { average: 0, count: 0 };
    }
    
    return {
      average: Math.round(result[0].average * 10) / 10,
      count: result[0].count
    };
  }
  
  async createAdminLog(insertAdminLog: InsertAdminLog): Promise<AdminLog> {
    const log = new AdminLogModel(insertAdminLog);
    await log.save();
    return log;
  }

  async getAdminLogs(): Promise<AdminLog[]> {
    return await AdminLogModel.find().sort({ createdAt: -1 });
  }
}
