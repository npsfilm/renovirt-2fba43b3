
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

interface AdminRegisterFormProps {
  onSuccess: () => void;
}

const AdminRegisterForm = ({ onSuccess }: AdminRegisterFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register with admin role
      const { error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'admin', // Automatically set as admin
      });

      if (error) {
        toast({
          title: 'Admin-Registrierung fehlgeschlagen',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Admin-Registrierung erfolgreich',
          description: 'Ihr Admin-Konto wurde erstellt!',
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="w-12 h-12 text-red-600" />
        </div>
        <CardTitle className="text-2xl">Admin Konto erstellen</CardTitle>
        <CardDescription>
          Neues Management-Konto registrieren
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admin-firstName">Vorname</Label>
              <Input
                id="admin-firstName"
                name="firstName"
                placeholder="Max"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-lastName">Nachname</Label>
              <Input
                id="admin-lastName"
                name="lastName"
                placeholder="Mustermann"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-registerEmail">Admin E-Mail</Label>
            <Input
              id="admin-registerEmail"
              name="email"
              type="email"
              placeholder="admin@renovirt.de"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-registerPassword">Passwort</Label>
            <Input
              id="admin-registerPassword"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Hinweis:</strong> Dieses Konto wird automatisch mit Admin-Berechtigung erstellt.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700" 
            disabled={loading}
          >
            {loading ? 'Wird erstellt...' : 'Admin Konto erstellen'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/auth" className="hover:text-primary">
            ← Zurück zur normalen Registrierung
          </Link>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          Mit der Registrierung stimmen Sie unseren{' '}
          <Link to="/terms" className="hover:text-primary">
            AGB
          </Link>{' '}
          und der{' '}
          <Link to="/privacy" className="hover:text-primary">
            Datenschutzerklärung
          </Link>{' '}
          zu.
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRegisterForm;
