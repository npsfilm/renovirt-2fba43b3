import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check both URL search params and hash for tokens
    const accessToken = searchParams.get('access_token') || 
                       new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    const refreshToken = searchParams.get('refresh_token') || 
                        new URLSearchParams(window.location.hash.substring(1)).get('refresh_token');
    const type = searchParams.get('type') || 
                new URLSearchParams(window.location.hash.substring(1)).get('type');
    
    console.log('Reset password page - Parameters:', {
      searchParams: Object.fromEntries(searchParams),
      hashParams: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1))),
      accessToken: accessToken ? 'present' : 'missing',
      type,
      fullUrl: window.location.href
    });

    if (!accessToken || type !== 'recovery') {
      console.log('Invalid reset link - missing token or wrong type');
      setError('Ungültiger oder abgelaufener Reset-Link.');
      return;
    }

    // Set the session with the tokens from URL
    const setSession = async () => {
      try {
        console.log('Setting session with tokens...');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });
        
        if (error) {
          console.error('Error setting session:', error);
          setError('Session konnte nicht wiederhergestellt werden.');
        } else {
          console.log('Session set successfully');
        }
      } catch (err) {
        console.error('Exception during session setup:', err);
        setError('Ein Fehler ist aufgetreten.');
      }
    };

    setSession();
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!password || !confirmPassword) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError('Fehler beim Aktualisieren des Passworts: ' + error.message);
      } else {
        toast.success('Passwort erfolgreich aktualisiert!');
        // Sign out and redirect to login
        await supabase.auth.signOut();
        navigate('/auth');
      }
    } catch (err: any) {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Neues Passwort festlegen</CardTitle>
          <p className="text-sm text-muted-foreground">
            Wählen Sie ein neues sicheres Passwort für Ihr Konto.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {error?.includes('Ungültiger oder abgelaufener') ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Der Reset-Link ist ungültig oder abgelaufen.
              </p>
              <Button onClick={handleGoToLogin} className="w-full">
                Zur Anmeldung
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Neues Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mindestens 6 Zeichen"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Passwort wiederholen"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Wird aktualisiert...' : 'Passwort aktualisieren'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button variant="link" onClick={handleGoToLogin} className="text-sm">
              Zurück zur Anmeldung
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;