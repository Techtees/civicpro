import { 
  Politician, 
  Promise, 
  Bill, 
  VotingRecord, 
  Rating, 
  Party, 
  PromiseStatus 
} from "@shared/schema";

// Extended type with rating statistics
export interface PoliticianWithRating extends Politician {
  rating: number;
  ratingCount: number;
}

// Voting record with bill details
export interface VotingRecordWithBill extends VotingRecord {
  bill?: Bill;
}

// Detailed politician profile
export interface PoliticianProfile {
  politician: Politician;
  promises: Promise[];
  votingRecords: VotingRecordWithBill[];
  ratingStats: {
    average: number;
    count: number;
  };
  ratings: Rating[];
  fulfillmentStats: {
    fulfilled: number;
    inProgress: number;
    unfulfilled: number;
    total: number;
  };
  fulfillmentRate: number;
}

// Politician comparison data
export interface PoliticianComparisonData {
  politician: Politician;
  promises: Promise[];
  votingRecords: VotingRecord[];
  ratingStats: {
    average: number;
    count: number;
  };
  fulfillmentRate: number;
  fulfillmentStats: {
    fulfilled: number;
    inProgress: number;
    unfulfilled: number;
    total: number;
  };
}

export interface ComparisonResult {
  politicians: Politician[];
  comparisonData: (PoliticianComparisonData | null)[];
  commonBills: {
    billId: number;
    bill?: Bill;
    votes: {
      politicianId?: number;
      vote: string;
    }[];
  }[];
}

// Form type for rating submission
export interface RatingFormData {
  politicianId: number;
  rating: number;
  comment?: string;
}

// Filter options for politician directory
export interface PoliticianFilterOptions {
  parties: Party[];
  minRating: number | null;
  minPromiseFulfillment: number | null;
  parish: string | null;
  searchQuery: string;
}

// Admin stats
export interface AdminStats {
  totalPoliticians: number;
  totalRatings: number;
  pendingRatings: number;
  partyDistribution: Record<string, number>;
  recentActivity: any[]; // would be typed properly in a full implementation
}

// Rating with politician information for moderation
export interface RatingWithPolitician extends Rating {
  politician?: Politician;
}

// Form type for adding/editing a politician
export interface PoliticianFormData {
  name: string;
  party: Party;
  district: string;
  bio?: string;
  firstElected?: Date | string;
  profileImageUrl?: string;
}

// Form type for adding/editing a promise
export interface PromiseFormData {
  politicianId: number;
  title: string;
  description: string;
  status: PromiseStatus;
  fulfillmentDate?: Date | string;
}

// Form type for adding/editing a bill
export interface BillFormData {
  title: string;
  description: string;
  dateVoted: Date | string;
}

// Form type for adding a voting record
export interface VotingRecordFormData {
  politicianId: number;
  billId: number;
  vote: string;
}

// User session
export interface UserSession {
  id: number;
  username: string;
  isAdmin: boolean;
}
