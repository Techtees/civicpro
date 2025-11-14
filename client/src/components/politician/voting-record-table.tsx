import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VotingRecordWithBill } from "@/lib/types";
import { formatDate } from "@/lib/utils/formatting";
import { ThumbsUp, ThumbsDown, Minus, UserX, Calendar, FileText, TrendingUp } from "lucide-react";

interface VotingRecordTableProps {
  votingRecords: VotingRecordWithBill[];
  className?: string;
  showStats?: boolean;
}

const VotingRecordTable = ({ votingRecords, className = "", showStats = true }: VotingRecordTableProps) => {
  // Calculate voting statistics
  const stats = {
    for: votingRecords.filter(r => r.vote === 'For').length,
    against: votingRecords.filter(r => r.vote === 'Against').length,
    abstained: votingRecords.filter(r => r.vote === 'Abstained').length,
    absent: votingRecords.filter(r => r.vote === 'Absent').length,
    total: votingRecords.length
  };

  // Vote configuration with semantic colors
  const voteConfig = {
    'For': {
      icon: <ThumbsUp className="h-4 w-4" />,
      badgeClass: 'bg-success-100 text-success-700 border-success-300 hover:bg-success-200',
      bgClass: 'bg-success-50 border-success-200',
      label: 'Voted For'
    },
    'Against': {
      icon: <ThumbsDown className="h-4 w-4" />,
      badgeClass: 'bg-danger-100 text-danger-700 border-danger-300 hover:bg-danger-200',
      bgClass: 'bg-danger-50 border-danger-200',
      label: 'Voted Against'
    },
    'Abstained': {
      icon: <Minus className="h-4 w-4" />,
      badgeClass: 'bg-warning-100 text-warning-700 border-warning-300 hover:bg-warning-200',
      bgClass: 'bg-warning-50 border-warning-200',
      label: 'Abstained'
    },
    'Absent': {
      icon: <UserX className="h-4 w-4" />,
      badgeClass: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
      bgClass: 'bg-gray-50 border-gray-200',
      label: 'Absent'
    }
  };

  // Calculate participation rate
  const participationRate = stats.total > 0 
    ? Math.round(((stats.total - stats.absent) / stats.total) * 100) 
    : 0;

  return (
    <div className={className}>
      <Card className="border-2 border-gray-100">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Voting Record</CardTitle>
            <TrendingUp className={`h-5 w-5 ${
              participationRate >= 90 ? 'text-success-500' :
              participationRate >= 70 ? 'text-warning-500' :
              'text-danger-500'
            }`} />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Voting Statistics */}
          {showStats && votingRecords.length > 0 && (
            <div className="mb-6">
              <div className="bg-gradient-to-br from-civic-50 to-civic-100 rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-civic-700">{stats.total}</div>
                    <div className="text-xs font-medium text-civic-600 mt-1">Total Votes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-success-50 border border-success-200">
                    <div className="text-2xl font-bold text-success-700">{stats.for}</div>
                    <div className="text-xs font-medium text-success-600 mt-1">For</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-danger-50 border border-danger-200">
                    <div className="text-2xl font-bold text-danger-700">{stats.against}</div>
                    <div className="text-xs font-medium text-danger-600 mt-1">Against</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-warning-50 border border-warning-200">
                    <div className="text-2xl font-bold text-warning-700">{stats.abstained}</div>
                    <div className="text-xs font-medium text-warning-600 mt-1">Abstained</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-700">{stats.absent}</div>
                    <div className="text-xs font-medium text-gray-600 mt-1">Absent</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-civic-200">
                  <span className="text-sm font-medium text-civic-700">Participation Rate</span>
                  <span className="text-lg font-bold text-civic-700">{participationRate}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Voting Records List */}
          {votingRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No voting records have been recorded for this politician.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {votingRecords.map((record) => {
                const config = voteConfig[record.vote as keyof typeof voteConfig];
                
                return (
                  <div 
                    key={record.id} 
                    className={`group border-2 rounded-lg p-5 transition-all duration-200 hover:shadow-md ${config.bgClass}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Bill Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              record.vote === 'For' ? 'bg-success-100 text-success-600' :
                              record.vote === 'Against' ? 'bg-danger-100 text-danger-600' :
                              record.vote === 'Abstained' ? 'bg-warning-100 text-warning-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {config.icon}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-civic-700 transition-colors">
                              {record.bill?.title || "Untitled Bill"}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {record.bill?.description || "No description available"}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3">
                              {record.bill?.dateVoted && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(new Date(record.bill.dateVoted))}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vote Badge */}
                      <div className="flex-shrink-0">
                        <Badge 
                          className={`${config.badgeClass} font-semibold px-4 py-2 text-sm border-2 flex items-center gap-2 transition-colors`}
                        >
                          {config.icon}
                          <span>{config.label}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VotingRecordTable;