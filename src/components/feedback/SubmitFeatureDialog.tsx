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
import { CheckCircle, Loader2, Lightbulb } from 'lucide-react';

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

  const [isSuccess, setIsSuccess] = useState(false);

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
      setIsSuccess(true);
      
      toast({
        title: 'Feature erfolgreich eingereicht',
        description: 'Vielen Dank für Ihren Vorschlag! Wir werden ihn prüfen.',
      });
      
      // Show success state for 2 seconds then close
      setTimeout(() => {
        setFormData({ title: '', description: '', category_id: '' });
        setErrors({ title: '', description: '', category_id: '' });
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);
      
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !submitMutation.isPending) {
      setFormData({ title: '', description: '', category_id: '' });
      setErrors({ title: '', description: '', category_id: '' });
      setIsSuccess(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Feature vorschlagen
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <CheckCircle className="h-16 w-16 text-green-500 animate-scale-in mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Feature erfolgreich eingereicht!
            </h3>
            <p className="text-muted-foreground text-center">
              Vielen Dank für Ihren Vorschlag. Wir werden ihn prüfen und Sie informieren.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                placeholder="Kurzer, aussagekräftiger Titel für Ihr Feature"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`transition-all duration-200 ${
                  errors.title 
                    ? 'border-destructive focus:ring-destructive/20' 
                    : 'focus:ring-primary/20'
                }`}
              />
              {errors.title && (
                <p className="text-sm text-destructive animate-fade-in">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategorie *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleInputChange('category_id', value)}
              >
                <SelectTrigger className={`transition-all duration-200 ${
                  errors.category_id 
                    ? 'border-destructive focus:ring-destructive/20' 
                    : 'focus:ring-primary/20'
                }`}>
                  <SelectValue placeholder="Wählen Sie eine Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full animate-scale-in"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive animate-fade-in">{errors.category_id}</p>
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
                className={`transition-all duration-200 ${
                  errors.description 
                    ? 'border-destructive focus:ring-destructive/20' 
                    : 'focus:ring-primary/20'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-destructive animate-fade-in">{errors.description}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={submitMutation.isPending}
                className="transition-all duration-200 hover:scale-105"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="transition-all duration-200 hover:scale-105"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird eingereicht...
                  </>
                ) : (
                  'Feature einreichen'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitFeatureDialog;