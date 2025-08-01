
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Bell, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    marketingEmails: false,
    smsNotifications: false,
    orderUpdates: true,
  });

  // Fetch notification preferences
  const { data: notificationPrefs } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('marketing_emails, sms_notifications, order_updates')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Update notifications when data is fetched
  React.useEffect(() => {
    if (notificationPrefs) {
      setNotifications({
        marketingEmails: notificationPrefs.marketing_emails || false,
        smsNotifications: notificationPrefs.sms_notifications || false,
        orderUpdates: notificationPrefs.order_updates !== false,
      });
    }
  }, [notificationPrefs]);

  // Save notification preferences
  const saveNotificationsMutation = useMutation({
    mutationFn: async (newNotifications: typeof notifications) => {
      const { error } = await supabase
        .from('customer_profiles')
        .update({
          marketing_emails: newNotifications.marketingEmails,
          sms_notifications: newNotifications.smsNotifications,
          order_updates: newNotifications.orderUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Einstellungen gespeichert',
        description: 'Ihre Benachrichtigungseinstellungen wurden aktualisiert.',
      });
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', user?.id] });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Beim Speichern der Einstellungen ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    },
  });

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
  };

  const handleSaveNotifications = () => {
    saveNotificationsMutation.mutate(notifications);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'Löschen') {
      toast({
        title: 'Bestätigung erforderlich',
        description: 'Bitte geben Sie "Löschen" ein, um Ihr Konto zu löschen.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Send email to admin team (this would be handled by an edge function in production)
      const { error } = await supabase.functions.invoke('send-account-deletion-request', {
        body: { 
          userId: user?.id, 
          email: user?.email,
          requestedAt: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast({
        title: 'Löschungsanfrage gesendet',
        description: 'Ihr Konto wird von unserem Team manuell gelöscht. Sie erhalten eine Bestätigung per E-Mail.',
      });
      
      setDeleteConfirmation('');
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Beim Senden der Löschungsanfrage ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Einstellungen" 
            subtitle="Verwalten Sie Ihre Benachrichtigungen und Kontoeinstellungen"
          />
          <main className="flex-1 space-y-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-600" />
                  Benachrichtigungseinstellungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Bestellbestätigungen</Label>
                    <p className="text-sm text-gray-500">
                      Wichtige Updates zu Ihren Bestellungen (verpflichtend)
                    </p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={notifications.orderUpdates}
                    onCheckedChange={(value) => handleNotificationChange('orderUpdates', value)}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS-Benachrichtigungen</Label>
                    <p className="text-sm text-gray-500">
                      Wichtige Updates per SMS erhalten
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(value) => handleNotificationChange('smsNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing-E-Mails</Label>
                    <p className="text-sm text-gray-500">
                      Informationen über neue Features und Angebote
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(value) => handleNotificationChange('marketingEmails', value)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleSaveNotifications}
                    disabled={saveNotificationsMutation.isPending}
                  >
                    {saveNotificationsMutation.isPending ? 'Speichern...' : 'Einstellungen speichern'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Account löschen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-900 mb-2">Konto löschen</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Das Löschen Ihres Kontos kann nicht rückgängig gemacht werden. 
                    Alle Ihre Daten und Bestellungen werden permanent entfernt.
                    Eine E-Mail wird an unser Admin-Team gesendet und Ihr Konto wird manuell gelöscht.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="delete-confirmation" className="text-red-900">
                        Geben Sie "Löschen" ein, um zu bestätigen:
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Löschen"
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== 'Löschen'}
                    >
                      Konto löschen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
