import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RatingWithPolitician } from "@/lib/types";
import { formatDate } from "@/lib/utils/formatting";
import RatingStars from "@/components/ui/rating-stars";
import AvatarWithFallback from "@/components/ui/avatar-with-fallback";

const AdminComments = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const { toast } = useToast();

  // Fetch pending ratings
  const { data: pendingRatings, isLoading, error } = useQuery<RatingWithPolitician[]>({
    queryKey: ['/api/admin/ratings/pending'],
  });

  // Approve/reject comment mutation
  const moderateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest('PUT', `/api/admin/ratings/${id}`, { status }),
    onSuccess: (_, variables) => {
      toast({
        title: `Comment ${variables.status === 'Approved' ? 'approved' : 'rejected'}`,
        description: `The comment has been ${variables.status === 'Approved' ? 'approved' : 'rejected'} successfully.`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ratings/pending'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to moderate the comment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleApprove = (id: number) => {
    moderateMutation.mutate({ id, status: 'Approved' });
  };

  const handleReject = (id: number) => {
    moderateMutation.mutate({ id, status: 'Rejected' });
  };

  // Sort ratings based on selected order
  const sortedRatings = pendingRatings 
    ? [...pendingRatings].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      })
    : [];

  return (
    <AdminLayout title="Comment Moderation">
      <div className="space-y-6">
        <Card className="overflow-hidden shadow">
          <div className="px-4 py-3 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 sm:inline-flex h-9">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
                  All ({pendingRatings?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3">
                  Pending ({pendingRatings?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="approved" className="text-xs sm:text-sm px-2 sm:px-3" disabled>
                  Approved (0)
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Sort by Date (Newest)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by Date (Newest)</SelectItem>
                <SelectItem value="oldest">Sort by Date (Oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading comments...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-amber-500" />
              <p className="text-gray-700 font-medium">Error loading comments</p>
              <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
            </div>
          ) : sortedRatings.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No comments yet</h3>
              <p className="mt-1 text-gray-500">No comments have been submitted by users.</p>
            </div>
          ) : (
            <div className="divide-y">
              {sortedRatings.map((rating) => (
                <div key={rating.id} className="p-6">
                  <div className="flex items-start">
                    <div className="hidden sm:block flex-shrink-0 mr-4">
                      <AvatarWithFallback 
                        src={rating.politician?.profileImageUrl} 
                        alt={rating.politician?.name || 'Unknown Politician'} 
                        className="h-12 w-12" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 mb-2 sm:mb-0">
                            Pending
                          </Badge>
                          <span className="ml-2 text-sm text-gray-500">
                            Submitted {formatDate(rating.createdAt)}
                          </span>
                        </div>
                        <RatingStars rating={rating.rating} size="sm" />
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">
                        Rating for: {rating.politician?.name || 'Unknown Politician'}
                      </h3>
                      
                      <p className="text-gray-700 mb-4">
                        {rating.comment || <span className="text-gray-400 italic">No comment provided</span>}
                      </p>
                      
                      <div className="flex items-center justify-end space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleReject(rating.id)}
                          disabled={moderateMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleApprove(rating.id)}
                          disabled={moderateMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
