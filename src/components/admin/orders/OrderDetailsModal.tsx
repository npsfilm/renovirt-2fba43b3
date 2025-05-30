
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Image, FileText, Package } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import { downloadFile } from '@/utils/fileDownloadService';
import { createOrderNotification } from '@/utils/notificationService';

interface OrderDetailsModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ orderId, isOpen, onClose }: OrderDetailsModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer_profiles!fk_orders_customer_profiles (
            first_name,
            last_name,
            company,
            phone,
            address
          ),
          order_images (
            id,
            file_name,
            file_size,
            file_type,
            storage_path,
            created_at
          ),
          packages (
            name,
            description
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setSelectedStatus(data.status || 'pending');
      setNotes(data.admin_notes || '');
      return data;
    },
    enabled: isOpen,
  });

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(notes && { admin_notes: notes })
        })
        .eq('id', orderId);

      if (error) throw error;

      // Create notification for customer
      if (order?.user_id && status !== order.status) {
        const statusMessages = {
          'pending': 'Ihre Bestellung wird bearbeitet',
          'processing': 'Ihre Bestellung ist in Bearbeitung',
          'ready_for_review': 'Ihre Bestellung ist zur Überprüfung bereit',
          'completed': 'Ihre Bestellung wurde abgeschlossen',
          'cancelled': 'Ihre Bestellung wurde storniert'
        };

        await createOrderNotification({
          order_id: orderId,
          user_id: order.user_id,
          title: 'Bestellstatus aktualisiert',
          message: statusMessages[status as keyof typeof statusMessages] || 'Status wurde aktualisiert',
          type: status === 'completed' ? 'success' : 'info'
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Status aktualisiert",
        description: "Der Bestellstatus wurde erfolgreich aktualisiert.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  // Upload files to order
  const uploadFilesMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${orderId}/${Date.now()}-${file.name}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('order-deliverables')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('order_images')
          .insert({
            order_id: orderId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: fileName,
          });

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);

      // Notify customer about new files
      if (order?.user_id) {
        await createOrderNotification({
          order_id: orderId,
          user_id: order.user_id,
          title: 'Neue Dateien verfügbar',
          message: `${files.length} neue Datei(en) wurden zu Ihrer Bestellung hinzugefügt`,
          type: 'success'
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Dateien hochgeladen",
        description: "Die Dateien wurden erfolgreich hochgeladen.",
      });
      setUploadFiles(null);
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
    },
    onError: () => {
      toast({
        title: "Upload-Fehler",
        description: "Die Dateien konnten nicht hochgeladen werden.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = () => {
    updateStatusMutation.mutate({ status: selectedStatus, notes });
  };

  const handleFileUpload = () => {
    if (uploadFiles && uploadFiles.length > 0) {
      uploadFilesMutation.mutate(uploadFiles);
    }
  };

  const handleFileDownload = async (image: any) => {
    try {
      const bucket = image.storage_path.includes('order-deliverables') ? 'order-deliverables' : 'order-images';
      await downloadFile(bucket, image.storage_path, image.file_name);
      toast({
        title: "Download gestartet",
        description: `${image.file_name} wird heruntergeladen...`,
      });
    } catch (error) {
      toast({
        title: "Download-Fehler",
        description: "Die Datei konnte nicht heruntergeladen werden.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    if (fileType.includes('zip')) return <Package className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bestellung #{order?.id.slice(0, 8)}
            <OrderStatusBadge status={order?.status || 'pending'} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bestellinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Kunde</Label>
                <p className="text-sm">
                  {order?.customer_profiles?.first_name} {order?.customer_profiles?.last_name}
                </p>
                {order?.customer_profiles?.company && (
                  <p className="text-xs text-gray-500">{order?.customer_profiles?.company}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">E-Mail</Label>
                <p className="text-sm">{order?.customer_email}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Paket</Label>
                <p className="text-sm">{order?.packages?.name || 'N/A'}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Bilder</Label>
                <p className="text-sm">{order?.image_count || 0}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Gesamtpreis</Label>
                <p className="text-sm font-bold">€{parseFloat(order?.total_price?.toString() || '0').toFixed(2)}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Erstellt am</Label>
                <p className="text-sm">{new Date(order?.created_at).toLocaleDateString('de-DE')}</p>
              </div>

              {order?.admin_notes && (
                <div>
                  <Label className="text-sm font-medium">Admin-Notizen</Label>
                  <p className="text-sm text-gray-600">{order.admin_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status verwalten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status ändern</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="processing">In Bearbeitung</SelectItem>
                    <SelectItem value="ready_for_review">Zur Überprüfung bereit</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                    <SelectItem value="cancelled">Storniert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Admin-Notizen</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Interne Notizen hinzufügen..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending}
                className="w-full"
              >
                {updateStatusMutation.isPending ? 'Wird aktualisiert...' : 'Status aktualisieren'}
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dateien hochladen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Bearbeitete Bilder, Rechnungen, etc.</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.zip"
                  onChange={(e) => setUploadFiles(e.target.files)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unterstützte Formate: Bilder, PDF, ZIP
                </p>
              </div>

              <Button
                onClick={handleFileUpload}
                disabled={!uploadFiles || uploadFiles.length === 0 || uploadFilesMutation.isPending}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadFilesMutation.isPending ? 'Wird hochgeladen...' : 'Dateien hochladen'}
              </Button>
            </CardContent>
          </Card>

          {/* Order Files */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bestelldateien ({order?.order_images?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {order?.order_images?.map((image) => (
                  <div key={image.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getFileIcon(image.file_type)}
                      <div>
                        <p className="text-sm font-medium">{image.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {(image.file_size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleFileDownload(image)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Keine Dateien vorhanden
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
