import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Star, CheckCircle, MapPin, RotateCcw } from "lucide-react";
import { PoliticianFilterOptions } from "@/lib/types";
import { PartyEnum } from "@shared/schema";

interface PoliticianFilterProps {
  onFilterChange: (filters: PoliticianFilterOptions) => void;
  parishes: string[];
}

const PoliticianFilter = ({ onFilterChange, parishes }: PoliticianFilterProps) => {
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [minPromiseFulfillment, setMinPromiseFulfillment] = useState<number | null>(null);
  const [parish, setParish] = useState<string | null>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Available parties from enum
  const parties = Object.values(PartyEnum.Values);
  
  const handlePartyChange = (party: string, checked: boolean) => {
    if (checked) {
      setSelectedParties([...selectedParties, party]);
    } else {
      setSelectedParties(selectedParties.filter(p => p !== party));
    }
  };
  
  const applyFilters = () => {
    onFilterChange({
      parties: selectedParties as any[],
      minRating,
      minPromiseFulfillment,
      parish: parish === "all" ? null : parish,
      searchQuery
    });
  };
  
  const resetFilters = () => {
    setSelectedParties([]);
    setMinRating(null);
    setMinPromiseFulfillment(null);
    setParish("all");
    setSearchQuery("");
    
    onFilterChange({
      parties: [],
      minRating: null,
      minPromiseFulfillment: null,
      parish: null,
      searchQuery: ""
    });
  };
  
  // Apply filters when search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  return (
    <div className="bg-white border-2 border-civic-100 rounded-lg p-5 shadow-sm">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search politicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-civic-200 focus:border-civic-500 focus:ring-civic-500"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-500" />
        </div>
      </div>
      
      {/* Political Party */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-civic-500 rounded-full"></div>
          <span>Political Party</span>
        </h3>
        <div className="space-y-2.5">
          {parties.map(party => {
            const partyColor = 
              party === 'Democratic' ? 'text-democratic-600' :
              party === 'Republican' ? 'text-republican-600' :
              'text-independent-600';
            
            return (
              <div key={party} className="flex items-center group">
                <Checkbox 
                  id={`party-${party}`} 
                  checked={selectedParties.includes(party)}
                  onCheckedChange={(checked) => handlePartyChange(party, !!checked)}
                  className="border-civic-300 data-[state=checked]:bg-civic-600 data-[state=checked]:border-civic-600"
                />
                <Label 
                  htmlFor={`party-${party}`} 
                  className={`ml-3 text-sm font-medium cursor-pointer group-hover:text-civic-700 transition-colors ${
                    selectedParties.includes(party) ? partyColor : 'text-gray-700'
                  }`}
                >
                  {party}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-warning-500" />
          <span>Minimum Rating</span>
        </h3>
        <div className="space-y-2.5">
          {[4, 3, 2].map(rating => (
            <div key={rating} className="flex items-center group">
              <Checkbox 
                id={`rating-${rating}`} 
                checked={minRating === rating}
                onCheckedChange={(checked) => {
                  setMinRating(checked ? rating : null);
                }}
                className="border-civic-300 data-[state=checked]:bg-warning-500 data-[state=checked]:border-warning-500"
              />
              <Label 
                htmlFor={`rating-${rating}`} 
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer group-hover:text-civic-700 transition-colors flex items-center gap-1"
              >
                <span>{rating}+</span>
                <div className="flex">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-warning-400 text-warning-400" />
                  ))}
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Promise Fulfillment */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-success-500" />
          <span>Promise Fulfillment</span>
        </h3>
        <div className="space-y-2.5">
          {[90, 75, 50].map(percent => (
            <div key={percent} className="flex items-center group">
              <Checkbox 
                id={`promise-${percent}`} 
                checked={minPromiseFulfillment === percent}
                onCheckedChange={(checked) => {
                  setMinPromiseFulfillment(checked ? percent : null);
                }}
                className="border-civic-300 data-[state=checked]:bg-success-500 data-[state=checked]:border-success-500"
              />
              <Label 
                htmlFor={`promise-${percent}`} 
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer group-hover:text-civic-700 transition-colors"
              >
                {percent}%+ Fulfilled
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Parish */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-civic-500" />
          <span>Parish</span>
        </h3>
        <Select 
          value={parish || "all"} 
          onValueChange={value => setParish(value)}
        >
          <SelectTrigger className="border-civic-200 focus:ring-civic-500">
            <SelectValue placeholder="All Parishes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parishes</SelectItem>
            {parishes.map(parish => (
              <SelectItem key={parish} value={parish}>
                {parish}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
        <Button 
          className="w-full bg-civic-600 hover:bg-civic-700 text-white" 
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-civic-300 text-civic-700 hover:bg-civic-50"
          onClick={resetFilters}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default PoliticianFilter;
