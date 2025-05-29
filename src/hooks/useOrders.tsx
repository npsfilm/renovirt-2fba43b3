
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface OrderData {
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  couponCode?: string;
  acceptedTerms: boolean;
}

export const useOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch packages
  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('base_price');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch add-ons
  const { data: addOns = [], isLoading: addOnsLoading } = useQuery({
    queryKey: ['add_ons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate total price
  const calculateTotalPrice = (orderData: OrderData) => {
    const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
    if (!selectedPackage) return 0;

    let total = selectedPackage.base_price;
    
    // Calculate effective image count for bracketing
    let imageCount = orderData.files.length;
    if (orderData.photoType === 'bracketing-3') {
      imageCount = Math.floor(orderData.files.length / 3);
    } else if (orderData.photoType === 'bracketing-5') {
      imageCount = Math.floor(orderData.files.length / 5);
    }

    // Multiply by image count
    total *= imageCount;

    // Add extras
    addOns.forEach(addon => {
      if (orderData.extras[addon.name as keyof typeof orderData.extras] && !addon.is_free) {
        total += addon.price * imageCount;
      }
    });

    return total;
  };

  // Upload files to storage
  const uploadFiles = async (files: File[], orderId: string, photoType?: string) => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${orderId}/${Date.now()}-${index}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('order-images')
        .upload(`${user?.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('order_images')
        .insert({
          order_id: orderId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: `${user?.id}/${fileName}`,
          is_bracketing_set: photoType?.startsWith('bracketing') || false,
        });

      if (dbError) throw dbError;
    });

    await Promise.all(uploadPromises);
  };

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderData) => {
      if (!user) throw new Error('User not authenticated');
      
      const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
      if (!selectedPackage) throw new Error('Package not found');

      const totalPrice = calculateTotalPrice(orderData);
      
      // Calculate effective image count for bracketing
      let imageCount = orderData.files.length;
      let bracketingEnabled = false;
      let bracketingExposures = 3;
      
      if (orderData.photoType === 'bracketing-3') {
        imageCount = Math.floor(orderData.files.length / 3);
        bracketingEnabled = true;
        bracketingExposures = 3;
      } else if (orderData.photoType === 'bracketing-5') {
        imageCount = Math.floor(orderData.files.length / 5);
        bracketingEnabled = true;
        bracketingExposures = 5;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          package_id: selectedPackage.id,
          customer_email: orderData.email,
          photo_type: orderData.photoType,
          image_count: imageCount,
          total_price: totalPrice,
          bracketing_enabled: bracketingEnabled,
          bracketing_exposures: bracketingExposures,
          terms_accepted: orderData.acceptedTerms,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Upload files
      await uploadFiles(orderData.files, order.id, orderData.photoType);

      // Add selected extras
      const selectedAddOns = addOns.filter(addon => 
        orderData.extras[addon.name as keyof typeof orderData.extras]
      );

      if (selectedAddOns.length > 0) {
        const { error: addOnsError } = await supabase
          .from('order_add_ons')
          .insert(
            selectedAddOns.map(addon => ({
              order_id: order.id,
              add_on_id: addon.id,
            }))
          );

        if (addOnsError) throw addOnsError;
      }

      return order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Bestellung erfolgreich erstellt!",
        description: `Ihre Bestellung ${order.id.slice(-6)} wurde erfolgreich übermittelt.`,
      });
    },
    onError: (error) => {
      console.error('Order creation error:', error);
      toast({
        title: "Fehler bei der Bestellung",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  return {
    packages,
    addOns,
    packagesLoading,
    addOnsLoading,
    calculateTotalPrice,
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
  };
};
