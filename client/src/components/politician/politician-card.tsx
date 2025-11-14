import { Card, CardContent } from "@/components/ui/card";
import AvatarWithFallback from "@/components/ui/avatar-with-fallback";
import RatingStars from "@/components/ui/rating-stars";
import PartyBadge from "@/components/ui/party-badge";
import { Link } from "wouter";
import { CheckCircle, User, BarChart2, TrendingUp } from "lucide-react";
import { PoliticianWithRating } from "@/lib/types";

interface PoliticianCardProps {
  politician: PoliticianWithRating;
  showActions?: boolean;
  fulfillmentRate?: number;
}

const PoliticianCard = ({ 
  politician, 
  showActions = true,
  fulfillmentRate
}: PoliticianCardProps) => {
  // Determine party color for border
  const partyColor = 
    politician.party === 'Democratic' ? 'border-democratic-500' :
    politician.party === 'Republican' ? 'border-republican-500' :
    'border-independent-500';

  return (
    <Card className="group overflow-hidden bg-gray-50  hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-[2px] hover:border-civic-200">
      <CardContent className="p-6">
        {/* Header with Avatar and Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`relative ring-2 ${partyColor} rounded-full`}>
            <AvatarWithFallback 
              src={politician.profileImageUrl} 
              alt={politician.name} 
              className="w-16 h-16 rounded-full"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Link href={`/politician/${politician.id}`}>
              <h3 className="font-semibold text-lg text-gray-900 hover:text-civic-600 transition-colors cursor-pointer truncate group-hover:text-civic-700">
                {politician.name}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <PartyBadge party={politician.party as any} size="sm" />
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{politician.parish}</span>
            </div>
          </div>
        </div>
        
        {/* Rating Section */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RatingStars rating={politician.rating} total={politician.ratingCount} size="sm" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{politician.rating.toFixed(1)}</div>
              <div className="text-xs text-gray-500">{politician.ratingCount} ratings</div>
            </div>
          </div>
        </div>
        
        {/* Promise Fulfillment (if available) */}
        {fulfillmentRate !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Promise Fulfillment</span>
              <span className="text-sm font-semibold text-civic-600">{fulfillmentRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  fulfillmentRate >= 70 ? 'bg-success-500' :
                  fulfillmentRate >= 40 ? 'bg-warning-500' :
                  'bg-danger-500'
                }`}
                style={{ width: `${fulfillmentRate}%` }}
              />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {fulfillmentRate >= 70 ? 'Strong record' : 
                 fulfillmentRate >= 40 ? 'Moderate record' : 
                 'Needs improvement'}
              </span>
            </div>
          </div>
        )}
        
        {/* Quick Stats */}
        {politician.numberOfVotes && (
          <div className="mb-4 flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{politician.numberOfVotes.toLocaleString()} votes</span>
            </div>
            {politician.firstElected && (
              <>
                <span className="text-gray-300">•</span>
                <span>Since {new Date(politician.firstElected).getFullYear()}</span>
              </>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col  gap-2 mt-4 pt-4 border-t border-gray-100">
            <Link href={`/politician/${politician.id}`} className="flex-1">
              <button className="w-full px-4 py-2.5 border-2 border-civic-600 text-white bg-civic-600 hover:bg-civic-700 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap">
                <User className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>View Profile</span>
              </button>
            </Link>
            <Link href={`/compare?ids=${politician.id}`} className="flex-1 sm:flex-none">
              <button className="w-full px-4 py-2.5 border-2 border-civic-600 text-civic-600 hover:bg-civic-50 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap">
                <BarChart2 className="h-4 w-4 flex-shrink-0" />
                <span>Compare</span>
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoliticianCard;
