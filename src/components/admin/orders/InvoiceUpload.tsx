
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface InvoiceUploadProps {
  orderId: string;
  existingInvoices?: Array<{
    id: string;
    file_name: string;
    file_size: number;
    created_at: string;
    uploaded_by_name: string;
  }>;
}

const InvoiceUpload = ({ orderId, existingInvoices = [] }: InvoiceUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      const fileName = `${orderId}/invoice-${Date.now()}-${file.name}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('order-invoices')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('order_invoices')
        .insert({
          order_id: orderId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: fileName,
          uploaded_by: user.id,
          uploaded_by_name: `${user.email}`,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast({
        title: "Rechnung hochgeladen",
        description: "Die Rechnung wurde erfolgreich hochgeladen.",
      });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload-Fehler",
        description: "Die Rechnung konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (invoice: any) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('order-invoices')
        .remove([invoice.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('order_invoices')
        .delete()
        .eq('id', invoice.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast({
        title: "Rechnung gelöscht",
        description: "Die Rechnung wurde erfolgreich gelöscht.",
      });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Nur PDF- und Bilddateien sind erlaubt.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Die Datei darf maximal 10MB groß sein.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
    event.target.value = '';
  };

  const downloadInvoice = async (invoice: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('order-invoices')
        .download(invoice.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = invoice.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download-Fehler",
        description: "Die Datei konnte nicht heruntergeladen werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Rechnungen</h4>
        <div>
          <input
            type="file"
            id={`invoice-upload-${orderId}`}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            size="sm"
            onClick={() => document.getElementById(`invoice-upload-${orderId}`)?.click()}
            disabled={uploadMutation.isPending}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadMutation.isPending ? 'Wird hochgeladen...' : 'Rechnung hochladen'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {existingInvoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">{invoice.file_name}</p>
                <p className="text-xs text-gray-500">
                  Hochgeladen von {invoice.uploaded_by_name} am{' '}
                  {new Date(invoice.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadInvoice(invoice)}
              >
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteMutation.mutate(invoice)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {existingInvoices.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Noch keine Rechnungen hochgeladen
          </p>
        )}
      </div>
    </div>
  );
};

export default InvoiceUpload;
