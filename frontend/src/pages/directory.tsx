import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layout/MainLayout";
import PoliticianCard from "@/components/politician/politician-card";
import PoliticianFilter from "@/components/politician/politician-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PoliticianWithRating, PoliticianFilterOptions } from "@/lib/types";

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
        if (filters.minRating && politician.rating < filters.minRating) {
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
            politician.name.toLowerCase().includes(query) ||
            politician.parish.toLowerCase().includes(query) ||
            politician.party.toLowerCase().includes(query)
          );
        }
        
        return true;
      })
    : [];
  
  // Sort politicians
  const sortedPoliticians = [...filteredPoliticians];
  
  switch (sortBy) {
    case "name":
      sortedPoliticians.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating-high":
      sortedPoliticians.sort((a, b) => b.rating - a.rating);
      break;
    case "rating-low":
      sortedPoliticians.sort((a, b) => a.rating - b.rating);
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
      <div className="mb-6">
        <p className="text-gray-600">Browse, filter, and find detailed information on elected officials</p>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Filter sidebar */}
        <div className="w-full lg:w-64 mb-6 lg:mb-0 lg:mr-6">
          <PoliticianFilter onFilterChange={handleFilterChange} parishes={parishes} />
        </div>
        
        {/* Politicians grid */}
        <div className="flex-1">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
              <div className="font-medium">
                {sortedPoliticians.length} politicians found
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
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

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading politicians...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                <p>Error loading politicians. Please try again later.</p>
              </div>
            ) : sortedPoliticians.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No politicians found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {sortedPoliticians.map((politician) => (
                  <PoliticianCard 
                    key={politician.id} 
                    politician={politician}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Directory;
