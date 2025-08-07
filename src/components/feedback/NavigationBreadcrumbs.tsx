import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronRight, 
  Home, 
  MessageSquare, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowUp,
  Keyboard
} from 'lucide-react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface NavigationBreadcrumbsProps {
  currentStatus: string;
  currentCategory: string;
  searchTerm: string;
  statusCounts: Record<string, number>;
  categories: Array<{ id: string; name: string; color: string }>;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onSearchClear: () => void;
}

const NavigationBreadcrumbs = ({ 
  currentStatus, 
  currentCategory, 
  searchTerm,
  statusCounts,
  categories,
  onStatusChange,
  onCategoryChange,
  onSearchClear
}: NavigationBreadcrumbsProps) => {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcut('1', () => onStatusChange('all'));
  useKeyboardShortcut('2', () => onStatusChange('open'));
  useKeyboardShortcut('3', () => onStatusChange('under_review'));
  useKeyboardShortcut('4', () => onStatusChange('planned'));
  useKeyboardShortcut('5', () => onStatusChange('completed'));
  useKeyboardShortcut('/', () => document.getElementById('search-input')?.focus());
  useKeyboardShortcut('n', () => document.getElementById('new-feature-btn')?.click());
  useKeyboardShortcut('h', () => navigate('/dashboard'));
  useKeyboardShortcut('?', () => setShowShortcuts(!showShortcuts));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      case 'planned': return <Lightbulb className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'all': return 'Alle';
      case 'open': return 'Offen';
      case 'under_review': return 'In Prüfung';
      case 'planned': return 'Geplant';
      case 'completed': return 'Fertig';
      default: return status;
    }
  };

  const currentCategoryName = categories.find(c => c.id === currentCategory)?.name || 'Alle Kategorien';

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="h-auto p-1 hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
        </Button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Feature Requests</span>
        
        {(currentStatus !== 'all' || currentCategory !== 'all' || searchTerm) && (
          <>
            <ChevronRight className="h-4 w-4" />
            <div className="flex items-center gap-2">
              {currentStatus !== 'all' && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted animate-scale-in"
                  onClick={() => onStatusChange('all')}
                >
                  {getStatusIcon(currentStatus)}
                  <span className="ml-1">{getStatusLabel(currentStatus)}</span>
                </Badge>
              )}
              {currentCategory !== 'all' && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted animate-scale-in"
                  onClick={() => onCategoryChange('all')}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {currentCategoryName}
                </Badge>
              )}
              {searchTerm && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted animate-scale-in"
                  onClick={onSearchClear}
                >
                  "{searchTerm}"
                </Badge>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Quick Status Navigation */}
      <Card className="animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Quick Navigation</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="h-auto p-1"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { key: 'all', label: 'Alle', count: Object.values(statusCounts).reduce((a, b) => a + b, 0) },
              { key: 'open', label: 'Offen', count: statusCounts.open || 0 },
              { key: 'under_review', label: 'In Prüfung', count: statusCounts.under_review || 0 },
              { key: 'planned', label: 'Geplant', count: statusCounts.planned || 0 },
              { key: 'completed', label: 'Fertig', count: statusCounts.completed || 0 },
            ].map((status, index) => (
              <Button
                key={status.key}
                variant={currentStatus === status.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(status.key)}
                className={`h-auto py-2 px-3 transition-all duration-200 hover:scale-105 ${
                  currentStatus === status.key ? 'animate-scale-in' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col items-center gap-1">
                  {getStatusIcon(status.key)}
                  <span className="text-xs">{status.label}</span>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1">
                    {status.count}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-3">Tastenkürzel</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Alle anzeigen</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">1</kbd>
              </div>
              <div className="flex justify-between">
                <span>Offen</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">2</kbd>
              </div>
              <div className="flex justify-between">
                <span>In Prüfung</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">3</kbd>
              </div>
              <div className="flex justify-between">
                <span>Geplant</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">4</kbd>
              </div>
              <div className="flex justify-between">
                <span>Fertig</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">5</kbd>
              </div>
              <div className="flex justify-between">
                <span>Suchen</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd>
              </div>
              <div className="flex justify-between">
                <span>Neues Feature</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">N</kbd>
              </div>
              <div className="flex justify-between">
                <span>Dashboard</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">H</kbd>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NavigationBreadcrumbs;