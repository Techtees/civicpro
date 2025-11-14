import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  AlertTriangle 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminLayout from "@/layout/AdminLayout";
import PartyBadge from "@/components/ui/party-badge";
import AvatarWithFallback from "@/components/ui/avatar-with-fallback";
import RatingStars from "@/components/ui/rating-stars";
import { PoliticianWithRating } from "@/lib/types";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AdminPoliticians = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [partyFilter, setPartyFilter] = useState("");
  const [deletingPolitician, setDeletingPolitician] = useState<PoliticianWithRating | null>(null);
  const { toast } = useToast();

  // Fetch politicians
  const { data: politicians, isLoading, error } = useQuery<PoliticianWithRating[]>({
    queryKey: ['/api/politicians'],
  });

  // Delete politician mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/politicians/${id}`, {}),
    onSuccess: () => {
      toast({
        title: "Politician deleted",
        description: "The politician has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/politicians'] });
      setDeletingPolitician(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the politician. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter politicians based on search and party filter
  const filteredPoliticians = politicians 
    ? politicians.filter(politician => {
        const matchesSearch = searchQuery === "" || 
          politician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          politician.district.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesParty = partyFilter === "all" || partyFilter === "" || politician.party === partyFilter;
        
        return matchesSearch && matchesParty;
      })
    : [];

  const handleDeleteClick = (politician: PoliticianWithRating) => {
    setDeletingPolitician(politician);
  };

  const confirmDelete = () => {
    if (deletingPolitician) {
      deleteMutation.mutate(deletingPolitician.id);
    }
  };

  return (
    <AdminLayout title="Politicians">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-2xl font-bold text-gray-900">Politicians</h2>
          <Link href="/admin/politicians/add">
            <Button className="mt-3 sm:mt-0 flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Politician
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border">
          <div className="px-4 py-3 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                className="pl-8"
                placeholder="Search politicians..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            </div>
            <Select value={partyFilter} onValueChange={setPartyFilter}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="All Parties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                <SelectItem value="Democratic">Democratic</SelectItem>
                <SelectItem value="Republican">Republican</SelectItem>
                <SelectItem value="Independent">Independent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading politicians...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
              <p>Error loading politicians. Please try refreshing the page.</p>
            </div>
          ) : filteredPoliticians.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No politicians found matching your filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Politician</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPoliticians.map((politician) => (
                  <TableRow key={politician.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <AvatarWithFallback 
                          src={politician.profileImageUrl} 
                          alt={politician.name} 
                        />
                        <div className="ml-4">
                          <div className="font-medium">{politician.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <PartyBadge party={politician.party as any} size="sm" />
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {politician.district}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <RatingStars rating={politician.rating} size="sm" />
                        <span className="text-xs text-gray-500 ml-1">({politician.ratingCount})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/politicians/edit/${politician.id}`}>
                        <Button size="sm" variant="ghost" className="text-primary-600 h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-600 h-8 w-8 p-0 ml-2"
                        onClick={() => handleDeleteClick(politician)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPolitician} onOpenChange={() => setDeletingPolitician(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingPolitician?.name} and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPoliticians;
