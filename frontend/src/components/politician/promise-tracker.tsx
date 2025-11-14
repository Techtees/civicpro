import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Promise } from "@shared/schema";
import { formatDate, getPromiseStatusColor, getPromiseStatusIcon } from "@/lib/utils/formatting";
import { Check, Clock, X, HelpCircle } from "lucide-react";

interface PromiseTrackerProps {
  promises: Promise[];
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
  
  // Icon mapping
  const statusIcons = {
    'Fulfilled': <Check className="h-4 w-4" />,
    'InProgress': <Clock className="h-4 w-4" />,
    'Unfulfilled': <X className="h-4 w-4" />,
  };
  
  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Promise Fulfillment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-32">
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-3xl font-bold text-primary-600">{fulfillmentRate}%</div>
              <div className="text-sm text-gray-500">Promise Fulfillment Rate</div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-gray-100 relative">
                <div 
                  className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-primary-500 border-l-transparent border-r-transparent border-b-transparent" 
                  style={{ 
                    transform: `rotate(${fulfillmentRate * 3.6}deg)`,
                    transition: 'transform 1s ease-in-out'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t grid grid-cols-3 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">{fulfilled}</div>
              <div className="text-sm text-gray-500">Fulfilled</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-yellow-500">{inProgress}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-500">{unfulfilled}</div>
              <div className="text-sm text-gray-500">Unfulfilled</div>
            </div>
          </div>

          {promises.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-4">Key Promises</h3>
              <div className="space-y-4">
                {promises.slice(0, 3).map((promise) => (
                  <div key={promise.id} className="border rounded-md p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          promise.status === 'Fulfilled' ? 'bg-green-50 text-green-600' : 
                          promise.status === 'InProgress' ? 'bg-yellow-50 text-yellow-600' : 
                          'bg-red-50 text-red-600'
                        }`}>
                          {statusIcons[promise.status as keyof typeof statusIcons] || <HelpCircle className="h-4 w-4" />}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{promise.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{promise.description}</p>
                        <div className="flex items-center mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPromiseStatusColor(promise.status)}`}>
                            {promise.status === 'InProgress' ? 'In Progress' : promise.status}
                          </span>
                          {promise.fulfillmentDate && (
                            <span className="text-xs text-gray-500 ml-2">{formatDate(promise.fulfillmentDate)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {promises.length > 3 && (
                <div className="mt-4 text-center">
                  <a href="#promises" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all promises
                  </a>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromiseTracker;
