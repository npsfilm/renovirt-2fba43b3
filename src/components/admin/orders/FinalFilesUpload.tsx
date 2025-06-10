
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Package, Download, FileText, Image } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface FinalFilesUploadProps {
  order: ExtendedOrder | undefined;
  orderId: string;
}

const FinalFilesUpload = ({ order, orderId }: FinalFilesUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      if (!user) throw new Error('Benutzer nicht authentifiziert');

      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${orderId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('order-deliverables')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Add record to order_images table
        const { error: dbError } = await supabase
          .from('order_images')
          .insert({
            order_id: orderId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: filePath,
          });

        if (dbError) throw dbError;

        return {
          fileName: file.name,
          filePath,
          fileSize: file.size,
          fileType: file.type,
        };
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      toast({
        title: "Upload erfolgreich",
        description: `${results.length} finale Datei(en) wurden hochgeladen.`,
      });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload-Fehler",
        description: "Die Dateien konnten nicht hochgeladen werden.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync(files);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const finalFiles = order?.order_images?.filter(img => 
    img.storage_path.includes('order-deliverables')
  ) || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4" />
          Finale Dateien ({finalFiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button
            onClick={() => document.getElementById('final-files-upload')?.click()}
            disabled={isUploading}
            className="w-full flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Wird hochgeladen...' : 'Finale Dateien hochladen'}
          </Button>
          <input
            id="final-files-upload"
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">
            Bearbeitete Bilder für den Kunden
          </p>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {finalFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                {getFileIcon(file.file_type)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.file_size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )) || (
            <p className="text-sm text-gray-500 text-center py-4">
              Noch keine finalen Dateien hochgeladen
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalFilesUpload;
