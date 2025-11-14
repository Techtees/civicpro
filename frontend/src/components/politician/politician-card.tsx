import { Card, CardContent } from "@/components/ui/card";
import AvatarWithFallback from "@/components/ui/avatar-with-fallback";
import RatingStars from "@/components/ui/rating-stars";
import PartyBadge from "@/components/ui/party-badge";
import { Link } from "wouter";
import { CheckCircle, User, BarChart2 } from "lucide-react";
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
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <AvatarWithFallback 
            src={politician.profileImageUrl} 
            alt={politician.name} 
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold">{politician.name}</h3>
            <div className="flex items-center text-sm">
              <PartyBadge party={politician.party as any} size="sm" />
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-gray-600">{politician.district}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <RatingStars rating={politician.rating} total={politician.ratingCount} size="sm" />
          </div>
          
          {fulfillmentRate !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 h-4 w-4 mr-1" />
              <span>{fulfillmentRate}% promise fulfillment rate</span>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="border-t pt-3 mt-3 flex justify-between">
            <Link href={`/politician/${politician.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              <User className="h-4 w-4 inline mr-1" /> View Profile
            </Link>
            <Link href={`/compare?ids=${politician.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              <BarChart2 className="h-4 w-4 inline mr-1" /> Compare
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoliticianCard;
