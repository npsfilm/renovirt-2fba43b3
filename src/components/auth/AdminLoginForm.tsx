
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess: () => void;
}

const AdminLoginForm = ({ onSuccess }: AdminLoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: 'Admin-Anmeldung fehlgeschlagen',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Admin erfolgreich angemeldet',
          description: 'Willkommen im Management Portal!',
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
        <CardTitle className="text-2xl">Admin Portal</CardTitle>
        <CardDescription>
          Melden Sie sich in das Management Portal an
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">E-Mail</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              placeholder="admin@renovirt.de"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Passwort</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? 'Wird angemeldet...' : 'Admin Anmelden'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/auth" className="hover:text-primary">
            ← Zurück zur normalen Anmeldung
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;
