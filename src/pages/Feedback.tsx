import React, { useState, useMemo, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import FeatureRequestCard from '@/components/feedback/FeatureRequestCard';
import SubmitFeatureDialog from '@/components/feedback/SubmitFeatureDialog';
import LoadingState from '@/components/ui/loading-state';
import { useAuth } from '@/hooks/useAuth';
import { useFeatureRequests, useFeatureCategories } from '@/hooks/useFeatureRequests';

const Feedback = () => {
  const { user } = useAuth();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'upvotes_desc' | 'title_asc' | 'category_asc'>('upvotes_desc');

  useEffect(() => {
    document.title = 'Feature-Requests – Upvotes & Kommentare';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Feature-Requests: Upvotes, Kommentare und Sortierung nach Name, Upvotes oder Kategorie.'
      );
    }
  }, []);

  // Daten laden
  const { data: featureRequests = [], isLoading } = useFeatureRequests('all', 'all', '', '', user?.id);
  const { data: categories = [] } = useFeatureCategories();

  // Sortierung anwenden
  const sortedRequests = useMemo(() => {
    const arr = [...featureRequests];
    if (sortBy === 'title_asc') {
      arr.sort((a, b) => a.title.localeCompare(b.title, 'de', { sensitivity: 'base' }));
    } else if (sortBy === 'category_asc') {
      const name = (r: any) => r.feature_categories?.name || '';
      arr.sort((a, b) => name(a).localeCompare(name(b), 'de', { sensitivity: 'base' }));
    } else {
      arr.sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
    }
    return arr;
  }, [featureRequests, sortBy]);

  return (
    <MobileLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Feature-Requests</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Sortieren nach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upvotes_desc">Nach Upvotes (absteigend)</SelectItem>
                <SelectItem value="title_asc">Nach Name (A–Z)</SelectItem>
                <SelectItem value="category_asc">Nach Kategorie (A–Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button id="new-feature-btn" onClick={() => setIsSubmitDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Feature vorschlagen
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="ml-4 flex flex-col items-center gap-1">
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-14" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                Noch keine Feature-Requests vorhanden. Schlagen Sie das erste Feature vor!
              </div>
              <Button onClick={() => setIsSubmitDialogOpen(true)} className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Erstes Feature vorschlagen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedRequests.map((request, index) => (
              <div key={request.id} className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
                <FeatureRequestCard request={request} />
              </div>
            ))}
          </div>
        )}

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