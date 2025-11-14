import { type Party } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface PartyBadgeProps {
  party: Party;
  size?: "sm" | "md" | "lg";
}

const PartyBadge = ({ party, size = "md" }: PartyBadgeProps) => {
  const badgeClasses = {
    Democratic: "bg-primary-100 text-primary-800 hover:bg-primary-100",
    Republican: "bg-red-100 text-red-800 hover:bg-red-100",
    Independent: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    "Forward Guernsey": "bg-primary-100 text-primary-800 hover:bg-primary-100"
  } as const;
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base"
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${badgeClasses[party]} ${sizeClasses[size]} font-medium border-0`}
    >
      {party}
    </Badge>
  );
};

export default PartyBadge;
