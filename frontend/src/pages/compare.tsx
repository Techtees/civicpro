import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AvatarWithFallback from "@/components/ui/avatar-with-fallback";
import PartyBadge from "@/components/ui/party-badge";
import RatingStars from "@/components/ui/rating-stars";
import { PlusCircle, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { ComparisonResult, PoliticianWithRating } from "@/lib/types";
import { formatDate, getVoteColor } from "@/lib/utils/formatting";

const Compare = () => {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initialIds = params.get("ids")?.split(",").map(Number).filter(Boolean) || [];
  
  const [selectedIds, setSelectedIds] = useState<number[]>(initialIds);
  const [availablePoliticians, setAvailablePoliticians] = useState<PoliticianWithRating[]>([]);
  
  // Fetch all politicians for the selection dropdown
  const { data: allPoliticians, isLoading: loadingPoliticians } = useQuery<PoliticianWithRating[]>({
    queryKey: ['/api/politicians'],
  });
  
  // Fetch comparison data for selected politicians
  const { data: comparisonData, isLoading: loadingComparison, error } = useQuery<ComparisonResult>({
    queryKey: [`/api/comparison?ids=${selectedIds.join(',')}`],
    enabled: selectedIds.length >= 2,
  });
  
  // Update available politicians based on what's already selected
  useEffect(() => {
    if (allPoliticians) {
      setAvailablePoliticians(
        allPoliticians.filter(politician => !selectedIds.includes(politician.id))
      );
    }
  }, [allPoliticians, selectedIds]);
  
  // Update URL when selected politicians change
  useEffect(() => {
    if (selectedIds.length > 0) {
      setLocation(`/compare?ids=${selectedIds.join(',')}`, { replace: true });
    }
  }, [selectedIds, setLocation]);
  
  const handleAddPolitician = (id: number) => {
    if (id && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const handleRemovePolitician = (id: number) => {
    setSelectedIds(selectedIds.filter(politicianId => politicianId !== id));
  };
  
  const isLoading = loadingPoliticians || (loadingComparison && selectedIds.length >= 2);
  
  return (
    <MainLayout title="Politician Comparison Tool">
      <div className="mb-6">
        <p className="text-gray-600">Compare voting records, promise fulfillment, and constituent ratings side by side.</p>
      </div>
      
      {/* Politician Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {selectedIds.map((id, index) => {
          const politician = allPoliticians?.find(p => p.id === id);
          
          return (
            <Card key={id} className="relative overflow-hidden">
              <button 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                onClick={() => handleRemovePolitician(id)}
              >
                <XCircle className="h-5 w-5" />
              </button>
              
              <CardContent className="p-4">
                {politician ? (
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
                ) : (
                  <div className="h-[68px] flex items-center justify-center">
                    <div className="animate-pulse w-full">
                      <div className="flex items-center">
                        <div className="rounded-full bg-slate-200 h-12 w-12 mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {selectedIds.length < 3 && (
          <Card className="border-dashed">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <Select
                value=""
                onValueChange={(value) => handleAddPolitician(Number(value))}
                disabled={loadingPoliticians || availablePoliticians.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add politician to compare" />
                </SelectTrigger>
                <SelectContent>
                  {availablePoliticians.map((politician) => (
                    <SelectItem key={politician.id} value={politician.id.toString()}>
                      {politician.name} ({politician.party})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <p className="text-sm text-gray-500 mt-2">
                {selectedIds.length === 0 
                  ? "Select at least two politicians to compare"
                  : selectedIds.length === 1
                  ? "Add one more politician to enable comparison"
                  : "Add an optional third politician"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Comparison Results */}
      {selectedIds.length < 2 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border">
          <PlusCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select Politicians to Compare</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please select at least two politicians from the dropdown above to see a side-by-side comparison.
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading comparison data...</p>
        </div>
      ) : error || !comparisonData ? (
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-100">
          <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Comparison</h3>
          <p className="text-red-600 max-w-md mx-auto">
            We couldn't load the comparison data. Please try again with different politicians.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="ratings">
          <TabsList className="w-full justify-center mb-6">
            <TabsTrigger value="ratings">Constituent Ratings</TabsTrigger>
            <TabsTrigger value="promises">Promise Fulfillment</TabsTrigger>
            <TabsTrigger value="voting">Voting Record</TabsTrigger>
          </TabsList>
          
          {/* Ratings Comparison */}
          <TabsContent value="ratings">
            <Card>
              <CardHeader className="bg-gray-50 px-6 py-4 border-b">
                <CardTitle>Constituent Ratings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                  {comparisonData.comparisonData.map((data, index) => (
                    <div key={index} className="p-6">
                      {data && (
                        <div className="flex flex-col items-center">
                          <div className="text-3xl font-bold mb-2">
                            {data.ratingStats.average.toFixed(1)}
                          </div>
                          <div className="flex items-center text-yellow-400 mb-2">
                            <RatingStars rating={data.ratingStats.average} size="md" />
                          </div>
                          <div className="text-sm text-gray-500">
                            {data.ratingStats.count} ratings
                          </div>
                          
                          {/* Rating Categories */}
                          <div className="w-full mt-6 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Key Performance Areas</h4>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <div className="w-24 text-sm">Policy Impact</div>
                                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        data.politician.party === 'Democratic' ? 'bg-primary-500' :
                                        data.politician.party === 'Republican' ? 'bg-red-500' :
                                        'bg-amber-500'
                                      }`} 
                                      style={{ width: `${Math.round(data.ratingStats.average * 20)}%` }}
                                    ></div>
                                  </div>
                                  <div className="w-8 text-sm font-medium ml-2">
                                    {(data.ratingStats.average - 0.3).toFixed(1)}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-24 text-sm">Transparency</div>
                                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        data.politician.party === 'Democratic' ? 'bg-primary-500' :
                                        data.politician.party === 'Republican' ? 'bg-red-500' :
                                        'bg-amber-500'
                                      }`} 
                                      style={{ width: `${Math.round((data.ratingStats.average + 0.2) * 20)}%` }}
                                    ></div>
                                  </div>
                                  <div className="w-8 text-sm font-medium ml-2">
                                    {(data.ratingStats.average + 0.2).toFixed(1)}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-24 text-sm">Accessibility</div>
                                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        data.politician.party === 'Democratic' ? 'bg-primary-500' :
                                        data.politician.party === 'Republican' ? 'bg-red-500' :
                                        'bg-amber-500'
                                      }`} 
                                      style={{ width: `${Math.round((data.ratingStats.average - 0.1) * 20)}%` }}
                                    ></div>
                                  </div>
                                  <div className="w-8 text-sm font-medium ml-2">
                                    {(data.ratingStats.average - 0.1).toFixed(1)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Promise Fulfillment Comparison */}
          <TabsContent value="promises">
            <Card>
              <CardHeader className="bg-gray-50 px-6 py-4 border-b">
                <CardTitle>Promise Fulfillment</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                  {comparisonData.comparisonData.map((data, index) => (
                    <div key={index} className="p-6">
                      {data && (
                        <div className="flex flex-col items-center">
                          <div className="text-3xl font-bold text-primary-600 mb-2">
                            {data.fulfillmentRate}%
                          </div>
                          <div className="text-sm text-gray-500 mb-6">Promise Fulfillment Rate</div>
                          
                          <div className="grid grid-cols-3 w-full max-w-xs text-center">
                            <div>
                              <div className="text-lg font-semibold text-green-600">
                                {data.fulfillmentStats.fulfilled}
                              </div>
                              <div className="text-xs text-gray-500">Fulfilled</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-amber-500">
                                {data.fulfillmentStats.inProgress}
                              </div>
                              <div className="text-xs text-gray-500">In Progress</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-red-500">
                                {data.fulfillmentStats.unfulfilled}
                              </div>
                              <div className="text-xs text-gray-500">Unfulfilled</div>
                            </div>
                          </div>
                          
                          {/* Key Promises */}
                          <div className="w-full mt-6">
                            <h4 className="text-sm font-medium mb-3">Key Promises</h4>
                            <div className="space-y-2">
                              {data.promises.slice(0, 3).map(promise => (
                                <div key={promise.id} className="border rounded-md p-3">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                                        promise.status === 'Fulfilled' ? 'bg-green-50 text-green-600' :
                                        promise.status === 'InProgress' ? 'bg-amber-50 text-amber-600' :
                                        'bg-red-50 text-red-600'
                                      }`}>
                                        {promise.status === 'Fulfilled' ? <CheckCircle className="h-3 w-3" /> : 
                                         promise.status === 'InProgress' ? <ArrowRight className="h-3 w-3" /> :
                                         <XCircle className="h-3 w-3" />}
                                      </span>
                                    </div>
                                    <div className="ml-2">
                                      <p className="text-sm font-medium">{promise.title}</p>
                                      <div className="flex items-center mt-1">
                                        <Badge variant="outline" className={`text-xs ${
                                          promise.status === 'Fulfilled' ? 'bg-green-50 text-green-600' :
                                          promise.status === 'InProgress' ? 'bg-amber-50 text-amber-600' :
                                          'bg-red-50 text-red-600'
                                        }`}>
                                          {promise.status === 'InProgress' ? 'In Progress' : promise.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Voting Record Comparison */}
          <TabsContent value="voting">
            <Card>
              <CardHeader className="bg-gray-50 px-6 py-4 border-b">
                <CardTitle>Recent Voting Alignment</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bill
                        </th>
                        {comparisonData.politicians.map((politician) => (
                          <th key={politician.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {politician.name}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alignment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {comparisonData.commonBills.map((billData) => (
                        <tr key={billData.billId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {billData.bill?.title || "Unknown Bill"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {billData.bill?.dateVoted ? formatDate(billData.bill.dateVoted) : "N/A"}
                            </div>
                          </td>
                          
                          {billData.votes.map((voteData, index) => (
                            <td key={index} className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline" className={getVoteColor(voteData.vote)}>
                                {voteData.vote}
                              </Badge>
                            </td>
                          ))}
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {billData.votes.every(v => v.vote === billData.votes[0].vote) ? (
                              <Badge variant="outline" className="bg-green-50 text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" /> Aligned
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-600">
                                <XCircle className="h-4 w-4 mr-1" /> Different
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Overall Alignment */}
                <div className="mt-8 flex justify-center">
                  <div className="bg-gray-100 rounded-lg px-6 py-4 text-center">
                    <div className="text-xl font-semibold mb-1">
                      {(() => {
                        // Calculate voting alignment percentage
                        const totalBills = comparisonData.commonBills.length;
                        if (totalBills === 0) return "N/A";
                        
                        const alignedBills = comparisonData.commonBills.filter(bill => 
                          bill.votes.every(v => v.vote === bill.votes[0].vote)
                        ).length;
                        
                        return `${Math.round((alignedBills / totalBills) * 100)}%`;
                      })()}
                    </div>
                    <div className="text-sm text-gray-600">Voting alignment on recent issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </MainLayout>
  );
};

export default Compare;
