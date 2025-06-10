
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CustomerInvoicesListProps {
  invoices: Array<{
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    storage_path: string;
    uploaded_by_name: string;
    created_at: string;
  }>;
}

const CustomerInvoicesList = ({ invoices }: CustomerInvoicesListProps) => {
  const { toast } = useToast();

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

      toast({
        title: "Download gestartet",
        description: `${invoice.file_name} wird heruntergeladen...`,
      });
    } catch (error) {
      toast({
        title: "Download-Fehler",
        description: "Die Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive",
      });
    }
  };

  if (!invoices || invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Rechnungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Noch keine Rechnungen verfügbar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Rechnungen ({invoices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{invoice.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Erstellt am {new Date(invoice.created_at).toLocaleDateString('de-DE')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(invoice.file_size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => downloadInvoice(invoice)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInvoicesList;
