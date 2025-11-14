import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, BarChart2, Share2, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/layout/MainLayout";
import RatingStars from "@/components/ui/rating-stars";
import PartyBadge from "@/components/ui/party-badge";
import AvatarWithFallback from "@/components/ui/avatar-with-fallback";
import RatePoliticianDialog from "@/components/politician/rate-politician-dialog";
import PromiseTracker from "@/components/politician/promise-tracker";
import VotingRecordTable from "@/components/politician/voting-record-table";
import { PoliticianProfile as PoliticianProfileType, VotingRecordWithBill } from "@/lib/types";
import { formatDate, getVoteColor } from "@/lib/utils/formatting";

const PoliticianProfilePage = () => {
  const [, params] = useRoute<{ id: string }>("/politician/:id");
  const politicianId = params?.id || "";
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch politician profile data
  const { data: profileData, isLoading, error } = useQuery<PoliticianProfileType>({
    queryKey: [`/api/politicians/${politicianId}`],
    enabled: !!politicianId,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !profileData) {
    return (
      <MainLayout>
        <div className="p-8 text-center bg-red-50 rounded-lg border border-red-100">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-4">
            We couldn't load this politician's profile. Please try again later.
          </p>
          <Link href="/directory">
            <Button>Return to Directory</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const { politician, promises, votingRecords, ratingStats, ratings, fulfillmentRate } = profileData;

  // Filter voting records based on status for recent votes
  const recentVotes = votingRecords
    .sort((a, b) => {
      const dateA = a.bill?.dateVoted ? new Date(a.bill.dateVoted).getTime() : 0;
      const dateB = b.bill?.dateVoted ? new Date(b.bill.dateVoted).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <MainLayout>
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:mr-8 mb-4 lg:mb-0">
            <AvatarWithFallback
              src={politician.profileImageUrl}
              alt={politician.name}
              className="rounded-lg shadow-md h-48 w-48 object-cover"
              fallbackClassName="bg-primary-100 text-primary-600 text-4xl"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center mb-2">
              <h1 className="text-3xl font-bold mr-3">{politician.name}</h1>
              <PartyBadge party={politician.party as any} size="lg" />
            </div>
            <div className="text-gray-600 mb-4">{politician.parish}</div>

            <div className="flex items-center mb-4">
              <RatingStars rating={ratingStats.average} total={ratingStats.count} size="md" />
              <button
                className="ml-4 text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center"
                onClick={() => setIsRatingDialogOpen(true)}
              >
                <Star className="mr-1 h-4 w-4" /> Rate this politician
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
                <span>{fulfillmentRate}% promise fulfillment rate</span>
              </div>
              {politician.firstElected && (
                <div className="flex items-center">
                  <Calendar className="text-gray-500 mr-2 h-4 w-4" />
                  <span>First elected in {new Date(politician.firstElected).getFullYear()}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/compare?ids=${politicianId}`}>
                <Button className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Compare
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard");
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 border-b w-full justify-start rounded-none">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manifesto">Manifesto</TabsTrigger>
          <TabsTrigger value="voting-record">Voting Record</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About {politician.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{politician.bio || "No biography available."}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Key Promises</CardTitle>
                  <Button
                    variant="ghost"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    onClick={() => setActiveTab("manifesto")}
                  >
                    View all promises
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {promises.slice(0, 3).map((promise) => (
                      <div key={promise.id} className="border rounded-md p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                promise.status === "Fulfilled"
                                  ? "bg-green-50 text-green-600"
                                  : promise.status === "InProgress"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {promise.status === "Fulfilled" ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : promise.status === "InProgress" ? (
                                <Calendar className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">✕</span>
                              )}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">{promise.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{promise.description}</p>
                            <div className="flex items-center mt-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  promise.status === "Fulfilled"
                                    ? "bg-green-50 text-green-600"
                                    : promise.status === "InProgress"
                                    ? "bg-yellow-50 text-yellow-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {promise.status === "InProgress" ? "In Progress" : promise.status}
                              </Badge>
                              {promise.fulfillmentDate && (
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatDate(promise.fulfillmentDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <PromiseTracker promises={promises} className="mb-6" />

              <Card>
                <CardHeader>
                  <CardTitle>Recent Votes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentVotes.map((record) => (
                      <div key={record.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{record.bill?.title}</div>
                          <div className="text-sm text-gray-500">
                            {record.bill?.dateVoted ? formatDate(record.bill.dateVoted) : "N/A"}
                          </div>
                        </div>
                        <Badge variant="outline" className={getVoteColor(record.vote)}>
                          Voted {record.vote}
                        </Badge>
                      </div>
                    ))}

                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="ghost"
                        className="text-primary-600 hover:text-primary-700 text-sm p-0 font-medium"
                        onClick={() => setActiveTab("voting-record")}
                      >
                        View full voting record
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Manifesto Tab */}
        <TabsContent value="manifesto">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Promises & Manifesto</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Show manifesto points if politician has them */}
              {(politician.manifestoPoint1 || politician.manifestoPoint2 || politician.manifestoPoint3 || 
                politician.manifestoPoint4 || politician.manifestoPoint5) && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Key Manifesto Points</h3>
                  <div className="space-y-3 pl-4 border-l-2 border-primary-200">
                    {politician.manifestoPoint1 && (
                      <div className="relative">
                        <div className="absolute -left-6 top-1 w-2 h-2 bg-primary-500 rounded-full"></div>
                        <p className="text-gray-700">{politician.manifestoPoint1}</p>
                      </div>
                    )}
                    {politician.manifestoPoint2 && (
                      <div className="relative">
                        <div className="absolute -left-6 top-1 w-2 h-2 bg-primary-500 rounded-full"></div>
                        <p className="text-gray-700">{politician.manifestoPoint2}</p>
                      </div>
                    )}
                    {politician.manifestoPoint3 && (
                      <div className="relative">
                        <div className="absolute -left-6 top-1 w-2 h-2 bg-primary-500 rounded-full"></div>
                        <p className="text-gray-700">{politician.manifestoPoint3}</p>
                      </div>
                    )}
                    {politician.manifestoPoint4 && (
                      <div className="relative">
                        <div className="absolute -left-6 top-1 w-2 h-2 bg-primary-500 rounded-full"></div>
                        <p className="text-gray-700">{politician.manifestoPoint4}</p>
                      </div>
                    )}
                    {politician.manifestoPoint5 && (
                      <div className="relative">
                        <div className="absolute -left-6 top-1 w-2 h-2 bg-primary-500 rounded-full"></div>
                        <p className="text-gray-700">{politician.manifestoPoint5}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-medium mb-4">Campaign Promises</h3>
              {promises.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No promises have been recorded for this politician.
                </div>
              ) : (
                <div className="space-y-6">
                  {promises.map((promise) => (
                    <div key={promise.id} className="border rounded-md p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                              promise.status === "Fulfilled"
                                ? "bg-green-50 text-green-600"
                                : promise.status === "InProgress"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {promise.status === "Fulfilled" ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : promise.status === "InProgress" ? (
                              <Calendar className="h-5 w-5" />
                            ) : (
                              <span className="text-base">✕</span>
                            )}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">{promise.title}</h3>
                          <p className="text-gray-600 mt-2">{promise.description}</p>
                          <div className="flex items-center mt-4">
                            <Badge
                              variant="outline"
                              className={`${
                                promise.status === "Fulfilled"
                                  ? "bg-green-50 text-green-600"
                                  : promise.status === "InProgress"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {promise.status === "InProgress" ? "In Progress" : promise.status}
                            </Badge>
                            {promise.fulfillmentDate && (
                              <span className="text-sm text-gray-500 ml-3">
                                {formatDate(promise.fulfillmentDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voting Record Tab */}
        <TabsContent value="voting-record">
          <VotingRecordTable votingRecords={votingRecords} showStats={true} />
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings">
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
              <Button onClick={() => setIsRatingDialogOpen(true)}>Leave a Rating</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1">
                <div className="flex items-end">
                  <div className="text-5xl font-bold">{ratingStats.count > 0 ? ratingStats.average.toFixed(1) : "0.0"}</div>
                  <div className="ml-2 text-gray-500 mb-1">out of 5</div>
                </div>
                <div className="flex items-center text-yellow-400 mt-1">
                  <RatingStars rating={ratingStats.average} size="lg" />
                </div>
                <div className="text-gray-500 mt-1">Based on {ratingStats.count} ratings</div>

                {/* Rating distribution */}
                <div className="mt-4 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    // Calculate actual percentages based on ratings
                    const starCount = ratings.filter(r => r.rating === star).length;
                    const percentage = ratingStats.count > 0 
                      ? Math.round((starCount / ratingStats.count) * 100) 
                      : 0;
                    
                    return (
                      <div key={star} className="flex items-center">
                        <div className="w-12 text-sm text-right mr-2">{star} star</div>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="bg-yellow-400 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-8 text-sm text-right ml-2">
                          {percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">User Reviews</h3>
                </div>

                {ratings.length === 0 ? (
                  <div className="text-center p-8 border rounded-md">
                    <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsRatingDialogOpen(true)}
                    >
                      Rate {politician.name}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="border-b pb-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                              {rating.userId
                                .split("-")[0]
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  Anonymous User {rating.id.toString().padStart(3, "0")}
                                </div>
                                <div className="flex items-center mt-1">
                                  <RatingStars rating={rating.rating} size="sm" />
                                  <span className="text-xs text-gray-500 ml-2">
                                    {formatDate(rating.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {rating.comment && (
                              <div className="text-gray-700 mt-2">{rating.comment}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {ratings.length > 3 && (
                      <div className="mt-6 text-center">
                        <Button variant="outline" size="sm">
                          Load more reviews
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      <RatePoliticianDialog
        politician={politician}
        isOpen={isRatingDialogOpen}
        onClose={() => setIsRatingDialogOpen(false)}
      />
    </MainLayout>
  );
};

export default PoliticianProfilePage;