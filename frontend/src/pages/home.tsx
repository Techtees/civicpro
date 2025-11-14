import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search,
  Star,
  Zap,
  MapPin,
  CheckCircle,
  BarChart2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/layout/MainLayout";
import PoliticianCard from "@/components/politician/politician-card";
import { PoliticianWithRating } from "@/lib/types";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("top-rated");

  // Fetch politicians
  const {
    data: politicians,
    isLoading,
    error,
  } = useQuery<PoliticianWithRating[]>({
    queryKey: ["/api/politicians"],
  });

  // Filter and sort politicians based on active filter
  const filteredPoliticians = politicians ? [...politicians] : [];

  if (activeFilter === "top-rated") {
    filteredPoliticians.sort((a, b) => b.rating - a.rating);
  }

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here - for MVP, we'll just filter in memory
    // In a real app, this would query the API with search params
  };

  const setFilter = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="bg-primary rounded-xl shadow-lg text-white p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Track Political Accountability
          </h1>
          <p className="text-primary-100 mb-4 max-w-2xl">
            Compare promises made with actions taken. CivicPro helps citizens
            make informed decisions based on politician performance, not just
            rhetoric.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/compare">
              <Button variant="secondary" size="lg">
                <BarChart2 className="mr-2 h-4 w-4" />
                Compare Politicians
              </Button>
            </Link>
            <Link href="/directory">
              <Button
                variant="default"
                size="lg"
                className="bg-primary-700 hover:bg-primary-800"
              >
                <Star className="mr-2 h-4 w-4" />
                Rate a Politician
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary-700 to-transparent opacity-60"></div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                className="pl-10 py-6 pr-4 rounded-l-lg rounded-r-none border-r-0"
                placeholder="Search by name, parish, or party..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="rounded-l-none h-12 px-6">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant={activeFilter === "top-rated" ? "default" : "outline"}
          className={
            activeFilter === "top-rated"
              ? "bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100"
              : ""
          }
          onClick={() => setFilter("top-rated")}
        >
          <Star className="mr-2 h-4 w-4" />
          Top Rated
        </Button>
        <Button
          variant={activeFilter === "most-active" ? "default" : "outline"}
          className={
            activeFilter === "most-active"
              ? "bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100"
              : ""
          }
          onClick={() => setFilter("most-active")}
        >
          <Zap className="mr-2 h-4 w-4" />
          Most Active
        </Button>
        <Button
          variant={activeFilter === "by-district" ? "default" : "outline"}
          className={
            activeFilter === "by-district"
              ? "bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100"
              : ""
          }
          onClick={() => setFilter("by-district")}
        >
          <MapPin className="mr-2 h-4 w-4" />
          By District
        </Button>
        <Button
          variant={activeFilter === "promise-keepers" ? "default" : "outline"}
          className={
            activeFilter === "promise-keepers"
              ? "bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100"
              : ""
          }
          onClick={() => setFilter("promise-keepers")}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Promise Keepers
        </Button>
      </div>

      {/* Featured Politicians */}
      <h2 className="text-2xl font-bold mb-4">Featured Politicians</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="animate-pulse mt-4">
                  <div className="h-3 bg-slate-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/4"></div>
                </div>
                <div className="animate-pulse mt-4 pt-4 border-t flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-100 mb-12">
          <p className="text-red-600">
            Error loading politicians. Please try again later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPoliticians.slice(0, 6).map((politician) => (
            <PoliticianCard
              key={politician.id}
              politician={politician}
              fulfillmentRate={87} // This is a placeholder - in a real app, this would come from the API
            />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="text-center">
        <Link href="/directory">
          <Button variant="outline" size="lg">
            View All Politicians
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default Home;
