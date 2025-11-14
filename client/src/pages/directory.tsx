import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layout/MainLayout";
import PoliticianCard from "@/components/politician/politician-card";
import PoliticianFilter from "@/components/politician/politician-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PoliticianWithRating, PoliticianFilterOptions } from "@/lib/types";
import { Users, ArrowUpDown, Search, Filter } from "lucide-react";

const Directory = () => {
  // Filter state
  const [filters, setFilters] = useState<PoliticianFilterOptions>({
    parties: [],
    minRating: null,
    minPromiseFulfillment: null,
    parish: null,
    searchQuery: "",
  });
  
  // Sorting state
  const [sortBy, setSortBy] = useState<string>("name");
  
  // Fetch politicians
  const { data: politicians, isLoading, error } = useQuery<PoliticianWithRating[]>({
    queryKey: ['/api/politicians'],
  });
  
  // Extract unique parishes for filter
  const parishes = politicians
    ? politicians.map((p) => p.parish).filter((value, index, self) => self.indexOf(value) === index)
    : [];
  
  // Apply filters and sorting
  const filteredPoliticians = politicians
    ? politicians.filter((politician) => {
        // Filter by party
        if (filters.parties.length > 0 && !filters.parties.includes(politician.party as any)) {
          return false;
        }
        
        // Filter by rating
        if (filters.minRating && (politician.rating || 0) < filters.minRating) {
          return false;
        }
        
        // Filter by parish
        if (filters.parish && politician.parish !== filters.parish) {
          return false;
        }
        
        // Filter by search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          return (
            (politician.name || '').toLowerCase().includes(query) ||
            (politician.parish || '').toLowerCase().includes(query) ||
            (politician.party || '').toLowerCase().includes(query)
          );
        }
        
        return true;
      })
    : [];
  
  // Sort politicians
  const sortedPoliticians = [...filteredPoliticians];
  
  switch (sortBy) {
    case "name":
      sortedPoliticians.sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
      });
      break;
    case "rating-high":
      sortedPoliticians.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "rating-low":
      sortedPoliticians.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      break;
    default:
      break;
  }
  
  // Handle filter changes
  const handleFilterChange = (newFilters: PoliticianFilterOptions) => {
    setFilters(newFilters);
  };
  
  return (
    <MainLayout title="Politician Directory">
      {/* Page Description */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          
          <div>
            <p className="text-lg text-gray-600">Browse and discover elected officials</p>
            <p className="text-sm text-gray-500">Filter by party, parish, rating, and more</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-4">
            <div className="mb-4 flex items-center gap-2 text-civic-700 font-semibold">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </div>
            <PoliticianFilter onFilterChange={handleFilterChange} parishes={parishes} />
          </div>
        </div>
        
        {/* Politicians grid */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <Card className="mb-6 border-2 border-civic-100">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-civic-100 rounded-lg">
                    <Search className="h-5 w-5 text-civic-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {sortedPoliticians.length} {sortedPoliticians.length === 1 ? 'Politician' : 'Politicians'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sortedPoliticians.length === politicians?.length ? 'Showing all results' : 'Filtered results'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[200px] border-civic-300 focus:ring-civic-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="rating-high">Rating (High to Low)</SelectItem>
                      <SelectItem value="rating-low">Rating (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-civic-200 border-t-civic-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading politicians...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the data</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-2 border-danger-200 bg-danger-50">
              <CardContent className="p-12 text-center">
                <div className="p-4 bg-danger-100 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-12 w-12 text-danger-600" />
                </div>
                <h3 className="text-xl font-bold text-danger-900 mb-2">Unable to Load Politicians</h3>
                <p className="text-danger-700">
                  We encountered an error while loading the politicians. Please try again later.
                </p>
              </CardContent>
            </Card>
          ) : sortedPoliticians.length === 0 ? (
            <Card className="border-2 border-warning-200 bg-warning-50">
              <CardContent className="p-12 text-center">
                <div className="p-4 bg-warning-100 rounded-full w-fit mx-auto mb-4">
                  <Search className="h-12 w-12 text-warning-600" />
                </div>
                <h3 className="text-xl font-bold text-warning-900 mb-2">No Politicians Found</h3>
                <p className="text-warning-700 mb-4">
                  No politicians match your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={() => setFilters({
                    parties: [],
                    minRating: null,
                    minPromiseFulfillment: null,
                    parish: null,
                    searchQuery: "",
                  })}
                  className="px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedPoliticians.map((politician) => (
                <PoliticianCard 
                  key={politician.id} 
                  politician={politician}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Directory;
