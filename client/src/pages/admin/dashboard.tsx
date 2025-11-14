import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/layout/AdminLayout";
import { AdminStats } from "@/lib/types";
import { UsersIcon, Star, MessageSquare, Clock, Plus } from "lucide-react";

const AdminDashboard = () => {
  // Fetch admin dashboard stats
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <Link href="/admin/politicians/add">
            <Button className="mt-3 sm:mt-0 flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Politician
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-2 bg-slate-200 rounded w-1/4 mb-3"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2 mb-3"></div>
                  <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            Error loading dashboard stats. Please try refreshing the page.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Politicians</div>
                  <div className="mt-1 text-3xl font-semibold">{stats?.totalPoliticians || 0}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {stats?.partyDistribution && Object.entries(stats.partyDistribution)
                      .map(([party, count]) => `${count} ${party}`)
                      .join(', ')}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                  <UsersIcon className="h-6 w-6" />
                </div>
              </div>
            </Card>
            
            <Card className="border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Ratings</div>
                  <div className="mt-1 text-3xl font-semibold">{stats?.totalRatings || 0}</div>
                  <div className="mt-1 text-xs text-gray-500">From users across all politicians</div>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </Card>
            
            <Card className="border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Comments</div>
                  <div className="mt-1 text-3xl font-semibold">{(stats?.totalRatings || 0) - (stats?.pendingRatings || 0)}</div>
                  <div className="mt-1 text-xs text-gray-500">User feedback and opinions</div>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
            </Card>
            
            <Card className="border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500">Pending Comments</div>
                  <div className="mt-1 text-3xl font-semibold">{stats?.pendingRatings || 0}</div>
                  <div className="mt-1 text-xs text-gray-500">Awaiting moderation</div>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <p className="text-sm text-gray-500">Latest ratings and comments from users</p>
            <div className="mt-4 py-8 flex items-center justify-center border-t border-dashed">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                <p>No recent activity</p>
              </div>
            </div>
          </Card>
          
          <Card className="border p-6">
            <h3 className="font-semibold mb-4">Party Distribution</h3>
            <p className="text-sm text-gray-500">Politicians by political party</p>
            <div className="mt-4 space-y-3 border-t pt-4">
              {stats?.partyDistribution && Object.entries(stats.partyDistribution).map(([party, count]) => (
                <div key={party} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      party === 'Democratic' ? 'bg-primary-600' :
                      party === 'Republican' ? 'bg-red-600' :
                      'bg-amber-500'
                    }`}></span>
                    <span>{party}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
