import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { FeatureCategory } from '@/types/feedback';

interface SubmitFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: FeatureCategory[];
}

const SubmitFeatureDialog = ({ open, onOpenChange, categories }: SubmitFeatureDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    category_id: '',
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user?.id) {
        throw new Error('Sie müssen angemeldet sein, um Features vorzuschlagen.');
      }

      const { error } = await (supabase as any)
        .from('feature_requests')
        .insert({
          title: data.title.trim(),
          description: data.description.trim(),
          category_id: data.category_id,
          created_by: user.id,
          status: 'open',
          priority: 'medium',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Feature erfolgreich eingereicht',
        description: 'Vielen Dank für Ihren Vorschlag! Wir werden ihn prüfen.',
      });
      
      // Reset form and close dialog
      setFormData({ title: '', description: '', category_id: '' });
      setErrors({ title: '', description: '', category_id: '' });
      onOpenChange(false);
      
      // Refresh feature requests
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Einreichen',
        description: error.message || 'Beim Einreichen Ihres Feature-Vorschlags ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    },
  });

  const validateForm = () => {
    const newErrors = { title: '', description: '', category_id: '' };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = 'Titel ist erforderlich';
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Titel muss mindestens 3 Zeichen lang sein';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Beschreibung ist erforderlich';
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Beschreibung muss mindestens 10 Zeichen lang sein';
      isValid = false;
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Kategorie ist erforderlich';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Anmeldung erforderlich',
        description: 'Sie müssen angemeldet sein, um Features vorzuschlagen.',
        variant: 'destructive',
      });
      return;
    }

    if (validateForm()) {
      submitMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Feature vorschlagen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              placeholder="Kurzer, aussagekräftiger Titel für Ihr Feature"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategorie *</Label>
            <Select 
              value={formData.category_id} 
              onValueChange={(value) => handleInputChange('category_id', value)}
            >
              <SelectTrigger className={errors.category_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Wählen Sie eine Kategorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">{errors.category_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung *</Label>
            <Textarea
              id="description"
              placeholder="Beschreiben Sie Ihr Feature detailliert. Was soll es tun? Wie würde es Ihnen helfen?"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitMutation.isPending}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? 'Wird eingereicht...' : 'Feature einreichen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitFeatureDialog;