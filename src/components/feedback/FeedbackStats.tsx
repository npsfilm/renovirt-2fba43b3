import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

interface FeedbackStatsProps {
  stats: {
    totalRequests: number;
    totalUpvotes: number;
    completedThisMonth: number;
    avgResponseTime: string;
    statusBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, { count: number; color: string }>;
  };
}

const FeedbackStats = ({ stats }: FeedbackStatsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'under_review': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned': return <BarChart3 className="h-4 w-4 text-purple-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Offen';
      case 'under_review': return 'In Prüfung';
      case 'planned': return 'Geplant';
      case 'completed': return 'Fertig';
      default: return status;
    }
  };

  const maxStatusCount = Math.max(...Object.values(stats.statusBreakdown));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Requests */}
      <Card className="animate-fade-in hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gesamt Requests</p>
              <p className="text-2xl font-bold">{stats.totalRequests}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Total Upvotes */}
      <Card className="animate-fade-in hover:shadow-md transition-all duration-300" style={{ animationDelay: '100ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gesamt Votes</p>
              <p className="text-2xl font-bold">{stats.totalUpvotes}</p>
            </div>
            <ThumbsUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* Completed This Month */}
      <Card className="animate-fade-in hover:shadow-md transition-all duration-300" style={{ animationDelay: '200ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fertig diesen Monat</p>
              <p className="text-2xl font-bold">{stats.completedThisMonth}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Avg Response Time */}
      <Card className="animate-fade-in hover:shadow-md transition-all duration-300" style={{ animationDelay: '300ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ø Antwortzeit</p>
              <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="md:col-span-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="text-base">Status Übersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(stats.statusBreakdown).map(([status, count]) => (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="text-sm font-medium">{getStatusLabel(status)}</span>
                </div>
                <Badge variant="outline">{count}</Badge>
              </div>
              <Progress 
                value={(count / maxStatusCount) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="md:col-span-2 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-base">Kategorien</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(stats.categoryBreakdown).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: data.color }}
                  />
                  <span className="text-sm font-medium truncate">{category}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {data.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackStats;