import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AvatarWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

const AvatarWithFallback = ({ 
  src, 
  alt, 
  className = "h-10 w-10", 
  fallbackClassName = "bg-primary-100 text-primary-800" 
}: AvatarWithFallbackProps) => {
  // Create initials from the name
  const initials = alt
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Avatar className={className}>
      {src ? (
        <AvatarImage src={src} alt={alt} />
      ) : null}
      <AvatarFallback className={fallbackClassName}>
        {initials || <User className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarWithFallback;
