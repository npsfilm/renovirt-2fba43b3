import React, { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeatureRequest, FeatureCategory } from '@/types/feedback';

const Feedback = () => {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
        `)
        .order('upvote_count', { ascending: false });

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
  });

  const getStatusCounts = () => {
    return featureRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <MobileLayout>
      <div className="container mx-auto p-4 space-y-6">
        <PageHeader title="Feature Requests" />
        <p className="text-muted-foreground mb-6">
          Teilen Sie Ihre Ideen mit und stimmen Sie für Features ab, die Sie sich wünschen.
        </p>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Feature-Requests durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
          <Button onClick={() => setIsSubmitDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Feature vorschlagen
          </Button>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
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
              <div className="grid gap-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featureRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                      ? 'Keine Feature-Requests gefunden, die Ihren Kriterien entsprechen.'
                      : 'Noch keine Feature-Requests vorhanden. Seien Sie der Erste und schlagen Sie ein Feature vor!'}
                  </div>
                  <Button 
                    onClick={() => setIsSubmitDialogOpen(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Erstes Feature vorschlagen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {featureRequests.map((request) => (
                  <FeatureRequestCard key={request.id} request={request} />
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