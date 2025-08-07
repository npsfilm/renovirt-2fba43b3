import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, TrendingUp, Clock, Users } from 'lucide-react';

interface QuickFiltersProps {
  onFilterChange: (filter: string) => void;
  activeFilter?: string;
  requestCounts: {
    trending: number;
    recent: number;
    popular: number;
    myRequests: number;
  };
}

const QuickFilters = ({ onFilterChange, activeFilter, requestCounts }: QuickFiltersProps) => {
  const filters = [
    {
      id: 'trending',
      label: 'Trending',
      icon: TrendingUp,
      description: 'Meist diskutiert',
      count: requestCounts.trending,
      color: 'bg-orange-500'
    },
    {
      id: 'popular',
      label: 'Beliebt',
      icon: ArrowUp,
      description: 'Meiste Votes',
      count: requestCounts.popular,
      color: 'bg-green-500'
    },
    {
      id: 'recent',
      label: 'Neu',
      icon: Clock,
      description: 'Kürzlich erstellt',
      count: requestCounts.recent,
      color: 'bg-blue-500'
    },
    {
      id: 'my-requests',
      label: 'Meine',
      icon: Users,
      description: 'Meine Vorschläge',
      count: requestCounts.myRequests,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      {filters.map((filter, index) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className={`h-auto py-2 px-3 transition-all duration-200 hover:scale-105 ${
            activeFilter === filter.id ? 'animate-scale-in' : ''
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${filter.color} animate-pulse`}
                style={{ animationDuration: '2s' }}
              />
              <filter.icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium">{filter.label}</span>
              <span className="text-[10px] text-muted-foreground">{filter.description}</span>
            </div>
            {filter.count > 0 && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-1">
                {filter.count}
              </Badge>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickFilters;