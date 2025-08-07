import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import FeatureRequestCard from '@/components/feedback/FeatureRequestCard';
import SubmitFeatureDialog from '@/components/feedback/SubmitFeatureDialog';
import NavigationBreadcrumbs from '@/components/feedback/NavigationBreadcrumbs';
import QuickFilters from '@/components/feedback/QuickFilters';
import FeedbackStats from '@/components/feedback/FeedbackStats';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeatureRequest, FeatureCategory } from '@/types/feedback';
import { useAuth } from '@/hooks/useAuth';

const Feedback = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  
  // URL-controlled state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [quickFilter, setQuickFilter] = useState(searchParams.get('filter') || '');

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (quickFilter) params.set('filter', quickFilter);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, statusFilter, quickFilter, setSearchParams]);

  // Fetch feature requests
  const { data: featureRequests = [], isLoading } = useQuery({
    queryKey: ['feature-requests', selectedCategory, statusFilter, searchTerm],
    queryFn: async () => {
      let query = (supabase as any)
        .from('feature_requests')
        .select(`
          *,
          feature_categories (
            name,
            color
          ),
          customer_profiles!feature_requests_created_by_fkey (
            first_name,
            last_name
          )
        `);

      // Apply quick filters
      if (quickFilter === 'trending') {
        query = query.order('comment_count', { ascending: false });
      } else if (quickFilter === 'popular') {
        query = query.order('upvote_count', { ascending: false });
      } else if (quickFilter === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (quickFilter === 'my-requests' && user?.id) {
        query = query.eq('created_by', user.id).order('created_at', { ascending: false });
      } else {
        query = query.order('upvote_count', { ascending: false });
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['feature-categories'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('feature_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const getStatusCounts = () => {
    return featureRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  // Calculate stats for navigation
  const stats = {
    totalRequests: featureRequests.length,
    totalUpvotes: featureRequests.reduce((sum, req) => sum + req.upvote_count, 0),
    completedThisMonth: featureRequests.filter(req => 
      req.status === 'completed' && 
      new Date(req.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    avgResponseTime: '2-3 Tage',
    statusBreakdown: statusCounts,
    categoryBreakdown: categories.reduce((acc, cat) => {
      const count = featureRequests.filter(req => req.category_id === cat.id).length;
      if (count > 0) {
        acc[cat.name] = { count, color: cat.color };
      }
      return acc;
    }, {} as Record<string, { count: number; color: string }>)
  };

  const requestCounts = {
    trending: featureRequests.filter(req => req.comment_count > 3).length,
    recent: featureRequests.filter(req => 
      new Date(req.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    popular: featureRequests.filter(req => req.upvote_count > 10).length,
    myRequests: user ? featureRequests.filter(req => req.created_by === user.id).length : 0
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStatusFilter('all');
    setQuickFilter('');
  };

  return (
    <MobileLayout>
      <div className="container mx-auto p-4 space-y-6">
        <NavigationBreadcrumbs
          currentStatus={statusFilter}
          currentCategory={selectedCategory}
          searchTerm={searchTerm}
          statusCounts={statusCounts}
          categories={categories}
          onStatusChange={setStatusFilter}
          onCategoryChange={setSelectedCategory}
          onSearchClear={handleSearchClear}
        />

        {/* Stats Dashboard */}
        <FeedbackStats stats={stats} />

        {/* Quick Filters */}
        <QuickFilters
          onFilterChange={setQuickFilter}
          activeFilter={quickFilter}
          requestCounts={requestCounts}
        />

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-200" />
              <Input
                id="search-input"
                placeholder="Feature-Requests durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px] transition-all duration-200 hover:border-primary/20">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            id="new-feature-btn"
            onClick={() => setIsSubmitDialogOpen(true)}
            className="hover:scale-105 transition-all duration-200 animate-fade-in"
          >
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90 duration-200" />
            Feature vorschlagen
          </Button>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              Alle {featureRequests.length > 0 && `(${featureRequests.length})`}
            </TabsTrigger>
            <TabsTrigger value="open">
              Offen {statusCounts.open > 0 && `(${statusCounts.open})`}
            </TabsTrigger>
            <TabsTrigger value="under_review">
              In Prüfung {statusCounts.under_review > 0 && `(${statusCounts.under_review})`}
            </TabsTrigger>
            <TabsTrigger value="planned">
              Geplant {statusCounts.planned > 0 && `(${statusCounts.planned})`}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Fertig {statusCounts.completed > 0 && `(${statusCounts.completed})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 animate-fade-in">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/4 animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featureRequests.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                      ? 'Keine Feature-Requests gefunden, die Ihren Kriterien entsprechen.'
                      : 'Noch keine Feature-Requests vorhanden. Seien Sie der Erste und schlagen Sie ein Feature vor!'}
                  </div>
                  <Button 
                    onClick={() => setIsSubmitDialogOpen(true)}
                    className="mt-4 hover:scale-105 transition-all duration-200"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Erstes Feature vorschlagen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 animate-fade-in">
                {featureRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FeatureRequestCard request={request} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <SubmitFeatureDialog
          open={isSubmitDialogOpen}
          onOpenChange={setIsSubmitDialogOpen}
          categories={categories}
        />
      </div>
    </MobileLayout>
  );
};

export default Feedback;