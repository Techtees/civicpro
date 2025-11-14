import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
    <div className="bg-white border rounded-lg p-4 sticky top-4">
      <h2 className="font-semibold mb-3">Filters</h2>
      
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search politicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Political Party</h3>
        <div className="space-y-2">
          {parties.map(party => (
            <div key={party} className="flex items-center">
              <Checkbox 
                id={`party-${party}`} 
                checked={selectedParties.includes(party)}
                onCheckedChange={(checked) => handlePartyChange(party, !!checked)}
              />
              <Label htmlFor={`party-${party}`} className="ml-2 text-sm">
                {party}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map(rating => (
            <div key={rating} className="flex items-center">
              <Checkbox 
                id={`rating-${rating}`} 
                checked={minRating === rating}
                onCheckedChange={(checked) => {
                  setMinRating(checked ? rating : null);
                }}
              />
              <Label htmlFor={`rating-${rating}`} className="ml-2 text-sm">
                {rating}+ Stars
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Promise Fulfillment</h3>
        <div className="space-y-2">
          {[90, 75, 50].map(percent => (
            <div key={percent} className="flex items-center">
              <Checkbox 
                id={`promise-${percent}`} 
                checked={minPromiseFulfillment === percent}
                onCheckedChange={(checked) => {
                  setMinPromiseFulfillment(checked ? percent : null);
                }}
              />
              <Label htmlFor={`promise-${percent}`} className="ml-2 text-sm">
                {percent}%+
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Parish</h3>
        <Select 
          value={parish || "all"} 
          onValueChange={value => setParish(value)}
        >
          <SelectTrigger>
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
      
      <div className="mt-6 pt-4 border-t">
        <Button 
          className="w-full mb-2" 
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={resetFilters}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PoliticianFilter;
