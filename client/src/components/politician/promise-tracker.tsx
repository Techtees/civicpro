import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPromise } from "@shared/schema";
import { formatDate } from "@/lib/utils/formatting";
import { Check, Clock, X, HelpCircle, ExternalLink, Calendar, TrendingUp } from "lucide-react";

interface PromiseTrackerProps {
  promises: IPromise[];
  className?: string;
}

const PromiseTracker = ({ promises, className = "" }: PromiseTrackerProps) => {
  // Count promises by status
  const fulfilled = promises.filter(p => p.status === 'Fulfilled').length;
  const inProgress = promises.filter(p => p.status === 'InProgress').length;
  const unfulfilled = promises.filter(p => p.status === 'Unfulfilled').length;
  const total = promises.length;
  
  // Calculate fulfillment rate
  const fulfillmentRate = total > 0 ? Math.round((fulfilled / total) * 100) : 0;
  
  // Status configuration with semantic colors
  const statusConfig = {
    'Fulfilled': {
      icon: <Check className="h-4 w-4" />,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      badgeColor: 'bg-success-100 text-success-700 border-success-200',
      borderColor: 'border-success-200',
      label: 'Fulfilled'
    },
    'InProgress': {
      icon: <Clock className="h-4 w-4" />,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      badgeColor: 'bg-warning-100 text-warning-700 border-warning-200',
      borderColor: 'border-warning-200',
      label: 'In Progress'
    },
    'Unfulfilled': {
      icon: <X className="h-4 w-4" />,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
      badgeColor: 'bg-danger-100 text-danger-700 border-danger-200',
      borderColor: 'border-danger-200',
      label: 'Unfulfilled'
    },
  };
  
  return (
    <div className={className}>
      <Card className="border-2 border-gray-100">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Promise Tracker</CardTitle>
            <TrendingUp className={`h-5 w-5 ${
              fulfillmentRate >= 70 ? 'text-success-500' :
              fulfillmentRate >= 40 ? 'text-warning-500' :
              'text-danger-500'
            }`} />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Stats Overview */}
          <div className="bg-gradient-to-br from-civic-50 to-civic-100 rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-civic-700 mb-2">{fulfillmentRate}%</div>
              <div className="text-sm font-medium text-civic-600">Overall Fulfillment Rate</div>
            </div>
            
            <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
              <div className="h-full flex">
                {fulfilled > 0 && (
                  <div 
                    className="bg-success-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(fulfilled / total) * 100}%` }}
                  />
                )}
                {inProgress > 0 && (
                  <div 
                    className="bg-warning-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(inProgress / total) * 100}%` }}
                  />
                )}
                {unfulfilled > 0 && (
                  <div 
                    className="bg-danger-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(unfulfilled / total) * 100}%` }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-success-50 border-2 border-success-200">
              <div className="text-2xl font-bold text-success-700">{fulfilled}</div>
              <div className="text-xs font-medium text-success-600 mt-1">Fulfilled</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning-50 border-2 border-warning-200">
              <div className="text-2xl font-bold text-warning-700">{inProgress}</div>
              <div className="text-xs font-medium text-warning-600 mt-1">In Progress</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-danger-50 border-2 border-danger-200">
              <div className="text-2xl font-bold text-danger-700">{unfulfilled}</div>
              <div className="text-xs font-medium text-danger-600 mt-1">Unfulfilled</div>
            </div>
          </div>

          {/* Promise List */}
          {promises.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span>Recent Promises</span>
                <span className="text-sm font-normal text-gray-500">({promises.length} total)</span>
              </h3>
              <div className="space-y-3">
                {promises.slice(0, 5).map((promise) => {
                  const config = statusConfig[promise.status as keyof typeof statusConfig];
                  
                  return (
                    <div 
                      key={promise.id} 
                      className={`group border-2 ${config.borderColor} rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-8 h-8 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center`}>
                            {config.icon}
                          </div>
                        </div>
                        
                        {/* Promise Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-civic-700 transition-colors">
                            {promise.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {promise.description}
                          </p>
                          
                          {/* Meta Information */}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className={`px-2.5 py-1 rounded-full font-medium border ${config.badgeColor}`}>
                              {config.label}
                            </span>
                            
                            {promise.fulfillmentDate && (
                              <span className="flex items-center gap-1 text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {formatDate(promise.fulfillmentDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {promises.length > 5 && (
                <div className="mt-5 pt-4 border-t border-gray-200 text-center">
                  <a 
                    href="#all-promises" 
                    className="inline-flex items-center gap-2 text-civic-600 hover:text-civic-700 font-medium transition-colors"
                  >
                    <span>View all {promises.length} promises</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          )}
          
          {promises.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No promises tracked yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromiseTracker;
