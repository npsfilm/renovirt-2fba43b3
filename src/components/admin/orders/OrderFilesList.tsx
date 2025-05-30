
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image, FileText, Package } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface OrderFilesListProps {
  order: ExtendedOrder | undefined;
  onFileDownload: (image: any) => void;
}

const OrderFilesList = ({ order, onFileDownload }: OrderFilesListProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    if (fileType.includes('zip')) return <Package className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
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
                onClick={() => onFileDownload(image)}
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
  );
};

export default OrderFilesList;
