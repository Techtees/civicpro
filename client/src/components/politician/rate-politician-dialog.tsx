import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import RatingStars from "@/components/ui/rating-stars";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Politician } from "@shared/schema";
import { RatingFormData } from "@/lib/types";

interface RatePoliticianDialogProps {
  politician: Politician;
  isOpen: boolean;
  onClose: () => void;
}

const RatePoliticianDialog = ({ politician, isOpen, onClose }: RatePoliticianDialogProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const { toast } = useToast();
  
  const ratePoliticianMutation = useMutation({
    mutationFn: (data: RatingFormData) => 
      apiRequest('POST', '/api/ratings', data),
    onSuccess: () => {
      toast({
        title: "Rating submitted",
        description: "Your rating has been submitted and will be visible after moderation.",
      });
      onClose();
      // Reset form
      setRating(0);
      setComment("");
    },
    onError: (error) => {
      toast({
        title: "Rating failed",
        description: "There was a problem submitting your rating. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    ratePoliticianMutation.mutate({
      politicianId: politician.id,
      rating,
      comment: comment.trim() || undefined
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {politician.name}</DialogTitle>
          <DialogDescription>
            Share your opinion about this politician's performance. Focus on policies and actions, not personal attributes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
            <RatingStars 
              rating={rating} 
              readOnly={false} 
              size="lg" 
              onRatingChange={setRating} 
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment (Optional)</label>
            <Textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts on this politician's performance..."
              maxLength={250}
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 250 characters. Be respectful and focus on performance and policy.
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={ratePoliticianMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || ratePoliticianMutation.isPending}
          >
            {ratePoliticianMutation.isPending ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatePoliticianDialog;
