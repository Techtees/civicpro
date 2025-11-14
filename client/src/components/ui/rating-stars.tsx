import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface RatingStarsProps {
  rating: number;
  total?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars = ({ 
  rating, 
  total, 
  size = "md", 
  readOnly = true,
  onRatingChange
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // Calculate full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Size classes
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const starClass = sizeClasses[size];
  
  // Handle hovering and clicking for interactive rating
  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(null);
    }
  };
  
  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };
  
  // Render the stars
  return (
    <div className="flex items-center">
      <div className="flex items-center text-yellow-400">
        {[1, 2, 3, 4, 5].map((index) => {
          const isActive = hoverRating !== null ? index <= hoverRating : index <= fullStars;
          const isHalfActive = hoverRating === null && index === fullStars + 1 && hasHalfStar;
          
          return (
            <div 
              key={index}
              className={`${!readOnly ? 'cursor-pointer' : ''}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
            >
              {isActive ? (
                <Star className={`fill-current ${starClass}`} />
              ) : isHalfActive ? (
                <StarHalf className={`fill-current ${starClass}`} />
              ) : (
                <Star className={`text-gray-300 ${starClass}`} />
              )}
            </div>
          );
        })}
      </div>
      
      <span className="ml-2 text-sm font-medium">{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
      
      {total && total > 0 && (
        <span className="text-sm text-gray-500 ml-1">({total})</span>
      )}
    </div>
  );
};

export default RatingStars;
